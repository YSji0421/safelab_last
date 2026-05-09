import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWebRTC } from '../hooks/useWebRTC';
import { analyzeConsultation } from '../services/gemini';
import { detectRisks } from '../services/riskDetector';
import { demoScripts } from '../data/demoScripts';
import { speak, cancelSpeak } from '../services/tts';
import AppShell from '../components/AppShell';
import './ConsultationRoomPage.css';

const AI_GREETING = "안녕하세요. 인하공전 학생 단체보험 AI 상담사 진아입니다. 실험실 사고, 실습 중 부상, 기자재 파손, 현장실습 상해 등 어떤 상황이든 편하게 말씀해 주세요.";
const AVATAR_NAME = "AI 상담사 진아";

export default function ConsultationRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showPdf, setShowPdf] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState('');
  const transcriptRef = useRef(null);
  const fullTextRef = useRef('');
  const seenRiskIdsRef = useRef(new Set());
  const greetedRef = useRef(false);

  const speakAsAvatar = useCallback((text) => {
    if (!text) return;
    setCurrentUtterance(text);
    speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => { setIsSpeaking(false); setCurrentUtterance(''); }
    });
    setTranscript(prev => [...prev, { speaker: '🤖 AI', text, time: new Date().toLocaleTimeString('ko-KR'), isAi: true }]);
  }, []);

  const onTranscript = useCallback((text) => {
    fullTextRef.current += ' ' + text;
    setTranscript(prev => [...prev, { speaker: '🎙️', text, time: new Date().toLocaleTimeString('ko-KR') }]);

    const risks = detectRisks(text);
    if (risks.length) {
      const newAlerts = risks
        .filter(r => !seenRiskIdsRef.current.has(r.keyword))
        .map(r => ({
          ...r,
          id: `${r.keyword}-${Date.now()}`,
          time: new Date().toLocaleTimeString('ko-KR')
        }));
      newAlerts.forEach(a => seenRiskIdsRef.current.add(a.keyword));
      if (newAlerts.length) {
        setRiskAlerts(prev => [...prev, ...newAlerts]);
        newAlerts.forEach(a => {
          setTimeout(() => {
            setRiskAlerts(prev => prev.filter(x => x.id !== a.id));
          }, a.severity === 'high' ? 15000 : 10000);
        });
      }
    }
  }, []);

  const { localVideoRef, remoteVideoRef, isConnected, isMicOn, isCamOn,
    networkStatus, sttActive, toggleMic, toggleCam, startSTT, stopSTT, hangup
  } = useWebRTC(roomId, onTranscript);

  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // 입장 시 1회 인사 (브라우저 정책상 사용자 상호작용 전 TTS 차단될 수 있어 2초 지연)
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    const t = setTimeout(() => speakAsAvatar(AI_GREETING), 2000);
    return () => { clearTimeout(t); cancelSpeak(); };
  }, [speakAsAvatar]);

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [transcript]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleAnalyze = async () => {
    const text = fullTextRef.current.trim() || "학생이 전자공학과 실험실에서 납땜 중에 인두로 손가락에 열화상을 입어 피부과 치료를 받고 있음. 학생 단체보험 상해의료비 청구 가능 여부와 실습 중 특별약관 적용 절차 상담 요청.";
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const result = await analyzeConsultation(text);
      setAiAnalysis(result);
      const spokenParts = [result.summary];
      if (result.actionItems?.length) {
        spokenParts.push("후속 조치를 안내드립니다. " + result.actionItems.slice(0, 3).map((a, i) => `${i + 1}번, ${a}`).join('. '));
      }
      if (result.settlementHint) spokenParts.push(result.settlementHint);
      speakAsAvatar(spokenParts.join(' '));
    } catch (e) { console.error(e); }
    setIsAnalyzing(false);
  };

  const loadDemoScript = (id) => {
    if (!id) return;
    const script = demoScripts.find(s => s.id === id);
    if (!script) return;
    fullTextRef.current = script.text;
    const risks = detectRisks(script.text);
    setTranscript(prev => [...prev, {
      speaker: '📋 시연',
      text: `[${script.label}] 시나리오 스크립트 로드 — "${script.text.slice(0, 40)}…"`,
      time: new Date().toLocaleTimeString('ko-KR'),
      isAi: true
    }]);
    if (risks.length) {
      const newAlerts = risks
        .filter(r => !seenRiskIdsRef.current.has(r.keyword))
        .map(r => ({ ...r, id: `${r.keyword}-${Date.now()}-${Math.random()}`, time: new Date().toLocaleTimeString('ko-KR') }));
      newAlerts.forEach(a => seenRiskIdsRef.current.add(a.keyword));
      if (newAlerts.length) {
        setRiskAlerts(prev => [...prev, ...newAlerts]);
        newAlerts.forEach(a => setTimeout(() => setRiskAlerts(prev => prev.filter(x => x.id !== a.id)), a.severity === 'high' ? 15000 : 10000));
      }
    }
  };

  const endCall = () => {
    hangup();
    const history = JSON.parse(localStorage.getItem('consultHistory') || '[]');
    history.unshift({
      roomId, date: new Date().toLocaleString('ko-KR'),
      title: `AI 상담 - ${new Date().toLocaleDateString('ko-KR')}`,
      transcript: transcript, analysis: aiAnalysis, duration: elapsed
    });
    localStorage.setItem('consultHistory', JSON.stringify(history));
    navigate(`/insurance/summary/${roomId}`);
  };

  const statusColor = { connected: '#10b981', connecting: '#f59e0b', local_only: '#6b7280', disconnected: '#ef4444', error: '#ef4444' };
  const statusLabel = { connected: '연결됨', connecting: '연결 중...', local_only: '로컬 모드', disconnected: '연결 끊김', error: '오류' };

  return (
    <AppShell variant="room-shell" noFrame>
      <div className="room-wrap">
      {/* ── 좌: PDF 약관 패널 ── */}
      {showPdf && (
        <aside className="panel-pdf">
          <div className="panel-hdr">
            <span>📄 인하공전 학생 단체보험 약관</span>
            <button className="close-btn" onClick={() => setShowPdf(false)}>✕</button>
          </div>
          <div className="pdf-scroll">
            <div className="pdf-doc">
              <h4>인하공전 학생 단체보험 약관 (발췌)</h4>
              <h5>제8조 (상해의료비 담보)</h5>
              <p>① 피보험자(재학생)가 교내·외 교육활동 중 급격하고 우연한 외래의 사고로 신체에 상해를 입은 경우, 실제 부담한 치료비를 한도 내 보상합니다.</p>
              <p>② 실험실·실습실에서 발생한 화학약품 화상, 열상, 감전 등은 본 조에 해당합니다.</p>
              <h5>제10조 (입원일당 특약)</h5>
              <p>① 상해로 4일 이상 입원 시, 1일당 정액을 지급합니다(최대 180일).</p>
              <h5>제14조 (일상생활 배상책임)</h5>
              <p>① 피보험자가 과실로 타인의 신체 또는 재물에 손해를 입힌 경우 법률상 배상책임액을 한도 내 보상합니다.</p>
              <p>② 학교 기자재 파손은 본 조 적용 대상이나, 고의·중과실은 제16조에 따라 면책됩니다.</p>
              <h5>제16조 (면책 조항)</h5>
              <p>① 피보험자의 고의, 중대한 과실, 음주·무면허 상태에서 발생한 사고는 보상하지 않습니다.</p>
              <h5>제22조 (실습 중 특별약관)</h5>
              <p>① 교내 실험·실습 수업 중 발생한 사고는 본 특별약관이 우선 적용됩니다.</p>
              <p>② 실험실 안전수칙(보호장비 착용, 흄후드 사용 등) 위반은 과실 평가 시 고려합니다.</p>
              <h5>제25조 (현장실습 특별약관)</h5>
              <p>① 산학협력 현장실습·인턴십 기간 중 업무상 사고는 산재보험 우선 적용 후 미보상액에 한해 보상합니다.</p>
              <p>② 현장실습표준협약서와 출근부 등 증빙을 첨부하여야 합니다.</p>
            </div>
            {aiAnalysis?.clauseRefs && (
              <div className="clause-highlight">
                <p className="clause-title">🔍 AI 추출 관련 약관</p>
                {aiAnalysis.clauseRefs.map((c, i) => (
                  <span key={i} className="clause-tag">{c}</span>
                ))}
              </div>
            )}
          </div>
          <div className="panel-foot">
            <button className="btn-upload">📁 PDF 업로드</button>
          </div>
        </aside>
      )}

      {/* ── 중: 화상 통화 ── */}
      <main className="panel-video">
        <div className="video-topbar">
          {!showPdf && <button className="icon-btn" onClick={() => setShowPdf(true)}>📄</button>}
          <span className="room-label">방 {roomId.slice(-8)}</span>
          <span className="timer-badge">⏱ {fmt(elapsed)}</span>
          <span className="status-dot" style={{ background: isSpeaking ? '#10b981' : '#6b7280' }}>
            ● {isSpeaking ? 'AI 발화 중' : '대기 중'}
          </span>
          <select
            className="demo-preset-select"
            defaultValue=""
            onChange={e => { loadDemoScript(e.target.value); e.target.value = ''; }}
            title="시연용 시나리오를 선택하면 STT 없이 즉시 매칭 데모를 진행할 수 있습니다"
          >
            <option value="" disabled>📋 시연 시나리오 선택</option>
            {demoScripts.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {riskAlerts.length > 0 && (
          <div className="risk-alert-stack">
            {riskAlerts.map(a => (
              <div key={a.id} className={`risk-alert risk-${a.severity}`}>
                <span className="risk-icon">{a.severity === 'high' ? '🚨' : a.severity === 'medium' ? '⚠️' : 'ℹ️'}</span>
                <span className="risk-msg">{a.message}</span>
                <span className="risk-kw">"{a.keyword}"</span>
                <span className="risk-time">{a.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* AI 아바타 영역 */}
        <div className="remote-area ai-avatar-area">
          <video ref={remoteVideoRef} autoPlay playsInline className="video-remote hidden" />
          <div className={`ai-avatar-stage ${isSpeaking ? 'speaking' : ''}`}>
            <div className="ai-avatar-ring ring-1" />
            <div className="ai-avatar-ring ring-2" />
            <div className="ai-avatar-ring ring-3" />
            <div className="ai-avatar-circle">
              <div className="ai-avatar-face">🤖</div>
              <div className={`ai-avatar-mouth ${isSpeaking ? 'talking' : ''}`} />
            </div>
            <div className="ai-avatar-label">
              <div className="ai-avatar-name">{AVATAR_NAME}</div>
              <div className="ai-avatar-role">인하공전 학생 단체보험 AI 상담사</div>
            </div>
          </div>
          {currentUtterance && (
            <div className="ai-speech-bubble">
              <span className="speech-dot" /> {currentUtterance}
            </div>
          )}
        </div>

        {/* 로컬 비디오 (PIP) */}
        <div className="local-pip">
          <video ref={localVideoRef} autoPlay muted playsInline className="video-local" />
          {!isCamOn && <div className="cam-off">📷 OFF</div>}
        </div>

        {/* 컨트롤 바 */}
        <div className="ctrl-bar">
          <button className={`ctrl-btn ${isMicOn ? '' : 'off'}`} onClick={toggleMic} title="마이크">
            {isMicOn ? '🎤' : '🔇'}
          </button>
          <button className={`ctrl-btn ${isCamOn ? '' : 'off'}`} onClick={toggleCam} title="카메라">
            {isCamOn ? '📹' : '🚫'}
          </button>
          <button
            className={`ctrl-btn stt-btn ${sttActive ? 'active' : ''}`}
            onClick={sttActive ? stopSTT : startSTT}
            title="음성 인식"
          >
            {sttActive ? '🔴 STT 중지' : '🎙️ STT 시작'}
          </button>
          <button className="ctrl-btn analyze-btn" onClick={handleAnalyze} disabled={isAnalyzing} title="AI 분석">
            {isAnalyzing ? '⏳ 분석 중...' : '🤖 AI 분석'}
          </button>
          <button className="ctrl-btn end-btn" onClick={endCall} title="통화 종료">📵 종료</button>
        </div>
      </main>

      {/* ── 우: AI 분석 패널 ── */}
      <aside className="panel-ai">
        <div className="panel-hdr">🤖 AI 실시간 분석</div>

        {/* 실시간 STT 스크립트 */}
        <div className="ai-section">
          <div className="section-title">📝 실시간 대화 기록</div>
          <div className="transcript-box" ref={transcriptRef}>
            {transcript.length === 0 ? (
              <p className="empty-msg">STT 시작 버튼을 누르면 음성이 자동으로 텍스트로 변환됩니다</p>
            ) : transcript.map((t, i) => (
              <div key={i} className={`transcript-row ${t.isAi ? 'ai-row' : ''}`}>
                <span className="t-speaker">{t.speaker}</span>
                <span className="t-time">{t.time}</span>
                <p className="t-text">{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI 분석 결과 */}
        {aiAnalysis && (
          <div className="analysis-box">
            <div className="section-title">
              ✦ 분석 결과
              {aiAnalysis.source === 'mock' && (
                <span className="source-badge source-mock" title={`시나리오 매칭 (score ${aiAnalysis.matchScore?.toFixed(2)})`}>
                  📚 사전 매칭: {aiAnalysis.matchedScenarioName}
                </span>
              )}
              {aiAnalysis.source === 'ai' && (
                <span className="source-badge source-ai">🌐 Gemini 실시간</span>
              )}
              {aiAnalysis.source === 'fallback' && (
                <span className="source-badge source-fallback">⚙️ 기본 예시 (API 키 미설정)</span>
              )}
            </div>

            <div className="analysis-summary">{aiAnalysis.summary}</div>

            <div className="analysis-row">
              <span className="a-label">고객 감정</span>
              <span className={`tone-badge tone-${aiAnalysis.customerTone}`}>{aiAnalysis.customerTone}</span>
              <span className="a-label" style={{marginLeft:8}}>위험도</span>
              <span className={`risk-badge risk-${aiAnalysis.riskLevel}`}>{aiAnalysis.riskLevel}</span>
            </div>

            <div className="keywords-wrap">
              {aiAnalysis.keywords?.map((k, i) => <span key={i} className="kw-tag">{k}</span>)}
            </div>

            <div className="a-label" style={{marginTop:8}}>후속 조치</div>
            <ul className="action-list">
              {aiAnalysis.actionItems?.map((a, i) => <li key={i}>→ {a}</li>)}
            </ul>

            <div className="settlement-hint">
              💡 {aiAnalysis.settlementHint}
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="analyzing-spinner">
            <div className="spinner" />
            <p>Gemini AI 분석 중...</p>
          </div>
        )}

        <button className="btn-analyze-full" onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? '분석 중...' : '✦ AI 전체 분석 실행'}
        </button>
      </aside>
      </div>
    </AppShell>
  );
}
