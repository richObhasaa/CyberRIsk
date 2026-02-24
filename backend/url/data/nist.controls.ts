export const severityWeights = {
    Low: 5,
    Medium: 10,
    High: 20,
    Critical: 30
};

export const controls = {
    CSP_MISSING: { function: "Protect", category: "PR.IP-1" },
    CSP_WEAK_WILDCARD: { function: "Protect", category: "PR.IP-1" },
    CSP_UNSAFE_INLINE: { function: "Protect", category: "PR.IP-1" },
    HSTS_MISSING: { function: "Protect", category: "PR.DS-2" },
    XFRAME_MISSING: { function: "Protect", category: "PR.IP-1" },
    REFERRER_POLICY_MISSING: { function: "Protect", category: "PR.IP-1" },
    TLS_EXPIRED: { function: "Protect", category: "PR.DS-2" },
    TLS_WEAK_VERSION: { function: "Protect", category: "PR.DS-2" },
    TLS_LEGACY_VERSION: { function: "Protect", category: "PR.DS-2" },
    TLS_ERROR: { function: "Protect", category: "PR.DS-2" },
    SSH_PORT_OPEN: { function: "Identify" },
FTP_PORT_OPEN: { function: "Identify" },
NO_HTTPS_REDIRECT: { function: "Protect" },
};