import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import './DeviceCheckPage.css';

export default function DeviceCheckPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [cameraOk, setCameraOk] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraOk(true);
        setMicOk(true);
      } catch (err) {
        if (!mounted) return;
        setError('카메라 및 마이크 접근 권한을 허용해주세요.');
        setCameraOk(false);
        setMicOk(false);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const enterRoom = () => {
    const roomId = localStorage.getItem('currentRoom') || 'room-' + Date.now();
    localStorage.setItem('currentRoom', roomId);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    navigate(`/insurance/room/${roomId}`);
  };

  return (
    <AppShell variant="device-check-shell">
      <PageHeader
        title="AI 상담 장치 체크"
        subtitle="카메라·마이크 권한을 허용해주세요"
        backTo="/"
      />
      <div className="page-body">
        <div className="media-block">
          {loading ? (
            <div className="preview-loading">장치 확인 중...</div>
          ) : error ? (
            <div className="preview-error">
              <span>🚫</span>
              <p>{error}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="preview-video"
            />
          )}
        </div>

        <section className="glass-card">
          <h3 className="card-title">상태 체크</h3>
          <div className="status-list">
            <div className="status-row">
              <span className="status-row__label">📷 카메라</span>
              <span className={`pill ${cameraOk ? 'pill-green' : 'pill-rose'}`}>
                {cameraOk ? '정상 작동 중' : '권한 필요'}
              </span>
            </div>
            <div className="status-row">
              <span className="status-row__label">🎤 마이크</span>
              <span className={`pill ${micOk ? 'pill-green' : 'pill-rose'}`}>
                {micOk ? '정상 작동 중' : '권한 필요'}
              </span>
            </div>
          </div>
        </section>

        {error && (
          <div className="banner banner-warn">⚠️ {error}</div>
        )}

        <p className="hint-text">
          카메라와 마이크가 정상적으로 작동하는지 확인 후 '입장하기' 버튼을 눌러주세요.
        </p>

        <div className="action-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="t-btn t-btn-ghost"
          >
            취소
          </button>
          <button
            type="button"
            onClick={enterRoom}
            className="t-btn t-btn-primary"
            disabled={!cameraOk || !micOk}
          >
            상담방 입장하기
          </button>
        </div>
      </div>
    </AppShell>
  );
}
