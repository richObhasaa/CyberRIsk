"use client";

import { getAccessToken } from "./auth";

export async function callProtectedAPI() {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("http://localhost:5000/api/protected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Backend error");
  }

  return response.json();
}