import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDepartment } from '../data/departments';
import { generateSafetyQuiz } from '../services/gemini';
import { safetyApi } from '../services/api';
import { loadProgress, saveProgress } from './SafetyMainPage';
import './SafetyQuizPage.css';

const PASS_SCORE = 4; // 5문항 중 4 이상이면 이수

export default function SafetyQuizPage() {
  const { dept, sid } = useParams();
  const navigate = useNavigate();
  const department = getDepartment(dept);
  const scenario = department?.scenarios.find((s) => s.id === sid);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('fallback');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    generateSafetyQuiz(dept, sid).then((res) => {
      if (!alive) return;
      setQuestions(res.questions || []);
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
            <p>퀴즈를 찾을 수 없습니다.</p>
            <button className="t-btn t-btn-primary" onClick={() => navigate(`/student/safety/${dept}`)}>돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  const handlePick = (qi, ci) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qi]: ci }));
  };

  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i] !== undefined);

  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
  const passed = score >= PASS_SCORE;

  const handleSubmit = () => {
    setSubmitted(true);
    if (score >= PASS_SCORE) {
      const progress = loadProgress(dept);
      const completedSet = new Set([...progress.completed, sid]);
      const next = {
        completed: Array.from(completedSet),
        quizzes: { ...progress.quizzes, [sid]: { score, total: questions.length, completedAt: new Date().toISOString() } },
      };
      saveProgress(dept, next);

      // 백엔드 동기화 (실패해도 학생 흐름은 영향 없음)
      try {
        const studentRaw = localStorage.getItem('safelab.student');
        const student = studentRaw ? JSON.parse(studentRaw) : {};
        safetyApi
          .recordAttempt({
            studentNo: student.studentNo || `temp-${Date.now()}`,
            studentName: student.name || '학생',
            deptId: dept,
            scenarioId: sid,
            score,
            total: questions.length,
          })
          .catch(() => {});
      } catch {}
    }
  };

  const handleNext = () => {
    if (passed) {
      const progress = loadProgress(dept);
      if (progress.completed.length === department.scenarios.length) {
        navigate(`/student/safety/${dept}/certificate`);
      } else {
        navigate(`/student/safety/${dept}`);
      }
    } else {
      // 재시도
      setAnswers({});
      setSubmitted(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="mobile-frame sq-frame">
        <div className="sq-header">
          <button className="sq-back" onClick={() => navigate(`/student/safety/${dept}`)} aria-label="뒤로">←</button>
          <div className="sq-header-meta">
            <span className="sq-source-badge">
              {source === 'ai' ? '🤖 Gemini 생성' : '📦 약관 기반 퀴즈'}
            </span>
            <h1>{scenario.title}</h1>
            <small>약관 기반 5문항 — {PASS_SCORE}개 이상 정답이면 이수</small>
          </div>
        </div>

        {loading ? (
          <div className="sq-loading">
            <div className="sq-spinner" />
            <p>퀴즈를 생성 중입니다…</p>
          </div>
        ) : (
          <>
            {!submitted ? (
              <>
                <div className="sq-status">
                  답한 문항 <strong>{Object.keys(answers).length}</strong> / {questions.length}
                </div>
                <div className="sq-list">
                  {questions.map((q, qi) => (
                    <div key={qi} className="sq-item">
                      <div className="sq-q">
                        <span className="sq-q-num">{qi + 1}</span>
                        <p>{q.q}</p>
                      </div>
                      <div className="sq-choices">
                        {q.choices.map((c, ci) => (
                          <button
                            key={ci}
                            className={`sq-choice ${answers[qi] === ci ? 'on' : ''}`}
                            onClick={() => handlePick(qi, ci)}
                          >
                            <span className="sq-choice-letter">{String.fromCharCode(65 + ci)}</span>
                            <span>{c}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="sq-cta">
                  <button
                    className="t-btn t-btn-primary t-btn-block"
                    disabled={!allAnswered}
                    onClick={handleSubmit}
                  >
                    {allAnswered ? '제출하기' : '모든 문항에 답해주세요'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={`sq-result ${passed ? 'pass' : 'fail'}`}>
                  <div className="sq-result-emoji">{passed ? '🎉' : '💪'}</div>
                  <div className="sq-result-score">{score} / {questions.length}</div>
                  <div className="sq-result-msg">
                    {passed ? '이수 조건을 충족했습니다!' : `${PASS_SCORE}개 이상 정답이 필요합니다. 다시 풀어보세요.`}
                  </div>
                </div>
                <div className="sq-review">
                  {questions.map((q, qi) => {
                    const my = answers[qi];
                    const ok = my === q.answer;
                    return (
                      <div key={qi} className={`sq-review-item ${ok ? 'ok' : 'no'}`}>
                        <div className="sq-review-q">
                          <span className={`sq-review-mark ${ok ? 'ok' : 'no'}`}>{ok ? '✓' : '✗'}</span>
                          <p>{qi + 1}. {q.q}</p>
                        </div>
                        <div className="sq-review-ans">
                          <small>내 답: <strong>{q.choices[my]}</strong></small>
                          {!ok && <small>정답: <strong>{q.choices[q.answer]}</strong></small>}
                        </div>
                        <div className="sq-review-explain">📖 {q.explain}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="sq-cta">
                  <button className="t-btn t-btn-primary t-btn-block" onClick={handleNext}>
                    {passed ? '다음으로 →' : '다시 풀기 ↺'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
