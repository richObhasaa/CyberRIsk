"use client";

import { supabase } from "./supabaseClient";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function register(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function resendConfirmation(email: string) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) throw error;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;
  return session.access_token;
}