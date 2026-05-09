// ──────────────────────────────────────────────────────────────
//  TTS 우선순위
//   1차: Naver CLOVA Voice (백엔드 프록시 /api/tts/clova)
//   2차: Azure Speech Service (브라우저 직접 호출)
//   3차: 브라우저 Web Speech API (폴백)
//
//  Vercel Env (프론트):
//    REACT_APP_TTS_PROVIDER=clova   (clova | azure | auto)  (기본 auto: clova→azure→web)
//    REACT_APP_CLOVA_SPEAKER=nara   (선택)
//    REACT_APP_AZURE_SPEECH_KEY=...
//    REACT_APP_AZURE_SPEECH_REGION=koreacentral
//    REACT_APP_AZURE_SPEECH_VOICE=ko-KR-SunHiNeural
//
//  Cloudtype Env (백엔드, CLOVA 프록시용):
//    NAVER_CLOVA_CLIENT_ID=<NCP Application Client ID>
//    NAVER_CLOVA_CLIENT_SECRET=<NCP Application Client Secret>
// ──────────────────────────────────────────────────────────────

const TTS_PROVIDER = (process.env.REACT_APP_TTS_PROVIDER || 'auto').toLowerCase();
const CLOVA_SPEAKER = process.env.REACT_APP_CLOVA_SPEAKER || 'nara';
const CLOVA_ENDPOINT = '/api/tts/clova';

const AZURE_KEY = process.env.REACT_APP_AZURE_SPEECH_KEY || '';
const AZURE_REGION = process.env.REACT_APP_AZURE_SPEECH_REGION || 'koreacentral';
const AZURE_VOICE = process.env.REACT_APP_AZURE_SPEECH_VOICE || 'ko-KR-SunHiNeural';
const AZURE_ENDPOINT = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

let currentAudio = null;
let cachedKoVoice = null;

const isAzureConfigured = () => AZURE_KEY && AZURE_KEY.length >= 20;

// CLOVA는 백엔드 프록시 호출이라 프론트엔드 키가 없어도 동작 (백엔드 미구성 시 503/500 응답).
// REACT_APP_TTS_PROVIDER 가 'azure' 면 강제 비활성, 'clova' 또는 'auto' 면 활성.
const isClovaEnabled = () => TTS_PROVIDER === 'clova' || TTS_PROVIDER === 'auto';

const speakClova = async (text, { onStart, onEnd, rate = 1.0, pitch = 1.0 }) => {
  // CLOVA speed 매핑: -5(느림) ~ +5(빠름). rate 1.0 → 0
  const clovaSpeed = Math.max(-5, Math.min(5, Math.round((rate - 1) * 5)));
  const clovaPitch = Math.max(-5, Math.min(5, Math.round((pitch - 1) * 5)));
  const res = await fetch(CLOVA_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      speaker: CLOVA_SPEAKER,
      speed: clovaSpeed,
      pitch: clovaPitch,
      format: 'mp3',
    }),
  });
  if (!res.ok) {
    throw new Error(`CLOVA TTS ${res.status} ${res.statusText}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;
  audio.onplay = () => onStart?.();
  audio.onended = () => {
    onEnd?.();
    URL.revokeObjectURL(url);
    if (currentAudio === audio) currentAudio = null;
  };
  audio.onerror = () => {
    onEnd?.();
    URL.revokeObjectURL(url);
    if (currentAudio === audio) currentAudio = null;
  };
  await audio.play();
};

const escapeXml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const buildSsml = (text, { rate = 1.0, pitch = 1.0 } = {}) => {
  const pitchPercent = Math.round((pitch - 1) * 100);
  const pitchStr = pitchPercent === 0 ? '+0%' : (pitchPercent > 0 ? `+${pitchPercent}%` : `${pitchPercent}%`);
  return `<speak version='1.0' xml:lang='ko-KR'>
  <voice xml:lang='ko-KR' name='${AZURE_VOICE}'>
    <prosody rate='${rate}' pitch='${pitchStr}'>${escapeXml(text)}</prosody>
  </voice>
</speak>`;
};

const speakAzure = async (text, { onStart, onEnd, rate = 1.0, pitch = 1.0 }) => {
  const res = await fetch(AZURE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': AZURE_KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'safelab-tts',
    },
    body: buildSsml(text, { rate, pitch }),
  });
  if (!res.ok) {
    throw new Error(`Azure TTS ${res.status} ${res.statusText}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;
  audio.onplay = () => onStart?.();
  audio.onended = () => {
    onEnd?.();
    URL.revokeObjectURL(url);
    if (currentAudio === audio) currentAudio = null;
  };
  audio.onerror = () => {
    onEnd?.();
    URL.revokeObjectURL(url);
    if (currentAudio === audio) currentAudio = null;
  };
  await audio.play();
};

const pickKoreanVoice = () => {
  if (!synth) return null;
  if (cachedKoVoice) return cachedKoVoice;
  const voices = synth.getVoices();
  cachedKoVoice =
    voices.find(v => v.lang === 'ko-KR' && /female|여|yuna|heami/i.test(v.name)) ||
    voices.find(v => v.lang === 'ko-KR') ||
    voices.find(v => v.lang?.startsWith('ko')) ||
    null;
  return cachedKoVoice;
};

if (synth && typeof synth.addEventListener === 'function') {
  synth.addEventListener('voiceschanged', () => { cachedKoVoice = null; pickKoreanVoice(); });
}

const speakWebApi = (text, { onStart, onEnd, rate = 1.0, pitch = 1.0 } = {}) => {
  if (!synth) { onEnd?.(); return null; }
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = rate;
  utter.pitch = pitch;
  const voice = pickKoreanVoice();
  if (voice) utter.voice = voice;
  utter.onstart = () => onStart?.();
  utter.onend = () => onEnd?.();
  utter.onerror = () => onEnd?.();
  synth.speak(utter);
  return utter;
};

export const speak = (text, opts = {}) => {
  if (!text) { opts.onEnd?.(); return null; }
  cancelSpeak();

  // 1차: CLOVA (provider=clova 또는 auto). 실패 시 Azure → Web 순차 폴백
  if (isClovaEnabled()) {
    speakClova(text, opts).catch((err) => {
      console.warn('[TTS] CLOVA 실패 — Azure 폴백 시도:', err?.message || err);
      if (isAzureConfigured()) {
        speakAzure(text, opts).catch((err2) => {
          console.warn('[TTS] Azure 폴백도 실패 — Web Speech API:', err2?.message || err2);
          speakWebApi(text, opts);
        });
      } else {
        console.warn('[TTS] Azure 키 미설정 — Web Speech API 로 폴백');
        speakWebApi(text, opts);
      }
    });
    return null;
  }

  if (isAzureConfigured()) {
    speakAzure(text, opts).catch((err) => {
      console.warn('[TTS] Azure Speech 실패 — Web Speech API 로 폴백:', err?.message || err);
      speakWebApi(text, opts);
    });
    return null;
  }
  return speakWebApi(text, opts);
};

export const cancelSpeak = () => {
  if (currentAudio) {
    try { currentAudio.pause(); } catch {}
    currentAudio.src = '';
    currentAudio = null;
  }
  synth?.cancel();
};

export const isSpeakingSupported = () => !!synth || isAzureConfigured() || isClovaEnabled();
