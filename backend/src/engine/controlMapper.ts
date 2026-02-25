export const controlChecklistMap: Record<
  string,
  {
    controlId: string;
    controlText: string;
    csfFunction: string;
    defaultStatus?: "Not Assessed";
  }
> = {
  sql_injection: {
    controlId: "PR.AA-1",
    controlText:
      "Verify input validation and parameterized queries are implemented.",
    csfFunction: "Protect",
    defaultStatus: "Not Assessed",
  },

  xss: {
    controlId: "PR.DS-1",
    controlText:
      "Verify output encoding and content security policy are implemented.",
    csfFunction: "Protect",
    defaultStatus: "Not Assessed",
  },

  csrf: {
    controlId: "PR.AA-2",
    controlText:
      "Verify anti-CSRF tokens are implemented on sensitive transactions.",
    csfFunction: "Protect",
    defaultStatus: "Not Assessed",
  },

  weak_password: {
    controlId: "PR.AA-3",
    controlText:
      "Verify password policy enforces minimum length and complexity.",
    csfFunction: "Protect",
    defaultStatus: "Not Assessed",
  },

  outdated_server: {
    controlId: "PR.IP-1",
    controlText:
      "Verify patch management process keeps server software up to date.",
    csfFunction: "Protect",
    defaultStatus: "Not Assessed",
  },
};