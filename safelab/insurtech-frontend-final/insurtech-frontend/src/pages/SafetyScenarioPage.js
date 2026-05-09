import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDepartment } from '../data/departments';
import { generateSafetyScenario } from '../services/gemini';
import './SafetyScenarioPage.css';

export default function SafetyScenarioPage() {
  const { dept, sid } = useParams();
  const navigate = useNavigate();
  const department = getDepartment(dept);
  const scenario = department?.scenarios.find((s) => s.id === sid);

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('fallback');
  const [stepIdx, setStepIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    generateSafetyScenario(dept, sid).then((res) => {
      if (!alive) return;
      setSteps(res.steps || []);
      setSource(res.source);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [dept, sid]);

  if (!department || !scenario) {
    return (
      <div className="app-shell">
        <div className="mobile-frame">
          <div style={{ padding: 40, textAlign: 'center' }}>
            <p>시나리오를 찾을 수 없습니다.</p>
            <button className="t-btn t-btn-primary" onClick={() => navigate(`/student/safety/${dept}`)}>돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const total = steps.length;

  const handlePick = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    if (step.choices[idx].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      const sessionResult = { scenarioCorrect: score, total };
      sessionStorage.setItem(`safelab.scenarioResult.${sid}`, JSON.stringify(sessionResult));
      navigate(`/student/safety/${dept}/quiz/${sid}`);
      return;
    }
    setStepIdx((i) => i + 1);
    setPicked(null);
  };

  return (
    <div className="app-shell">
      <div className="mobile-frame ss-frame">
        <div className="ss-header">
          <button className="ss-back" onClick={() => navigate(`/student/safety/${dept}`)} aria-label="뒤로">←</button>
          <div className="ss-header-meta">
            <span className="ss-source-badge">
              {source === 'ai' ? '🤖 Gemini 생성' : '📦 데모 시나리오'}
            </span>
            <h1>{scenario.title}</h1>
            <small>{department.name} · 1인칭 시뮬레이션</small>
          </div>
        </div>

        {loading ? (
          <div className="ss-loading">
            <div className="ss-spinner" />
            <p>AI가 시나리오를 준비 중입니다…</p>
            <small>약관 제3조·제10조 컨텍스트 적용</small>
          </div>
        ) : !step ? (
          <div className="ss-loading">
            <p>시나리오를 불러오지 못했습니다.</p>
            <button className="t-btn t-btn-primary" onClick={() => navigate(`/student/safety/${dept}`)}>돌아가기</button>
          </div>
        ) : (
          <>
            <div className="ss-progress">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`ss-progress-dot ${i < stepIdx ? 'done' : ''} ${i === stepIdx ? 'active' : ''}`}
                />
              ))}
              <span className="ss-progress-label">
                {stepIdx + 1} / {total}
              </span>
            </div>

            <div className="ss-phase-pill">{step.phase}</div>

            <div className="ss-narration">
              <div className="ss-narration-quote">"</div>
              <p>{step.narration}</p>
            </div>

            <div className="ss-question">{step.question}</div>

            <div className="ss-choices">
              {step.choices.map((c, i) => {
                const isPicked = picked === i;
                const isCorrect = c.correct;
                let cls = 'ss-choice';
                if (picked !== null) {
                  if (isPicked && isCorrect) cls += ' correct';
                  else if (isPicked && !isCorrect) cls += ' wrong';
                  else if (!isPicked && isCorrect) cls += ' answer';
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handlePick(i)}
                    disabled={picked !== null}
                  >
                    <span className="ss-choice-letter">{String.fromCharCode(65 + i)}</span>
                    <span className="ss-choice-text">{c.text}</span>
                    {picked !== null && isCorrect && <span className="ss-choice-mark">✓</span>}
                    {picked !== null && isPicked && !isCorrect && <span className="ss-choice-mark">✗</span>}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className={`ss-feedback ${step.choices[picked].correct ? 'ok' : 'no'}`}>
                <strong>{step.choices[picked].correct ? '정답입니다' : '아쉬워요'}</strong>
                <p>{step.choices[picked].feedback}</p>
              </div>
            )}

            <div className="ss-cta">
              <button
                className="t-btn t-btn-primary t-btn-block"
                onClick={handleNext}
                disabled={picked === null}
              >
                {isLast ? `퀴즈로 이동 (시나리오 ${score}/${total} 정답) →` : '다음 단계 →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
