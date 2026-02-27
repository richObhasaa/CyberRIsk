"use client";

import { useState } from "react";
import { Container, Button } from "./UI";
import { generateSummary } from "../../lib/api";
import { exportAssessmentPDF } from "../../lib/pdf";

export default function QuestionsStep({
  questions,
  loading,
  riskProfile,
  submitSubcategory,
  assessmentId,
  prevStep,
  role,
  categories,
}: any) {
  const [answers, setAnswers] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  function groupByCategory(data: any[]) {
    const map: Record<string, any[]> = {};
    for (const q of data) {
      const key = q.subcategory_id;
      if (!map[key]) map[key] = [];
      map[key].push(q);
    }
    return map;
  }

  async function handleSubmit() {
    if (!assessmentId) {
      alert("Assessment not found.");
      return;
    }

    const grouped = groupByCategory(questions);

    if (role === "IT") {
      // For IT, one score per subcategory
      for (const cat of Object.keys(grouped)) {
        if (answers[cat] === undefined || answers[cat] === null) {
          alert("Please answer all subcategories before submitting.");
          return;
        }
      }
    } else {
      for (const q of questions) {
        if (answers[q.id] === undefined || answers[q.id] === null) {
          alert("Please answer all questions before submitting.");
          return;
        }
      }
    }

    try {
      setSubmitting(true);

      for (const cat in grouped) {
        const subQuestions = grouped[cat];

        let formattedAnswers;
        if (role === "IT") {
          // Apply same subcategory score to all questions in this group
          const score = Number(answers[cat]);
          formattedAnswers = subQuestions.map((q) => ({
            question_id: q.id,
            score,
          }));
        } else {
          formattedAnswers = subQuestions.map((q) => ({
            question_id: q.id,
            score: Number(answers[q.id]),
          }));
        }

        await submitSubcategory({
          assessment_id: assessmentId,
          subcategory_id: subQuestions[0].subcategory_id,
          answers: formattedAnswers,
          inherent_likelihood: riskProfile?.operational_likelihood || 3,
          inherent_impact: riskProfile?.operational_impact || 3,
        });
      }

      const summaryRes = await generateSummary({ assessment_id: assessmentId });
      setResult(summaryRes);
      alert("Assessment completed successfully.");
    } catch (err: any) {
      console.error(err);
      alert("Error submitting assessment.");
    } finally {
      setSubmitting(false);
    }
  }

  const grouped = groupByCategory(questions);
  // For IT: count per subcategory; for NON_IT: count per question
  const totalCount = role === "IT" ? Object.keys(grouped).length : questions.length;
  const answeredCount = role === "IT"
    ? Object.keys(grouped).filter((cat) => answers[cat] !== undefined && answers[cat] !== null).length
    : Object.keys(answers).length;

  // Build a lookup map: subcategory_id → category info
  const categoryMap: Record<string, any> = {};
  if (categories && categories.length > 0) {
    for (const cat of categories) {
      categoryMap[cat.id] = cat;
    }
  }

  return (
    <Container>
      <h2>NIST CSF Assessment</h2>

      {loading && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p>Loading questions...</p>
        </div>
      )}

      {!loading && totalCount === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#f87171" }}>
          <p>No questions found. Please go back and try again.</p>
          {prevStep && <Button onClick={prevStep}>← Back</Button>}
        </div>
      )}

      {!loading && totalCount > 0 && (
        <p style={{ marginBottom: 20, color: "#aaa" }}>
          Answer all {totalCount} questions below. Progress: {answeredCount}/{totalCount}
        </p>
      )}

      {/* ====== IT ROLE: CARD LAYOUT ====== */}
      {role === "IT" && Object.keys(grouped).map((cat) => {
        // subcategory_id is e.g. "DE.AE-01", nist_categories id is "DE.AE"
        const parentId = cat.replace(/-\d+$/, "");
        const catInfo = categoryMap[parentId];
        return (
          <div key={cat} style={itRow}>
            <div style={itRowLeft}>
              <span style={cardBadge}>{cat}</span>
              <span style={cardTitle}>{catInfo?.name || cat}</span>
            </div>
            <div style={scoreButtons}>
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() =>
                    setAnswers((prev: any) => ({ ...prev, [cat]: score }))
                  }
                  style={{
                    ...scoreBtn,
                    ...(answers[cat] === score ? scoreBtnActive : {}),
                  }}
                >
                  {score}
                </button>
              ))}
              <span style={scoreLabel}>
                {answers[cat]
                  ? scoreLabelText[answers[cat] as 1 | 2 | 3 | 4 | 5]
                  : "Not answered"}
              </span>
            </div>
          </div>
        );
      })}

      {/* ====== NON_IT ROLE: TABLE LAYOUT ====== */}
      {role !== "IT" && Object.keys(grouped).map((cat) => (
        <div key={cat} style={{ marginBottom: 40 }}>
          <h3>{cat}</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Question</th>
                <th style={th}>1</th>
                <th style={th}>2</th>
                <th style={th}>3</th>
                <th style={th}>4</th>
                <th style={th}>5</th>
              </tr>
            </thead>
            <tbody>
              {grouped[cat].map((q: any) => (
                <tr key={q.id}>
                  <td style={td}>{q.question_text}</td>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <td key={score} style={td}>
                      <input
                        type="radio"
                        name={q.id}
                        value={score}
                        checked={answers[q.id] === score}
                        onChange={() =>
                          setAnswers((prev: any) => ({ ...prev, [q.id]: score }))
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {prevStep && <Button onClick={prevStep}>← Back</Button>}

      {!loading && totalCount > 0 && (
        <Button onClick={handleSubmit}>
          {submitting ? "Submitting..." : `Submit Assessment (${answeredCount}/${totalCount})`}
        </Button>
      )}

      {/* RESULT SECTION */}
      {result && (
        <div id="assessment-result" style={{ marginTop: 50 }}>
          <hr style={{ marginBottom: 20 }} />
          <h2>Assessment Result</h2>

          <p>
            <strong>Maturity Score:</strong>{" "}
            {result.maturity || result.data?.maturity_score}
          </p>

          <p>
            <strong>Residual Score:</strong>{" "}
            {result.residual || result.data?.residual_score}
          </p>

          <p>
            <strong>Risk Tier:</strong>{" "}
            {result.riskTier || result.data?.risk_tier}
          </p>

          <h3>AI Reasoning</h3>
          <pre
            style={{ background: "#111", padding: 20, whiteSpace: "pre-wrap" }}
          >
            {result.summary || result.data?.ai_reason}
          </pre>

          <Button
            onClick={() =>
              exportAssessmentPDF({
                maturityScore: result.maturity || result.data?.maturity_score || 0,
                residualScore: result.residual || result.data?.residual_score || 0,
                riskTier: result.riskTier || result.data?.risk_tier || "UNKNOWN",
                summary: result.summary || result.data?.ai_reason || "",
              })
            }
          >
            📄 Download PDF Report
          </Button>
        </div>
      )}
    </Container>
  );
}

/* ──────────────────────────────────────────
   NON_IT TABLE STYLES
───────────────────────────────────────── */
const th = { border: "1px solid #333", padding: 10 };
const td = { border: "1px solid #333", padding: 10 };

/* ──────────────────────────────────────────
   IT ROW STYLES
───────────────────────────────────────── */
const itRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  background: "#111",
  border: "1px solid #2a2a2a",
  borderRadius: 8,
  marginBottom: 10,
  flexWrap: "wrap",
  gap: 12,
};

const itRowLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flex: 1,
  minWidth: 200,
};

const cardBadge: React.CSSProperties = {
  background: "#3b82f6",
  color: "#fff",
  borderRadius: 6,
  padding: "2px 10px",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 0.5,
  whiteSpace: "nowrap",
};

const cardTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: "#e2e8f0",
};

const scoreButtons: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const scoreBtn: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#94a3b8",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.15s",
};

const scoreBtnActive: React.CSSProperties = {
  background: "#3b82f6",
  border: "1px solid #3b82f6",
  color: "#fff",
};

const scoreLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  marginLeft: 8,
};

const scoreLabelText: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Initial",
  2: "Developing",
  3: "Defined",
  4: "Managed",
  5: "Optimized",
};

