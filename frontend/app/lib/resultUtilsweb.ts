"use client";

export function decodeEmail(token: string | null): string {
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.email || "";
  } catch {
    return "";
  }
}

export function getScoreColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Improvement";
}