"use client";

const API_URL = "http://localhost:4000/api/auth";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  // Simpan token di client (dev mode)
  localStorage.setItem("access_token", data.access_token);

  return data;
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
}

export function getAccessToken() {
  return localStorage.getItem("access_token");
}