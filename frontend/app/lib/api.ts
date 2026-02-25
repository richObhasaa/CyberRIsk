"use client";

import { supabase } from "./supabaseClient";

const BASE_URL = "http://localhost:5000/api";

async function getTokenSafe() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("No active session");
  }

  return session.access_token;
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
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body
        ? JSON.stringify(body)
        : undefined,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error(
      "Backend error:",
      data
    );
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
   NEW FUNCTIONS (DITAMBAHKAN)
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