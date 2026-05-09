// 사진 → Gemini Vision 으로 사고 유형 분류
// API 키 없으면 mock fallback (랜덤 / 키워드 기반)
import { INCIDENT_TYPES, INCIDENT_TYPE_IDS, getIncidentType } from '../data/incidentTypes';

const GEMINI_API_KEY =
  process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const HAS_KEY =
  GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE';

const SYSTEM_PROMPT = `당신은 한국교육시설안전원 「연구실안전공제」 약관 기반 연구실 사고 분류 전문가입니다.
첨부된 사진을 보고 가장 가까운 사고 유형 ID 하나를 선택하여 JSON으로만 답하세요.

가능한 ID:
${INCIDENT_TYPE_IDS.map((id) => `  - ${id}: ${INCIDENT_TYPES[id].name}`).join('\n')}

응답 형식 (JSON만, 다른 텍스트 금지):
{
  "incident_type_id": "<위 ID 중 하나>",
  "confidence": 0.0~1.0,
  "observed": "사진에서 관찰된 위험요소를 1~2문장으로",
  "victim_status": "환자 상태 추정 (의식·출혈·호흡 등) 1문장",
  "additional_notes": "특이사항이 있으면 1문장, 없으면 빈 문자열"
}

원칙:
- 사진이 사고 상황이 아니거나 식별 불가하면 "unknown" 선택
- confidence 가 낮아도 가장 가까운 ID 선택
- observed 는 객관적 관찰만 (추측·의료진단 금지)`;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result; // data:image/jpeg;base64,xxxx
      const comma = result.indexOf(',');
      resolve({
        mimeType: result.slice(5, comma).split(';')[0], // image/jpeg
        data: result.slice(comma + 1),
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const safeJsonParse = (text, fallback) => {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return fallback;
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return fallback;
  }
};

// 메인 함수: File 객체를 받아 분류 결과 반환
export async function analyzeIncidentPhoto(file) {
  if (!file) throw new Error('이미지 파일이 필요합니다.');

  if (!HAS_KEY) {
    // Mock: 파일명에 키워드 있으면 매칭, 없으면 랜덤
    return mockClassify(file);
  }

  try {
    const { mimeType, data } = await fileToBase64(file);
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              { inline_data: { mime_type: mimeType, data } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = safeJsonParse(text, null);

    if (!parsed?.incident_type_id) {
      // 응답 파싱 실패 → mock 으로
      const m = await mockClassify(file);
      return { ...m, source: 'gemini-fallback', raw: text };
    }

    const id = INCIDENT_TYPE_IDS.includes(parsed.incident_type_id)
      ? parsed.incident_type_id
      : 'unknown';

    return {
      typeId: id,
      type: getIncidentType(id),
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
      observed: parsed.observed || '',
      victimStatus: parsed.victim_status || '',
      additionalNotes: parsed.additional_notes || '',
      source: 'gemini',
    };
  } catch (err) {
    // 네트워크/API 에러 → mock
    const m = await mockClassify(file);
    return { ...m, source: 'mock-fallback', error: String(err) };
  }
}

// ─────────────────────────────────────────────────────────────
// Mock fallback — 파일명에 키워드 있으면 매칭, 없으면 랜덤 균등
// ─────────────────────────────────────────────────────────────
async function mockClassify(file) {
  await new Promise((r) => setTimeout(r, 1100));
  const name = (file.name || '').toLowerCase();
  let id = null;

  // 파일명 휴리스틱
  const matchers = [
    { id: 'chemical_burn', kw: ['chem', 'acid', 'base', 'flask', '시약', '화학'] },
    { id: 'thermal_burn', kw: ['burn', 'hot', 'iron', 'plate', '인두', '납땜'] },
    { id: 'electric_shock', kw: ['electric', 'shock', 'voltage', '감전', '배전'] },
    { id: 'mechanical_injury', kw: ['cut', 'lathe', 'mill', 'grind', '절단', '기계'] },
    { id: 'fall', kw: ['fall', 'slip', 'ladder', '추락', '낙상'] },
    { id: 'fire_explosion', kw: ['fire', 'flame', 'explos', 'smoke', '화재', '폭발'] },
  ];
  for (const m of matchers) {
    if (m.kw.some((k) => name.includes(k))) {
      id = m.id;
      break;
    }
  }

  // 파일명 매칭 안 되면 균등 랜덤 (unknown 제외)
  if (!id) {
    const candidates = INCIDENT_TYPE_IDS.filter((x) => x !== 'unknown');
    id = candidates[Math.floor(Math.random() * candidates.length)];
  }

  const t = getIncidentType(id);
  return {
    typeId: id,
    type: t,
    confidence: 0.62,
    observed: `[mock] ${t.visualKeywords.slice(0, 3).join(', ')} 가 관찰됩니다.`,
    victimStatus: '[mock] 의식 있고 환부 통증 호소 추정',
    additionalNotes: 'API 키 미설정 — 시연용 mock 결과',
    source: 'mock',
  };
}
