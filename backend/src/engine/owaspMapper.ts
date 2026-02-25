export type VulnerabilityInfo = {
  likelihood: number;
  impact: number;
  recommendation: string;
  nistFunction:
    | "Identify"
    | "Protect"
    | "Detect"
    | "Respond"
    | "Recover";
  controlId: string;
  businessImpact: string;
};

export const vulnerabilityMap: Record<string, VulnerabilityInfo> = {
  // ================================
  // Injection
  // ================================
  sql_injection: {
    likelihood: 4,
    impact: 5,
    nistFunction: "Protect",
    controlId: "PR.AA-01",
    businessImpact:
      "Database compromise and sensitive data exposure",
    recommendation:
      "Use parameterized queries and strict input validation",
  },

  command_injection: {
    likelihood: 4,
    impact: 5,
    nistFunction: "Protect",
    controlId: "PR.AA-02",
    businessImpact:
      "Remote command execution on the application server",
    recommendation:
      "Sanitize and validate all system command inputs",
  },

  ldap_injection: {
    likelihood: 3,
    impact: 4,
    nistFunction: "Protect",
    controlId: "PR.AA-03",
    businessImpact:
      "Unauthorized directory access and data disclosure",
    recommendation:
      "Use safe LDAP query construction and input validation",
  },

  // ================================
  // Authentication
  // ================================
  weak_password: {
    likelihood: 4,
    impact: 4,
    nistFunction: "Protect",
    controlId: "PR.AA-04",
    businessImpact:
      "Account takeover due to weak authentication controls",
    recommendation:
      "Enforce strong password complexity and minimum length",
  },

  no_account_lockout: {
    likelihood: 3,
    impact: 4,
    nistFunction: "Protect",
    controlId: "PR.AA-05",
    businessImpact:
      "Brute force attacks may compromise user accounts",
    recommendation:
      "Implement account lockout after repeated failed logins",
  },

  session_hijacking: {
    likelihood: 3,
    impact: 5,
    nistFunction: "Protect",
    controlId: "PR.AA-06",
    businessImpact:
      "User sessions may be stolen leading to unauthorized access",
    recommendation:
      "Use secure cookies and proper session management",
  },

  // ================================
  // Data Protection
  // ================================
  no_https: {
    likelihood: 3,
    impact: 5,
    nistFunction: "Protect",
    controlId: "PR.DS-01",
    businessImpact:
      "Sensitive data may be intercepted during transmission",
    recommendation:
      "Enforce HTTPS and valid TLS certificates",
  },

  weak_encryption: {
    likelihood: 3,
    impact: 4,
    nistFunction: "Protect",
    controlId: "PR.DS-02",
    businessImpact:
      "Sensitive data exposure due to weak cryptography",
    recommendation:
      "Use strong industry-approved encryption algorithms",
  },

  exposed_backup: {
    likelihood: 2,
    impact: 5,
    nistFunction: "Protect",
    controlId: "PR.DS-03",
    businessImpact:
      "Backup files may leak confidential organizational data",
    recommendation:
      "Secure backup storage and restrict public access",
  },

  // ================================
  // Access Control
  // ================================
  idor: {
    likelihood: 4,
    impact: 4,
    nistFunction: "Protect",
    controlId: "PR.AC-01",
    businessImpact:
      "Unauthorized users may access restricted data objects",
    recommendation:
      "Implement proper object-level access controls",
  },

  privilege_escalation: {
    likelihood: 3,
    impact: 5,
    nistFunction: "Protect",
    controlId: "PR.AC-02",
    businessImpact:
      "Attackers may gain administrative privileges",
    recommendation:
      "Enforce least privilege and role validation",
  },

  default_credentials: {
    likelihood: 4,
    impact: 4,
    nistFunction: "Protect",
    controlId: "PR.AC-03",
    businessImpact:
      "Systems may be accessed using publicly known credentials",
    recommendation:
      "Remove or change all default credentials",
  },

  // ================================
  // Misconfiguration
  // ================================
  directory_listing: {
    likelihood: 2,
    impact: 3,
    nistFunction: "Identify",
    controlId: "ID.RA-01",
    businessImpact:
      "Sensitive file structure information may be exposed",
    recommendation:
      "Disable directory listing on web servers",
  },

  exposed_admin: {
    likelihood: 3,
    impact: 4,
    nistFunction: "Protect",
    controlId: "PR.AC-04",
    businessImpact:
      "Administrative interfaces may be targeted by attackers",
    recommendation:
      "Restrict admin panel access and enforce MFA",
  },

  open_ports: {
    likelihood: 3,
    impact: 3,
    nistFunction: "Identify",
    controlId: "ID.AM-01",
    businessImpact:
      "Unnecessary open ports increase the attack surface",
    recommendation:
      "Close unused ports and enforce firewall rules",
  },

  // ================================
  // Cross-Site
  // ================================
  xss: {
    likelihood: 4,
    impact: 4,
    nistFunction: "Protect",
    controlId: "PR.DS-04",
    businessImpact:
      "Attackers may hijack user sessions via browser scripts",
    recommendation:
      "Apply output encoding and Content Security Policy",
  },

  csrf: {
    likelihood: 3,
    impact: 4,
    nistFunction: "Protect",
    controlId: "PR.AA-07",
    businessImpact:
      "Unauthorized transactions may be executed on behalf of users",
    recommendation:
      "Implement anti-CSRF tokens and same-site cookies",
  },

  // ================================
  // Monitoring
  // ================================
  no_audit_logs: {
    likelihood: 2,
    impact: 4,
    nistFunction: "Detect",
    controlId: "DE.CM-01",
    businessImpact:
      "Security incidents may remain undetected",
    recommendation:
      "Enable centralized security logging and monitoring",
  },

  outdated_server: {
    likelihood: 4,
    impact: 4,
    nistFunction: "Detect",
    controlId: "DE.CM-02",
    businessImpact:
      "Unpatched software may be exploited remotely",
    recommendation:
      "Apply regular patching and vulnerability management",
  },
};