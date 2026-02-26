export type Severity = "Low" | "Medium" | "High" | "Critical";

export interface Finding {
    type: string;
    severity: Severity;
    function?: string;
    category?: string;
    description?: string;
}

export interface NistBreakdown {
    Identify: number;
    Protect: number;
    Detect: number;
}