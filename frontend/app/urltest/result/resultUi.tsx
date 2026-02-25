"use client";

import ReactMarkdown from "react-markdown";
import {
  getScoreColor,
  getScoreLabel
} from "../../lib/resultUtilsweb";

interface Props {
  data: any;
  email: string;
  onBack: () => void;
  onLogout: () => void;
}

export default function ResultUI({
  data,
  email,
  onBack,
  onLogout
}: Props) {

  const score = data.overallScore ?? 0;

  return (
    <div style={{
      padding: "60px 40px",
      maxWidth: 1100,
      margin: "0 auto",
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#111827"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40
      }}>
        <div>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 6
          }}>
            Audit Result
          </h1>
          <div style={{ color: "#6b7280" }}>{email}</div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button style={btnGray} onClick={onBack}>Back</button>
          <button style={btnRed} onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div id="audit-report">

        {/* SCORE CARD */}
        <div style={card}>
          <h2 style={sectionTitle}>Security Score</h2>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 40
          }}>
            <div style={{
              fontSize: 90,
              fontWeight: 800,
              color: getScoreColor(score)
            }}>
              {score}%
            </div>

            <div>
              <div style={{
                fontSize: 24,
                fontWeight: 600,
                color: getScoreColor(score)
              }}>
                {getScoreLabel(score)}
              </div>

              <div style={{ marginTop: 6 }}>
                URL: {data.url}
              </div>

              <div style={{ color: "#6b7280", fontSize: 14 }}>
                {new Date(data.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          {data.scoreExplanation && (
            <div style={{
              marginTop: 30,
              background: "#f3f4f6",
              padding: 20,
              borderRadius: 8
            }}>
              <strong>Score Calculation</strong>
              <pre style={{
                whiteSpace: "pre-wrap",
                marginTop: 10,
                fontSize: 14
              }}>
                {data.scoreExplanation}
              </pre>
            </div>
          )}
        </div>

        {/* SEVERITY BREAKDOWN */}
        {data.scoreBreakdown && (
          <div style={card}>
            <h2 style={sectionTitle}>
              Findings Breakdown (By Severity)
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20
            }}>
              {Object.entries(data.scoreBreakdown).map(
                ([severity, info]: any) => (
                  <div key={severity} style={severityCard}>
                    <div style={{ fontWeight: 600 }}>{severity}</div>
                    <div style={{ fontSize: 14 }}>
                      {info.count} findings × {info.weight}
                    </div>
                    <div style={{
                      fontWeight: 700,
                      color: "#ef4444",
                      marginTop: 6
                    }}>
                      -{info.points} points
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* AI SUMMARY */}
        {data.aiSummary && (
          <div style={card}>
            <h2 style={sectionTitle}>AI Summary</h2>

            <div style={{
              fontSize: 16,
              lineHeight: 1.8
            }}>
              <ReactMarkdown>
                {data.aiSummary}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* FINDINGS */}
        {data.findings?.length > 0 && (
          <div style={card}>
            <h2 style={sectionTitle}>
              Security Findings ({data.findings.length})
            </h2>

            {data.findings.map((f: any, i: number) => (
              <div key={i} style={{
                padding: 16,
                borderRadius: 8,
                background: "#f9fafb",
                marginBottom: 12
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <strong>{f.type}</strong>
                  <span style={badge(f.severity)}>
                    {f.severity}
                  </span>
                </div>

                <div style={{
                  fontSize: 14,
                  color: "#6b7280",
                  marginTop: 4
                }}>
                  {f.function} • {f.category}
                </div>

                {f.description && (
                  <div style={{ marginTop: 6 }}>
                    {f.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PORT SCAN */}
        {data.portScan && (
          <div style={card}>
            <h2 style={sectionTitle}>Port Scan</h2>

            <div style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap"
            }}>
              {Object.entries(data.portScan).map(
                ([port, open]: any) => (
                  <div key={port} style={{
                    padding: "8px 14px",
                    borderRadius: 20,
                    background: open ? "#dcfce7" : "#fee2e2",
                    color: open ? "#166534" : "#991b1b",
                    fontWeight: 600,
                    fontSize: 14
                  }}>
                    Port {port}: {open ? "Open" : "Closed"}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* REDIRECT */}
        {data.redirect && (
          <div style={card}>
            <h2 style={sectionTitle}>Redirect Chain</h2>
            <div><strong>Original:</strong> {data.redirect.original}</div>
            <div><strong>Final:</strong> {data.redirect.final}</div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const card = {
  background: "white",
  padding: 30,
  borderRadius: 14,
  marginBottom: 40,
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
};

const sectionTitle = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 20
};

const severityCard = {
  background: "#f9fafb",
  padding: 20,
  borderRadius: 10
};

const btnGray = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  background: "#e5e7eb",
  cursor: "pointer"
};

const btnRed = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer"
};

const badge = (severity: string) => ({
  padding: "4px 10px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  background:
    severity === "Critical" ? "#fee2e2" :
    severity === "High" ? "#ffedd5" :
    severity === "Medium" ? "#fef3c7" :
    "#dcfce7",
  color:
    severity === "Critical" ? "#991b1b" :
    severity === "High" ? "#9a3412" :
    severity === "Medium" ? "#854d0e" :
    "#166534"
});