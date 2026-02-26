export interface ScoreBreakdownItem {
  count: number;
  weight: number;
  points: number;
}

export interface Finding {
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  function: string;
  category: string;
}

export interface AuditResult {
  url: string;
  overallScore: number;
  timestamp: string;
  scoreExplanation?: string;
  scoreBreakdown?: Record<string, ScoreBreakdownItem>;
  aiSummary?: string;
  findings?: Finding[];
  portScan?: Record<string, boolean>;
  redirect?: {
    original: string;
    final: string;
  };
}