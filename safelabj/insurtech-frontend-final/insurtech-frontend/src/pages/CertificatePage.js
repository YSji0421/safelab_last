import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDepartment } from '../data/departments';
import { loadProgress } from './SafetyMainPage';
import './CertificatePage.css';

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  } catch {
    return '';
  }
};

export default function CertificatePage() {
  const { dept } = useParams();
  const navigate = useNavigate();
  const department = getDepartment(dept);
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState({ completed: [], quizzes: {} });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('safelab.student');
      if (raw) setStudent(JSON.parse(raw));
    } catch {}
    setProgress(loadProgress(dept));
  }, [dept]);

  if (!department) return null;

  const allDone = progress.completed.length === department.scenarios.length;
  const totalScore = Object.values(progress.quizzes || {}).reduce((acc, q) => acc + (q.score || 0), 0);
  const totalMax = Object.values(progress.quizzes || {}).reduce((acc, q) => acc + (q.total || 0), 0);
  const certificateNo = `IHC-${department.id.toUpperCase()}-${student?.studentNo?.slice(-6) || '000000'}-${new Date().getFullYear()}`;
  const issuedAt = new Date().toISOString();

  if (!allDone) {
    return (
      <div className="app-shell">
        <div className="mobile-frame">
          <div className="cert-not-yet">
            <div className="cert-not-yet-icon">📋</div>
            <h2>아직 모든 시나리오를 완료하지 않았습니다</h2>
            <p>{progress.completed.length} / {department.scenarios.length} 완료</p>
            <button className="t-btn t-btn-primary" onClick={() => navigate(`/student/safety/${dept}`)}>
              시나리오로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell cert-shell">
      <div className="cert-toolbar no-print">
        <button className="t-btn t-btn-ghost" onClick={() => navigate(`/student/safety/${dept}`)}>← 돌아가기</button>
        <button className="t-btn t-btn-primary" onClick={() => window.print()}>🖨️ 인쇄/PDF 저장</button>
      </div>

      <div className="cert-paper">
        <div className="cert-watermark">SAFELAB</div>
        <div className="cert-border">
          <div className="cert-head">
            <div className="cert-school">인하공업전문대학</div>
            <div className="cert-divider" />
            <div className="cert-title">안전교육 이수증</div>
            <div className="cert-subtitle">Lab Safety Education Certificate</div>
          </div>

          <div className="cert-body">
            <div className="cert-row">
              <span>이름</span>
              <strong>{student?.name || '학생'}</strong>
            </div>
            <div className="cert-row">
              <span>학번</span>
              <strong>{student?.studentNo || '-'}</strong>
            </div>
            <div className="cert-row">
              <span>학과</span>
              <strong>{department.name}</strong>
            </div>
            <div className="cert-row">
              <span>이수 과정</span>
              <strong>{department.scenarios.length}개 시나리오 + 약관 퀴즈</strong>
            </div>
            <div className="cert-row">
              <span>최종 점수</span>
              <strong>{totalScore} / {totalMax}</strong>
            </div>
            <div className="cert-row">
              <span>발급번호</span>
              <strong>{certificateNo}</strong>
            </div>
            <div className="cert-row">
              <span>이수일</span>
              <strong>{formatDate(issuedAt)}</strong>
            </div>

            <p className="cert-stmt">
              위 학생은 「연구실 안전환경 조성에 관한 법률」 제26조에 근거한
              <strong> 「연구실안전공제」 약관 기반 안전교육 과정</strong>을 성실히 이수하였음을 증명합니다.
            </p>
          </div>

          <div className="cert-foot">
            <div className="cert-seal">
              <div className="cert-seal-circle">SafeLab</div>
              <small>인하공전 안전관리실</small>
            </div>
            <div className="cert-issuer">
              <strong>인하공업전문대학 총장</strong>
              <small>학과 단체 「연구실안전공제」 가입 학과</small>
            </div>
          </div>
        </div>
      </div>

      <div className="cert-note no-print">
        💡 본 이수증은 시연용으로 발급됩니다. 실제 「연구실안전공제」 가입은
        한국교육시설안전원을 통해 학교 연구주체의 장이 진행해야 합니다.
      </div>
    </div>
  );
}
