import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeIncidentPhoto } from '../services/incidentVision';
import './IncidentPhotoPage.css';

export default function IncidentPhotoPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | analyzing | result | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const [camStarting, setCamStarting] = useState(false);

  // 페이지 떠날 때 카메라 정리
  useEffect(() => () => stopCamera(), []);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setError('');
    setPhase('idle');
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
    setPhase('idle');
    if (fileRef.current) fileRef.current.value = '';
  };

  const startCamera = async () => {
    setError('');
    setCamStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      // video element는 useEffect 패턴 대신 다음 tick 에 srcObject 설정
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch (err) {
      setError(
        err?.name === 'NotAllowedError'
          ? '카메라 접근이 차단되었습니다. 브라우저 권한을 허용해주세요.'
          : '카메라를 사용할 수 없습니다. (' + (err?.message || err) + ')'
      );
    } finally {
      setCamStarting(false);
    }
  };

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext('2d')
      .drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const fileName = `incident-${Date.now()}.jpg`;
        const f = new File([blob], fileName, { type: 'image/jpeg' });
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
        setResult(null);
        setError('');
        setPhase('idle');
        stopCamera();
      },
      'image/jpeg',
      0.92
    );
  };

  const analyze = async () => {
    if (!file) return;
    setPhase('analyzing');
    setError('');
    try {
      const r = await analyzeIncidentPhoto(file);
      setResult(r);
      setPhase('result');
    } catch (err) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
      setPhase('error');
    }
  };

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      <div className="ip-frame">
        <header className="ip-header">
          <button
            className="ip-back"
            onClick={() => {
              stopCamera();
              navigate(-1);
            }}
            aria-label="뒤로"
          >
            ←
          </button>
          <div className="ip-header__title">
            <h1>사진으로 사고 신고</h1>
            <p>
              현장 사진을 올리면 AI가 사고 유형을 인식해 즉시 조치 단계와 약관을 안내합니다
            </p>
          </div>
          <div className="ip-header__right" />
        </header>

        <main className="ip-main">
          {/* ── 업로드 / 카메라 영역 ── */}
          {phase !== 'result' && (
            <section className="ip-section">
              <div className="ip-section__head">
                <span className="eyebrow">Step 1</span>
                <h2>사고 현장 사진</h2>
                <p>웹캠으로 바로 촬영하거나, 갤러리에서 사진을 선택하세요.</p>
              </div>

              <div
                className={`ip-dropzone ${previewUrl ? 'has-image' : ''} ${
                  cameraOn ? 'is-camera' : ''
                }`}
              >
                {/* hidden file input — 갤러리 선택용 */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="ip-file"
                  onChange={onPick}
                  aria-label="사진 업로드"
                />

                {cameraOn ? (
                  <div className="ip-camera">
                    <video
                      ref={videoRef}
                      className="ip-camera__video"
                      autoPlay
                      muted
                      playsInline
                    />
                    <div className="ip-camera__guide">
                      <span className="ip-camera__corner tl" />
                      <span className="ip-camera__corner tr" />
                      <span className="ip-camera__corner bl" />
                      <span className="ip-camera__corner br" />
                    </div>
                    <div className="ip-camera__bar">
                      <button
                        type="button"
                        className="ip-camera__cancel"
                        onClick={stopCamera}
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        className="ip-camera__shutter"
                        onClick={capturePhoto}
                        aria-label="촬영"
                      >
                        <span />
                      </button>
                      <span className="ip-camera__hint">📸 화면을 터치/클릭으로 촬영</span>
                    </div>
                  </div>
                ) : previewUrl ? (
                  <>
                    <img
                      className="ip-preview"
                      src={previewUrl}
                      alt="업로드한 사고 사진"
                    />
                    <div className="ip-preview__overlay">
                      <p className="ip-preview__name">{file?.name}</p>
                      <p className="ip-preview__size">
                        {(file?.size / 1024).toFixed(0)} KB · {file?.type}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="ip-dropzone__empty">
                    <div className="ip-dropzone__icon">📷</div>
                    <p className="ip-dropzone__title">
                      카메라로 즉시 촬영하거나 갤러리에서 선택하세요
                    </p>
                    <p className="ip-dropzone__hint">
                      📸 웹캠 / 후면 카메라 · 🖼 jpg · png · heic
                    </p>
                  </div>
                )}
              </div>

              {/* 액션 버튼들 */}
              {!cameraOn && (
                <div className="ip-action-row">
                  {previewUrl && (
                    <button
                      type="button"
                      className="t-btn t-btn-ghost"
                      onClick={reset}
                      disabled={phase === 'analyzing'}
                    >
                      다시 선택
                    </button>
                  )}
                  {!previewUrl && (
                    <>
                      <button
                        type="button"
                        className="t-btn t-btn-ghost"
                        onClick={() => fileRef.current?.click()}
                      >
                        🖼 갤러리에서 선택
                      </button>
                      <button
                        type="button"
                        className="t-btn t-btn-primary"
                        onClick={startCamera}
                        disabled={camStarting}
                      >
                        {camStarting ? '카메라 여는 중...' : '📷 카메라로 촬영'}
                      </button>
                    </>
                  )}
                  {previewUrl && (
                    <button
                      type="button"
                      className="t-btn t-btn-primary"
                      onClick={analyze}
                      disabled={phase === 'analyzing'}
                    >
                      {phase === 'analyzing' ? '분석 중...' : '✦ AI 분석 시작'}
                    </button>
                  )}
                </div>
              )}

              {phase === 'analyzing' && <AnalyzingProgress />}
              {(phase === 'error' || error) && (
                <div className="ip-banner ip-banner--error">⚠ {error || '오류가 발생했습니다.'}</div>
              )}
            </section>
          )}

          {/* ── 결과 ── */}
          {phase === 'result' && result && (
            <ResultView result={result} onRestart={reset} navigate={navigate} />
          )}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function AnalyzingProgress() {
  const steps = ['이미지 업로드', '시나리오 매칭', '약관 매핑', '조치 단계 생성'];
  return (
    <div className="ip-progress">
      <div className="ip-spinner" />
      <ul>
        {steps.map((s, i) => (
          <li key={s} className={`ip-progress__step ${i < 3 ? 'done' : 'active'}`}>
            <span className="ip-progress__dot" /> {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function ResultView({ result, onRestart, navigate }) {
  const t = result.type;
  const sevTone =
    t.severity === 'high'
      ? 'ip-result--high'
      : t.severity === 'medium'
      ? 'ip-result--med'
      : 'ip-result--low';

  return (
    <div className={`ip-result ${sevTone}`}>
      <div className="ip-result__top">
        <div className="ip-result__top-left">
          <span className="ip-result__icon" aria-hidden>
            {t.icon}
          </span>
          <div>
            <span className="eyebrow">사고 유형 매칭</span>
            <h2 className="ip-result__name">{t.name}</h2>
            <div className="ip-result__chips">
              <span className={`pill ${t.severity === 'high' ? 'pill-rose' : t.severity === 'medium' ? 'pill-orange' : 'pill-gray'}`}>
                {t.severityLabel}
              </span>
              <span className="pill pill-blue">
                Confidence {Math.round(result.confidence * 100)}%
              </span>
              <span className="pill pill-gray">
                {result.source === 'gemini'
                  ? 'Gemini Vision'
                  : result.source === 'gemini-fallback'
                  ? 'Gemini (재해석)'
                  : 'Mock 시나리오'}
              </span>
            </div>
          </div>
        </div>
        <button type="button" className="t-btn t-btn-ghost" onClick={onRestart}>
          다시 촬영
        </button>
      </div>

      <div className="ip-grid-2">
        <div className="glass-card">
          <h3 className="card-title">📷 사진에서 관찰</h3>
          <p className="ip-result__obs">{result.observed || '특이 관찰 없음'}</p>
        </div>
        <div className="glass-card">
          <h3 className="card-title">🩺 환자 상태 추정</h3>
          <p className="ip-result__obs">{result.victimStatus || '추정 불가'}</p>
          {result.additionalNotes && (
            <p className="ip-result__note">※ {result.additionalNotes}</p>
          )}
        </div>
      </div>

      <section className="ip-block">
        <div className="ip-block__head">
          <span className="eyebrow">즉시 조치</span>
          <h3>지금 바로 해야 할 단계</h3>
          <p>현장에서 위에서부터 순서대로 진행하세요.</p>
        </div>
        <ol className="ip-steps">
          {t.immediateSteps.map((s) => (
            <li key={s.num} className="ip-step">
              <span className="ip-step__num">{String(s.num).padStart(2, '0')}</span>
              <div>
                <h4>{s.title}</h4>
                {s.detail && <p>{s.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="ip-block">
        <div className="ip-block__head">
          <span className="eyebrow">연구실안전공제</span>
          <h3>적용 가능 보장 · 약관 인용</h3>
          <p>「연구실 안전환경 조성에 관한 법률」 제26조 기반 — 한국교육시설안전원</p>
        </div>
        <div className="ip-coverage">
          {t.coverage.map((c) => (
            <span key={c} className="ip-coverage__pill">
              {c}
            </span>
          ))}
        </div>
        <ul className="ip-clauses">
          {t.clauses.map((c) => (
            <li key={c.code} className="ip-clause">
              <code className="ip-clause__code">{c.code}</code>
              <p>{c.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="ip-cta-row">
        <button
          type="button"
          className="t-btn t-btn-primary"
          onClick={() => navigate('/emergency')}
        >
          🚨 긴급 연락처
        </button>
        <button
          type="button"
          className="t-btn t-btn-ghost"
          onClick={() => navigate('/insurance/consult')}
        >
          📞 공제 상담 시작
        </button>
        <button
          type="button"
          className="t-btn t-btn-ghost"
          onClick={onRestart}
        >
          다른 사진으로 분석
        </button>
      </div>
    </div>
  );
}
