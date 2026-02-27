"use client";

const API_URL = "http://localhost:4000/api/assessment";

const request = async (endpoint: string, method: string = "GET", body?: any) => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error);
    }
    return data;
};

export const getITQuestions = () =>
    request(
        "/get-questions/it"
    );

export const getNonITQuestions = () =>
    request(
        "/get-questions/non-it"
    );