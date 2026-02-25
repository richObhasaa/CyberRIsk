import { Finding } from "../types";
import { controls } from "../data/nist.controls";

export const mapFindings = (findings: Finding[]): Finding[] => {
    return findings.map((f) => ({
        ...f,
        ...controls[f.type as keyof typeof controls]
    }));
};