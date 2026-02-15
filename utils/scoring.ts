import { CompanyData, Investor } from '../types';

// The Core ISC Formula from the Framework
export const calculateISC = (
  cf: number,
  cc: number,
  cm: number,
  cr: number,
  cp: number
): number => {
  return (
    cf * 0.30 +
    cc * 0.20 +
    cm * 0.20 +
    cr * 0.15 +
    cp * 0.15
  );
};

// IDBF: Indice de Dominance des Blocs Financiers
export const calculateIDBF = (holders: Investor[]) => {
  const familyStrengths: Record<string, number> = {};
  let totalIdentified = 0;

  holders.forEach(h => {
    if (!familyStrengths[h.family]) {
      familyStrengths[h.family] = 0;
    }
    familyStrengths[h.family] += h.percent;
    totalIdentified += h.percent;
  });

  // Find dominant
  let dominantFamily = 'Fragmented';
  let maxStrength = 0;

  Object.entries(familyStrengths).forEach(([family, strength]) => {
    if (strength > maxStrength) {
      maxStrength = strength;
      dominantFamily = family;
    }
  });

  const idbfScore = totalIdentified > 0 ? (maxStrength / totalIdentified) : 0;

  return {
    familyStrengths,
    dominantFamily,
    idbfScore,
    totalIdentified
  };
};

export const getISCInterpretation = (score: number): { label: string; color: string } => {
  if (score >= 8) return { label: 'Contrôle très concentré / verrouillé', color: 'text-purple-400' };
  if (score >= 6) return { label: 'Contrôle fort mais contraint', color: 'text-indigo-400' };
  if (score >= 4) return { label: 'Pouvoir distribué / équilibre instable', color: 'text-blue-400' };
  if (score >= 2) return { label: 'Contrôle dispersé / dépendances fortes', color: 'text-yellow-400' };
  return { label: 'Faible contrôle structurel', color: 'text-emerald-400' };
};