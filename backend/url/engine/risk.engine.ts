import { Finding } from "../types";
import { severityWeights } from "../data/nist.controls";

interface ScoreBreakdown {
    overall: number;
    totalDeductions: number;
    breakdown: {
        Critical: { count: number; points: number; weight: number };
        High: { count: number; points: number; weight: number };
        Medium: { count: number; points: number; weight: number };
        Low: { count: number; points: number; weight: number };
    };
    explanation: string;
}

export const calculateScore = (findings: Finding[]): ScoreBreakdown => {
    // Hitung temuan per severity
    const breakdown = {
        Critical: { count: 0, points: 0, weight: severityWeights.Critical },
        High: { count: 0, points: 0, weight: severityWeights.High },
        Medium: { count: 0, points: 0, weight: severityWeights.Medium },
        Low: { count: 0, points: 0, weight: severityWeights.Low }
    };

    findings.forEach(f => {
        if (breakdown[f.severity]) {
            breakdown[f.severity].count++;
            breakdown[f.severity].points += severityWeights[f.severity];
        }
    });

    const totalDeductions = findings.reduce((sum, f) => {
        return sum + severityWeights[f.severity];
    }, 0);

    const overall = Math.max(0, 100 - Math.min(totalDeductions, 100));

    const explanation = `Score calculated from 100 points maximum with deductions based on severity:
- Critical: ${breakdown.Critical.count}x findings × ${breakdown.Critical.weight} points = -${breakdown.Critical.points} points
- High: ${breakdown.High.count}x findings × ${breakdown.High.weight} points = -${breakdown.High.points} points
- Medium: ${breakdown.Medium.count}x findings × ${breakdown.Medium.weight} points = -${breakdown.Medium.points} points
- Low: ${breakdown.Low.count}x findings × ${breakdown.Low.weight} points = -${breakdown.Low.points} points

Total deductions: -${totalDeductions} points
Final score: ${overall}/100 (${overall}%)`;

    return {
        overall,
        totalDeductions,
        breakdown,
        explanation
    };
};