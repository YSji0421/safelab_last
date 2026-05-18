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
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />
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
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />
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
            {/* 제출 전: 상태 표시 / 제출 후: 결과 카드 */}
            {!submitted ? (
              <div className="sq-status">
                답한 문항 <strong>{Object.keys(answers).length}</strong> / {questions.length}
              </div>
            ) : (
              <div className={`sq-result ${passed ? 'pass' : 'fail'}`}>
                <div className="sq-result-emoji">{passed ? '🎉' : '💪'}</div>
                <div className="sq-result-score">{score} <small>/ {questions.length}</small></div>
                <div className="sq-result-msg">
                  {passed ? '이수 조건을 충족했습니다!' : `${PASS_SCORE}개 이상 정답이 필요합니다. 다시 풀어보세요.`}
                </div>
                <div className="sq-result-bar">
                  <div
                    className={`sq-result-bar__fill ${passed ? 'pass' : 'fail'}`}
                    style={{ width: `${(score / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* 문항 리스트 — 제출 전/후 동일 구조, 색상만 변경 */}
            <div className="sq-list">
              {questions.map((q, qi) => {
                const my = answers[qi];
                const ok = my === q.answer;
                return (
                  <div key={qi} className={`sq-item ${submitted ? (ok ? 'sq-item--ok' : 'sq-item--no') : ''}`}>
                    <div className="sq-q">
                      <span className={`sq-q-num ${submitted ? (ok ? 'sq-q-num--ok' : 'sq-q-num--no') : ''}`}>
                        {submitted ? (ok ? '✓' : '✗') : qi + 1}
                      </span>
                      <p>{q.q}</p>
                    </div>
                    <div className="sq-choices">
                      {q.choices.map((c, ci) => {
                        let state = '';
                        if (submitted) {
                          if (ci === q.answer) state = ci === my ? 'choice-correct-mine' : 'choice-correct';
                          else if (ci === my) state = 'choice-wrong';
                          else state = 'choice-dim';
                        } else if (answers[qi] === ci) {
                          state = 'choice-selected';
                        }
                        return (
                          <button
                            key={ci}
                            className={`sq-choice ${state}`}
                            onClick={() => handlePick(qi, ci)}
                            disabled={submitted}
                          >
                            <span className="sq-choice-letter">{String.fromCharCode(65 + ci)}</span>
                            <span className="sq-choice-text">{c}</span>
                            {submitted && state === 'choice-correct-mine' && (
                              <span className="sq-choice-tag tag-correct">내 답 ✓ 정답</span>
                            )}
                            {submitted && state === 'choice-correct' && (
                              <span className="sq-choice-tag tag-correct">정답</span>
                            )}
                            {submitted && state === 'choice-wrong' && (
                              <span className="sq-choice-tag tag-wrong">내 답 ✗</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {submitted && (
                      <div className="sq-explain-block">
                        <strong>📖 해설</strong>
                        <p>{q.explain}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="sq-cta">
              {!submitted ? (
                <button
                  className="t-btn t-btn-primary t-btn-block"
                  disabled={!allAnswered}
                  onClick={handleSubmit}
                >
                  {allAnswered ? '제출하기' : '모든 문항에 답해주세요'}
                </button>
              ) : (
                <button className="t-btn t-btn-primary t-btn-block" onClick={handleNext}>
                  {passed ? '다음으로 →' : '다시 풀기 ↺'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
