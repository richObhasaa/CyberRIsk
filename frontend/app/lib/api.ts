"use client";

import { getAccessToken, refreshAccessToken } from "./auth";

const BASE_URL = "http://localhost:4000/api";

export const addAsset = (payload: any) =>
  request("/assessment/add-asset", "POST", payload);

async function getTokenSafe() {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No active session");
  }

  return token;
}

async function request(
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  const token = await getTokenSafe();

  const res = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body
        ? JSON.stringify(body)
        : undefined,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    // If 401, try refreshing the token once
    if (res.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry with new token
        const retryRes = await fetch(
          `${BASE_URL}${endpoint}`,
          {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
            body: body ? JSON.stringify(body) : undefined,
          }
        );
        const retryData = await retryRes.json();
        if (retryRes.ok) return retryData;
      }

      // Refresh failed — redirect to login
      console.error("Session expired. Redirecting to login.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/auth";
      throw new Error("Session expired");
    }

    console.error("Backend error:", data);
    throw new Error(
      data.error || "Backend error"
    );
  }

  return data;
}

/* ===========================
   ORIGINAL FUNCTIONS
=========================== */

export const listAssessments = () =>
  request("/assessment/list");

export const submitSubcategory = (
  payload: any
) =>
  request(
    "/assessment/submit-subcategory",
    "POST",
    payload
  );

export const approveFinalize = (
  payload: any
) =>
  request(
    "/assessment/approve-finalize",
    "POST",
    payload
  );

export const getReport = (
  id: string
) =>
  request(
    `/assessment/${id}/report`
  );

export const getDrafts = () =>
  request(
    "/assessment/review/drafts"
  );

/* ===========================
   NEW FUNCTIONS
=========================== */

export const createAssessment = (
  payload: any
) =>
  request(
    "/assessment/create",
    "POST",
    payload
  );

export const getQuestions = (
  role: string
) =>
  request(
    `/assessment/questions/${role}`
  );

export const submitAll = (
  payload: any
) =>
  request(
    "/assessment/submit-all",
    "POST",
    payload
  );

export const auditorReview = (
  payload: any
) =>
  request(
    "/assessment/auditor-review",
    "POST",
    payload
  );

export const getMyOrganizations =
  () =>
    request(
      "/assessment/my-organizations"
    );

export const createOrganization =
  (payload: any) =>
    request(
      "/assessment/create-organization",
      "POST",
      payload
    );

export const listByOrganization =
  (organizationId: string) =>
    request(
      `/assessment/${organizationId}/list`
    );

export const generateSummary = (
  payload: {
    assessment_id: string;
  }
) =>
  request(
    "/assessment/generate-summary",
    "POST",
    payload
  );

  /* ===========================
   CHATBOT FUNCTIONS
=========================== */

export const sendChatMessage = (
  payload: { message: string }
) =>
  request(
    "/chatbot/chat",
    "POST",
    payload
  )

export const uploadChatFile = async (
  file: File
) => {
  const token = await getTokenSafe()

  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(
    `${BASE_URL}/chatbot/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "Upload failed")
  }

  return data
}