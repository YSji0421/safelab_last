// ──────────────────────────────────────────────────────────────
//  TTS — 1차: Azure Speech Service (REST), 2차 폴백: 브라우저 Web Speech API
//  운영: Vercel Environment Variables 에
//    REACT_APP_AZURE_SPEECH_KEY=<key>
//    REACT_APP_AZURE_SPEECH_REGION=koreacentral
//    REACT_APP_AZURE_SPEECH_VOICE=ko-KR-SunHiNeural   (선택)
// ──────────────────────────────────────────────────────────────

const AZURE_KEY = process.env.REACT_APP_AZURE_SPEECH_KEY || '';
const AZURE_REGION = process.env.REACT_APP_AZURE_SPEECH_REGION || 'koreacentral';
const AZURE_VOICE = process.env.REACT_APP_AZURE_SPEECH_VOICE || 'ko-KR-SunHiNeural';
const AZURE_ENDPOINT = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

let currentAudio = null;
let cachedKoVoice = null;

const isAzureConfigured = () => AZURE_KEY && AZURE_KEY.length >= 20;

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

export const isSpeakingSupported = () => !!synth || isAzureConfigured();
