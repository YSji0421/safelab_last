import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDepartment } from '../data/departments';
import './SafetyMainPage.css';

const PROGRESS_KEY = (deptId) => `safelab.progress.${deptId}`;

export const loadProgress = (deptId) => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY(deptId));
    return raw ? JSON.parse(raw) : { completed: [], quizzes: {} };
  } catch {
    return { completed: [], quizzes: {} };
  }
};

export const saveProgress = (deptId, progress) => {
  localStorage.setItem(PROGRESS_KEY(deptId), JSON.stringify(progress));
};

export default function SafetyMainPage() {
  const { dept } = useParams();
  const navigate = useNavigate();
  const department = getDepartment(dept);
  const [progress, setProgress] = useState({ completed: [], quizzes: {} });
  const [student, setStudent] = useState(null);

  useEffect(() => {
    setProgress(loadProgress(dept));
    try {
      const raw = localStorage.getItem('safelab.student');
      if (raw) setStudent(JSON.parse(raw));
    } catch {}
  }, [dept]);

  if (!department) {
    return (
      <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />
        <div className="mobile-frame">
          <div style={{ padding: 40, textAlign: 'center' }}>
            <p>학과를 찾을 수 없습니다.</p>
            <button className="t-btn t-btn-primary" onClick={() => navigate('/student/department')}>
              학과 다시 선택
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalScenarios = department.scenarios.length;
  const completedCount = progress.completed.length;
  const allDone = completedCount === totalScenarios && totalScenarios > 0;
  const percentage = totalScenarios === 0 ? 0 : Math.round((completedCount / totalScenarios) * 100);

  return (
    <div className="app-shell">
      <div className="aurora-orb o1" />
      <div className="aurora-orb o2" />
      <div className="aurora-orb o3" />
      <div className="aurora-orb o4" />
      <div className="mobile-frame sm-frame">
        <div className="sm-header">
          <button className="sm-back" onClick={() => navigate('/')} aria-label="처음으로">←</button>
          <button
            className="sm-switch"
            onClick={() => navigate('/student/department')}
            title="학과 변경"
          >
            학과 변경
          </button>
          <div className="sm-greet">
            <span className="sm-greet-icon">{department.icon}</span>
            <div>
              <small>안녕하세요, {student?.name || '학생'}님</small>
              <h1>{department.name} 안전교육</h1>
            </div>
          </div>
          <div className="sm-progress">
            <div className="sm-progress-row">
              <span>이번 학기 진척도</span>
              <strong>{completedCount}/{totalScenarios} 완료</strong>
            </div>
            <div className="sm-progress-bar">
              <div className="sm-progress-fill" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        </div>

        {allDone && (
          <div className="sm-done-banner">
            <span>🎉</span>
            <div>
              <strong>모든 시나리오 완료!</strong>
              <small>이수증을 발급받을 수 있습니다.</small>
            </div>
            <button
              className="t-btn t-btn-primary"
              onClick={() => navigate(`/student/safety/${dept}/certificate`)}
            >
              이수증 →
            </button>
          </div>
        )}

        <div className="section-title">학과 위험요소</div>
        <div className="sm-tags">
          {department.riskTags.map((t) => (
            <span key={t} className="pill pill-red">{t}</span>
          ))}
        </div>

        <div className="section-title">시나리오 학습</div>
        <div className="sm-scenarios">
          {department.scenarios.map((s) => {
            const isDone = progress.completed.includes(s.id);
            const quizScore = progress.quizzes?.[s.id]?.score;
            return (
              <button
                key={s.id}
                className={`sm-scenario ${isDone ? 'done' : ''}`}
                onClick={() => navigate(`/student/safety/${dept}/scenario/${s.id}`)}
              >
                <div className="sm-scenario-head">
                  <span className={`sm-diff diff-${s.difficulty}`}>난이도 {s.difficulty}</span>
                  {isDone ? (
                    <span className="pill pill-green">✓ 완료 ({quizScore}/5)</span>
                  ) : (
                    <span className="pill pill-gray">미진행</span>
                  )}
                </div>
                <div className="sm-scenario-title">{s.title}</div>
                <div className="sm-scenario-summary">{s.summary}</div>
                <div className="sm-scenario-tags">
                  {s.tags.map((t) => (
                    <span key={t} className="pill pill-red">#{t}</span>
                  ))}
                </div>
                <div className="sm-scenario-clause">📖 {s.relatedClause}</div>
              </button>
            );
          })}
        </div>

        <div className="section-title">부가 메뉴</div>
        <div className="sm-extra">
          <button
            className="sm-extra-item"
            onClick={() => navigate('/emergency')}
          >
            <span>🚨</span>
            <div>
              <strong>긴급 연락처</strong>
              <small>학과 안전관리자 + 119/안전원</small>
            </div>
            <span className="sm-extra-arrow">→</span>
          </button>
          <button
            className="sm-extra-item"
            onClick={() => navigate('/insurance/consult')}
          >
            <span>📄</span>
            <div>
              <strong>보험 약관 상담 (Gemini)</strong>
              <small>사고 후 공제 청구 도우미 — 별도 모듈</small>
            </div>
            <span className="sm-extra-arrow">→</span>
          </button>
          <button
            className="sm-extra-item"
            onClick={() => navigate('/buildings')}
          >
            <span>🏛️</span>
            <div>
              <strong>내 강의실 안전등급</strong>
              <small>캠퍼스 25개 동 인증 / 내진 평가 검색</small>
            </div>
            <span className="sm-extra-arrow">→</span>
          </button>
          <button
            className="sm-extra-item"
            onClick={() => navigate('/incident/photo')}
          >
            <span>📷</span>
            <div>
              <strong>사진으로 사고 신고</strong>
              <small>AI가 사고 등급 자동 분류 + 신고처 안내</small>
            </div>
            <span className="sm-extra-arrow">→</span>
          </button>
          <button
            className="sm-extra-item"
            onClick={() => navigate('/insurance/simulator')}
          >
            <span>💰</span>
            <div>
              <strong>내가 받을 수 있는 보상은?</strong>
              <small>4종 보험 + 부상 정도 입력 → 보상액 시뮬레이션</small>
            </div>
            <span className="sm-extra-arrow">→</span>
          </button>
          <button
            className="sm-extra-item"
            onClick={() => navigate('/safety/cases')}
          >
            <span>📚</span>
            <div>
              <strong>실습실 사고사례 10건 학습</strong>
              <small>「2026 안전교육자료」 PDF 실제 사례 — 면장갑·MSDS·밸브 잠금</small>
            </div>
            <span className="sm-extra-arrow">→</span>
          </button>
          <button
            className="sm-extra-item"
            onClick={() => navigate('/safety/msds')}
          >
            <span>🧪</span>
            <div>
              <strong>MSDS 학습 — 화학물질 안전 표준</strong>
              <small>16개 항목 + GHS 그림문자 9종 + 실제 시약 5종 (Sodium azide 등)</small>
            </div>
            <span className="sm-extra-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
