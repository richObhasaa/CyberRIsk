"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  useEffect(() => {
    const stored = localStorage.getItem("auditResult");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        setData(null);
      }
    }

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    getUser();
  }, []);

  const handleExportPDF = async () => {
    if (typeof window === "undefined") return;

    // Dynamic import untuk menghindari SSR issues
    const jsPDF = (await import("jspdf")).default;
    const html2canvas = (await import("html2canvas")).default;

    const element = document.getElementById("audit-report");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`audit-report-${new Date().getTime()}.pdf`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e"; // green
    if (score >= 60) return "#eab308"; // yellow
    if (score >= 40) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  if (!data) {
    return <div style={{ padding: 40 }}>No data found.</div>;
  }

  const score = data.overallScore ?? 0;

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: 5 }}>Audit Result</h1>
          <span style={{ fontSize: 14, color: "#64748b" }}>{userEmail}</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => router.push("/urltest")}
          style={{
            padding: "10px 20px",
            background: "#64748b",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          🔙 Back
        </button>
        <button
          onClick={handleExportPDF}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          📄 Export PDF
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Logout
        </button>
        </div>
      </div>

      <div id="audit-report">
        {/* Score Card */}
        <div
          style={{
            background: "white",
            padding: 30,
            borderRadius: 12,
            marginBottom: 30,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 20 }}>Security Score</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: "bold",
                color: getScoreColor(score),
              }}
            >
              {score}%
            </div>
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: getScoreColor(score),
                  marginBottom: 5,
                }}
              >
                {getScoreLabel(score)}
              </div>
              <div style={{ color: "#666", fontSize: 14 }}>
                URL: {data.url}
              </div>
              <div style={{ color: "#999", fontSize: 12, marginTop: 5 }}>
                {new Date(data.timestamp).toLocaleString("en-US")}
              </div>
            </div>
          </div>

          {/* Score Explanation */}
          {data.scoreExplanation && (
            <div
              style={{
                background: "#f8fafc",
                padding: 20,
                borderRadius: 8,
                marginTop: 20,
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 16 }}>
                Score Calculation:
              </h3>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#334155",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                {data.scoreExplanation}
              </pre>
            </div>
          )}
        </div>

        {/* Severity Breakdown */}
        {data.scoreBreakdown && (
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              marginBottom: 30,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              Findings Breakdown (By Severity)
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15 }}>
              {Object.entries(data.scoreBreakdown).map(([severity, info]: [string, any]) => (
                <div
                  key={severity}
                  style={{
                    padding: 15,
                    background: "#f8fafc",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 5, color: "#334155" }}>
                    {severity}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>
                    {info.count} findings × {info.weight} points
                  </div>
                  <div style={{ fontSize: 18, fontWeight: "bold", color: "#ef4444", marginTop: 5 }}>
                    -{info.points} points
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Summary */}
        {data.aiSummary && (
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              marginBottom: 30,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 15 }}>🤖 AI Summary</h2>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: "#334155",
                whiteSpace: "pre-wrap",
              }}
            >
              {data.aiSummary}
            </div>
          </div>
        )}

        {/* Findings */}
        {data.findings && data.findings.length > 0 && (
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              marginBottom: 30,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 15 }}>
              Security Findings ({data.findings.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.findings.map((finding: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    padding: 15,
                    background: "#f8fafc",
                    borderRadius: 8,
                    borderLeft: `4px solid ${
                      finding.severity === "Critical"
                        ? "#ef4444"
                        : finding.severity === "High"
                        ? "#f97316"
                        : finding.severity === "Medium"
                        ? "#eab308"
                        : "#22c55e"
                    }`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontWeight: 600, color: "#334155" }}>
                      {finding.type}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          finding.severity === "Critical"
                            ? "#fee2e2"
                            : finding.severity === "High"
                            ? "#ffedd5"
                            : finding.severity === "Medium"
                            ? "#fef3c7"
                            : "#dcfce7",
                        color:
                          finding.severity === "Critical"
                            ? "#991b1b"
                            : finding.severity === "High"
                            ? "#9a3412"
                            : finding.severity === "Medium"
                            ? "#854d0e"
                            : "#166534",
                      }}
                    >
                      {finding.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>
                    {finding.function} • {finding.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Port Scan */}
        {data.portScan && (
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              marginBottom: 30,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 15 }}>Port Scan</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {Object.entries(data.portScan).map(([port, isOpen]) => (
                <div
                  key={port}
                  style={{
                    padding: "8px 15px",
                    background: isOpen ? "#dcfce7" : "#f1f5f9",
                    color: isOpen ? "#166534" : "#64748b",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Port {port}: {isOpen ? "✅ Open" : "❌ Closed"}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Redirect Info */}
        {data.redirect && (
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              marginBottom: 30,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 15 }}>Redirect Chain</h2>
            <div style={{ fontSize: 14, color: "#334155" }}>
              <div style={{ marginBottom: 5 }}>
                <strong>Original:</strong> {data.redirect.original}
              </div>
              <div>
                <strong>Final:</strong> {data.redirect.final}
              </div>
            </div>
          </div>
        )}

        {/* Raw JSON - Collapsed by default */}
        <details style={{ marginTop: 30 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: 10 }}>
            📋 Raw JSON Data
          </summary>
          <pre
            style={{
              background: "#111",
              color: "#0f0",
              padding: 15,
              borderRadius: 8,
              overflow: "auto",
              fontSize: 12,
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}