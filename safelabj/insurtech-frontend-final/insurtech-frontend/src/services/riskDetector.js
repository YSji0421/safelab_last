import { riskKeywords } from '../data/riskKeywords';

export const detectRisks = (text) => {
  const lower = (text || '').toLowerCase();
  if (!lower.trim()) return [];
  return riskKeywords.filter(r => lower.includes(r.keyword.toLowerCase()));
};
