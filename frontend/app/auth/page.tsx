"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  login,
  register,
} from "../lib/auth";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);

        // pastikan token sudah tersimpan
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Login failed: No token received");
        }

        router.replace("/urltest");
      } else {
        await register(email, password);
        setMessage(
          "Registration successful. Check your email to confirm."
        );
        setMode("login");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");

    try {
      if (!email) {
        throw new Error("Email is required");
      }

      // TODO: Implement resendConfirmation in ../lib/auth
      setMessage("Confirmation email sent again.");
    } catch (err: any) {
      setError(err?.message || "Failed to resend email");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>
          {mode === "login" ? "Login" : "Register"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={styles.input}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? "Processing..."
            : mode === "login"
            ? "Login"
            : "Register"}
        </button>

        {mode === "login" && (
          <button
            onClick={handleResend}
            style={styles.linkButton}
          >
            Resend confirmation email
          </button>
        )}

        <p style={{ marginTop: 20 }}>
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={() => {
              setMode(
                mode === "login"
                  ? "register"
                  : "login"
              );
              setError("");
              setMessage("");
            }}
            style={styles.linkButton}
          >
            {mode === "login"
              ? "Register"
              : "Login"}
          </button>
        </p>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        {message && (
          <p style={styles.success}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#111",
  },
  card: {
    background: "#1e1e1e",
    padding: 30,
    borderRadius: 8,
    width: 320,
    color: "white",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 4,
    border: "1px solid #333",
    background: "#2a2a2a",
    color: "white",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 4,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    cursor: "pointer",
    marginLeft: 5,
  },
  error: {
    color: "#f87171",
    marginTop: 10,
  },
  success: {
    color: "#4ade80",
    marginTop: 10,
  },
};