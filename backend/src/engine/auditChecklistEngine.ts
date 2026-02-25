export type AuditItem = {
  controlId: string;
  title: string;
  csfFunction:
    | "Identify"
    | "Protect"
    | "Detect"
    | "Respond"
    | "Recover";
  status: "Compliant" | "Partial" | "Non-Compliant" | "Not Applicable";
  evidence?: string;
};

const controlLibrary: Record<
  string,
  Omit<AuditItem, "status">
> = {
  sql_injection: {
    controlId: "PR.AA-01",
    title:
      "Verify input validation and parameterized queries are implemented",
    csfFunction: "Protect",
  },

  xss: {
    controlId: "PR.DS-02",
    title:
      "Verify output encoding and Content Security Policy (CSP) implemented",
    csfFunction: "Protect",
  },

  csrf: {
    controlId: "PR.AA-03",
    title: "Verify anti-CSRF protection is enforced",
    csfFunction: "Protect",
  },

  weak_password: {
    controlId: "PR.AA-04",
    title:
      "Verify password policy enforces minimum length and complexity",
    csfFunction: "Protect",
  },

  outdated_server: {
    controlId: "DE.CM-01",
    title:
      "Verify patch management and vulnerability monitoring process",
    csfFunction: "Detect",
  },
};

export function generateAuditChecklist(
  vulnerabilities: string[] = []
): AuditItem[] {
  const seen = new Set<string>();

  return vulnerabilities
    .map((v) => {
      const control = controlLibrary[v];
      if (!control) return null;

      if (seen.has(control.controlId)) return null;
      seen.add(control.controlId);

      return {
        ...control,
        status: "Non-Compliant" as const,
        evidence: "",
      };
    })
    .filter(Boolean) as AuditItem[];
}