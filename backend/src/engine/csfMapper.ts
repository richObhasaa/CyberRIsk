export type CsfFunctionInfo = {
  function: "Identify" | "Protect" | "Detect" | "Respond" | "Recover";
  likelihoodWeight: number;
  impactWeight: number;
};

export const csfFunctionMap: Record<
  "operational" | "financial" | "compliance" | "reputational" | "strategic",
  CsfFunctionInfo
> = {
  operational: {
    function: "Protect",
    likelihoodWeight: 1,
    impactWeight: 1,
  },
  financial: {
    function: "Identify",
    likelihoodWeight: 1,
    impactWeight: 1,
  },
  compliance: {
    function: "Detect",
    likelihoodWeight: 1,
    impactWeight: 1,
  },
  reputational: {
    function: "Respond",
    likelihoodWeight: 1,
    impactWeight: 1,
  },
  strategic: {
    function: "Recover",
    likelihoodWeight: 1,
    impactWeight: 1,
  },
};