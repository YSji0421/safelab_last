import { scenarios } from '../data/scenarios';

export const matchScenario = (transcript) => {
  const text = (transcript || '').toLowerCase();
  if (!text.trim()) return null;

  let best = null;
  for (const s of scenarios) {
    if (s.requiredKeywords?.length) {
      const allGroupsSatisfied = s.requiredKeywords.every(group => {
        const alternatives = Array.isArray(group) ? group : [group];
        return alternatives.some(k => text.includes(k.toLowerCase()));
      });
      if (!allGroupsSatisfied) continue;
    }
    const hits = s.keywords.filter(k => text.includes(k.toLowerCase())).length;
    const score = s.keywords.length ? hits / s.keywords.length : 0;
    if (score >= (s.threshold ?? 0.4) && (!best || score > best.score)) {
      best = { scenario: s, score, hits };
    }
  }
  return best;
};
