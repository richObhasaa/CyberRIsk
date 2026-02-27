const BASE_URL = "http://localhost:4000/api/demo";

/* ===========================
   DASHBOARD STATS
=========================== */
export async function getDemoStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

/* ===========================
   LIST USERS
=========================== */
export async function getDemoUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

/* ===========================
   PROMOTE USER
=========================== */
export async function promoteUser(user_id: string) {
  const res = await fetch(`${BASE_URL}/promote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id }),
  });

  if (!res.ok) throw new Error("Promote failed");
  return res.json();
}

/* ===========================
   AUDIT WEBSITE
=========================== */
export async function auditWebsite(target_url: string) {
  const res = await fetch(`${BASE_URL}/audit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ target_url }),
  });

  if (!res.ok) throw new Error("Audit failed");
  return res.json();
}