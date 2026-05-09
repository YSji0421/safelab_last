const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

let cachedKoVoice = null;

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

// voices는 비동기로 로드되기도 하므로 voiceschanged 이벤트로 갱신
if (synth && typeof synth.addEventListener === 'function') {
  synth.addEventListener('voiceschanged', () => { cachedKoVoice = null; pickKoreanVoice(); });
}

export const speak = (text, { onStart, onEnd, rate = 1.0, pitch = 1.0 } = {}) => {
  if (!synth || !text) { onEnd?.(); return null; }
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

export const cancelSpeak = () => { synth?.cancel(); };

export const isSpeakingSupported = () => !!synth;
