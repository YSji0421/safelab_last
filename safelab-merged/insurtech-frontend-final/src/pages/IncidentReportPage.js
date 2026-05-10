import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSeverityMeta, getReportingChain } from '../data/incidentTypes';
import { DEPARTMENT_LIST, getDepartment } from '../data/departments';
import './IncidentReportPage.css';

// 사고 보고서 자동 작성 (DEPT-4) + 학과 담당자 자동 통보 (DEPT-5)
// IncidentPhotoPage 분석 결과를 인하공전 표준 양식에 자동으로 채움.
// 신고 시한 카운트다운 + 제출 시 학과 담당자 알림 발송 모의.

// 사고등급별 신고 마감 시간 (분 단위)
const DEADLINE_MINUTES = {
  '심각': 0,        // 즉시
  '경계': 60,       // 1시간 이내
  '주의': 24 * 60,  // 1일 (근무일 기준)
  '관심': 72 * 60,  // 3일 (내부 기록)
};

export default function IncidentReportPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // IncidentPhotoPage에서 navigate state로 result + photo 전달.
  // 직접 진입 시 빈 폼.
  const initial = location.state?.result || null;
  const photoData = location.state?.photoData || null; // base64 or URL

  const [reporter, setReporter] = useState({
    studentNo: '',
    name: '',
    deptId: '',
  });
  const [incidentTime, setIncidentTime] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  });
  const [location_, setLocation] = useState('');
  const [description, setDescription] = useState(
    initial ? `[AI 자동 분석] ${initial.type?.name} 가능성 ${Math.round((initial.confidence || 0) * 100)}%.\n관찰: ${initial.observed || ''}` : ''
  );
  const [submitted, setSubmitted] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // 자동 채움 데이터
  const incidentType = initial?.type;
  const severity = initial?.pdfSeverity || initial?.type?.pdfSeverity || '관심';
  const sevMeta = getSeverityMeta(severity);
  const chain = getReportingChain(severity);

  const reportTime = useMemo(() => new Date(incidentTime).getTime(), [incidentTime]);
  const deadlineMs = (DEADLINE_MINUTES[severity] ?? 72 * 60) * 60 * 1000;
  const deadline = reportTime + deadlineMs;
  const remaining = deadline - now;
  const elapsed = now - reportTime;
  const dept = reporter.deptId ? getDepartment(reporter.deptId) : null;

  const valid =
    reporter.studentNo.trim().length >= 8 &&
    reporter.name.trim().length >= 2 &&
    reporter.deptId &&
    location_.trim().length >= 2 &&
    description.trim().length >= 10;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    const reportNo = 'IR-' + Date.now().toString().slice(-8);
    const record = {
      reportNo,
      submittedAt: new Date().toISOString(),
      incidentTime,
      severity,
      severityMeta: sevMeta,
      reporter,
      dept: dept ? { id: dept.id, name: dept.name } : null,
      location: location_,
      description,
      aiAnalysis: initial ? {
        type: initial.type?.name,
        confidence: initial.confidence,
        observed: initial.observed,
      } : null,
      reportingChain: chain,
      deadline: new Date(deadline).toISOString(),
    };

    try {
      // 사고 보고서 저장
      localStorage.setItem(`safelab.report.${reportNo}`, JSON.stringify(record));

      // DEPT-5: 학과 담당자 알림함에 추가 (자동 통보)
      if (dept) {
        const key = `safelab.dept-notifications.${dept.id}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift({
          id: reportNo,
          type: 'incident',
          severity,
          title: `${incidentType?.name || '사고'} — ${reporter.name}`,
          location: location_,
          createdAt: new Date().toISOString(),
          read: false,
        });
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
      }
    } catch {}

    setSubmitted(record);
  };

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />

      <div className="ir-frame">
        <header className="ir-header">
          <button className="ir-back" onClick={() => navigate(-1)} aria-label="뒤로">←</button>
          <div className="ir-header__title">
            <h1>사고 보고서 자동 작성</h1>
            <p>AI 분석 결과 → 인하공전 표준 양식 자동 입력 + 학과 담당자 즉시 통보</p>
          </div>
          <div className="ir-header__right" />
        </header>

        <main className="ir-main">
          {/* AI 분석 요약 */}
          {initial && (
            <article className="ir-ai-summary">
              <div className="ir-ai-summary__head">
                <span className="eyebrow">AI Auto-Filled</span>
                <h2>Gemini Vision 분석 결과 — 보고서에 자동 반영</h2>
              </div>
              <div className="ir-ai-summary__grid">
                {photoData && (
                  <img className="ir-ai-summary__photo" src={photoData} alt="사고 현장" />
                )}
                <div className="ir-ai-summary__detail">
                  <div className="ir-ai-summary__row">
                    <dt>분류</dt>
                    <dd><strong>{incidentType?.name || '미분류'}</strong> ({Math.round((initial.confidence || 0) * 100)}% 신뢰도)</dd>
                  </div>
                  <div className="ir-ai-summary__row">
                    <dt>등급</dt>
                    <dd><span className={`ir-sev pill ${sevPill(severity)}`}>{severity}</span></dd>
                  </div>
                  <div className="ir-ai-summary__row">
                    <dt>관찰</dt>
                    <dd>{initial.observed || '-'}</dd>
                  </div>
                </div>
              </div>
            </article>
          )}

          {!submitted && (
            <>
              {/* 신고 시한 카운트다운 */}
              <article className={`ir-countdown ir-countdown--${sevTone(severity)}`}>
                <div className="ir-countdown__icon">⏱</div>
                <div className="ir-countdown__body">
                  <strong>{severity} 등급 — 신고 시한 카운트다운</strong>
                  <p>{deadlineLabel(severity)}</p>
                </div>
                <div className="ir-countdown__time">
                  {remaining > 0
                    ? <><span className="ir-countdown__num">{formatRemaining(remaining)}</span><small>남음</small></>
                    : <><span className="ir-countdown__num ir-countdown__over">{formatRemaining(-remaining)}</span><small>경과</small></>
                  }
                </div>
              </article>

              {/* 보고서 폼 */}
              <form className="glass-card ir-form" onSubmit={submit}>
                <fieldset className="ir-fieldset">
                  <legend>📝 신고자 정보</legend>
                  <div className="ir-grid-2">
                    <label className="ir-field">
                      <span>학번 *</span>
                      <input type="text" inputMode="numeric"
                        value={reporter.studentNo}
                        onChange={(e) => setReporter({ ...reporter, studentNo: e.target.value })} />
                    </label>
                    <label className="ir-field">
                      <span>이름 *</span>
                      <input type="text"
                        value={reporter.name}
                        onChange={(e) => setReporter({ ...reporter, name: e.target.value })} />
                    </label>
                    <label className="ir-field ir-field--full">
                      <span>학과 *</span>
                      <select value={reporter.deptId}
                        onChange={(e) => setReporter({ ...reporter, deptId: e.target.value })}>
                        <option value="">선택하세요 (학과 담당자에게 자동 통보)</option>
                        {DEPARTMENT_LIST.map((d) => (
                          <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </fieldset>

                <fieldset className="ir-fieldset">
                  <legend>📍 사고 정보</legend>
                  <div className="ir-grid-2">
                    <label className="ir-field">
                      <span>발생 일시 *</span>
                      <input type="datetime-local"
                        value={incidentTime}
                        onChange={(e) => setIncidentTime(e.target.value)} />
                    </label>
                    <label className="ir-field">
                      <span>발생 장소 *</span>
                      <input type="text" placeholder="예: 11호관 305호 화학실험실"
                        value={location_}
                        onChange={(e) => setLocation(e.target.value)} />
                    </label>
                    <label className="ir-field ir-field--full">
                      <span>사고 경위 (AI 분석 결과 자동 입력) *</span>
                      <textarea rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    </label>
                  </div>
                </fieldset>

                {/* 신고 체인 (자동) */}
                <fieldset className="ir-fieldset">
                  <legend>📞 신고 체인 — 사고등급에 따라 자동 결정</legend>
                  <ol className="ir-chain">
                    {chain.map((step, i) => (
                      <li key={i} className="ir-chain__step">
                        <span className="ir-chain__num">{i + 1}</span>
                        <div>
                          <strong>{step.label || step}</strong>
                          {typeof step === 'object' && step.detail && <small>{step.detail}</small>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </fieldset>

                <div className="ir-actions">
                  <button type="button" className="t-btn t-btn-ghost" onClick={() => navigate('/incident/photo')}>
                    사진 다시 분석
                  </button>
                  <button type="submit" className="t-btn t-btn-primary" disabled={!valid}>
                    {valid ? '🚨 보고서 제출 + 학과 담당자 즉시 통보' : '필수 항목을 모두 입력해주세요'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* 제출 완료 */}
          {submitted && (
            <article className="glass-card ir-done">
              <div className="ir-done__check">✓</div>
              <h2>사고 보고서 제출 완료</h2>
              <p>
                <strong>{submitted.reporter.name}</strong>님 사고 보고서가 접수되었으며,
                <strong>{submitted.dept?.name} 담당자에게 즉시 통보</strong>되었습니다.
                약관 제11조 통지 의무가 이행되었습니다.
              </p>
              <dl className="ir-done__dl">
                <div><dt>접수번호</dt><dd>{submitted.reportNo}</dd></div>
                <div><dt>등급</dt><dd>{submitted.severity}</dd></div>
                <div><dt>신고 마감</dt><dd>{new Date(submitted.deadline).toLocaleString('ko-KR')}</dd></div>
                <div><dt>학과 통보</dt><dd>✓ {submitted.dept?.name}</dd></div>
              </dl>

              <div className="ir-done__notice">
                <strong>다음 자동 단계</strong>
                <ul>
                  <li>학과 담당자 화면 (/admin/dept/{submitted.dept?.id})에 신규 알림 표시</li>
                  <li>학사지원팀(032-870-2030)에 사본 자동 발송 — 「실습실 안전관리규정」 3일 이내 보고</li>
                  {submitted.severity === '심각' && <li>⚠ 심각 등급: 학교장 + 교육부 안전대표 메일(moe119@moe.go.kr) 즉시 발송</li>}
                  {submitted.severity === '경계' && <li>⚠ 경계 등급: 학교장 1시간 이내 신속 보고</li>}
                  <li>한국교육시설안전원 14일 이내 본인 확인 연락 (보상 청구 전제)</li>
                </ul>
              </div>

              <div className="ir-actions">
                <button className="t-btn t-btn-ghost" onClick={() => navigate('/insurance/claim')}>
                  보상 청구로 이어가기
                </button>
                <button className="t-btn t-btn-primary"
                  onClick={() => navigate(`/admin/dept/${submitted.dept?.id || ''}`)}>
                  학과 담당자 화면 확인
                </button>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
function sevPill(s) {
  switch (s) {
    case '심각': return 'pill-red';
    case '경계': return 'pill-orange';
    case '주의': return 'pill-orange';
    case '관심': return 'pill-blue';
    default: return 'pill-gray';
  }
}
function sevTone(s) {
  switch (s) {
    case '심각': return 'critical';
    case '경계': return 'warn';
    case '주의': return 'caution';
    case '관심': return 'info';
    default: return 'info';
  }
}
function deadlineLabel(s) {
  switch (s) {
    case '심각': return '학교장 + 교육부에 즉시 보고. 119/112 동시 호출.';
    case '경계': return '학교장 1시간 이내 신속 보고. 학과 담당자 즉시 통보.';
    case '주의': return '학교장에게 근무일 기준 1일 이내 보고.';
    case '관심': return '대학 기관·단체 내부 기록 (3일 이내).';
    default: return '내부 기록.';
  }
}
function formatRemaining(ms) {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}시간 ${String(m).padStart(2, '0')}분 ${String(s).padStart(2, '0')}초`;
  if (m > 0) return `${m}분 ${String(s).padStart(2, '0')}초`;
  return `${s}초`;
}
