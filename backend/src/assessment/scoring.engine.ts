export interface AnswerInput {
  question_id: string;
  score: number;
  weight: number;
}

export function calculateMaturity(
  answers: AnswerInput[]
) {
  if (!answers.length) return 0;

  const totalWeight = answers.reduce(
    (s, a) => s + a.weight,
    0
  );

  const weighted = answers.reduce(
    (s, a) => s + a.score * a.weight,
    0
  );

  return Number((weighted / totalWeight).toFixed(2));
}

export function calculateInherent(
  likelihood: number,
  impact: number
) {
  return likelihood * impact;
}

export function calculateResidual(
  inherent: number,
  maturity: number
) {
  const controlFactor = maturity / 5;
  return Number(
    (inherent * (1 - controlFactor)).toFixed(2)
  );
}

export function classifyRiskTier(score: number) {
  if (score <= 5) return "LOW";
  if (score <= 10) return "MEDIUM";
  if (score <= 15) return "HIGH";
  return "CRITICAL";
}