"use client";

import { useState } from "react";
import { Container, Button } from "./UI";
import { generateSummary } from "../../lib/api";

export default function QuestionsStep({
  questions,
  loading,
  riskProfile,
  submitSubcategory,
  assessmentId,
}: any) {
  const [answers, setAnswers] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  function groupByCategory(data: any[]) {
    const map: Record<string, any[]> = {};

    for (const q of data) {
      const category = q.subcategory_id.split("-")[0];
      if (!map[category]) map[category] = [];
      map[category].push(q);
    }

    return map;
  }

  async function handleSubmit() {
    if (!assessmentId) {
      alert("Assessment not found.");
      return;
    }

    // ✅ VALIDASI SEMUA TERISI
    for (const q of questions) {
      if (!answers[q.id]) {
        alert("Please answer all questions before submitting.");
        return;
      }
    }

    try {
      setSubmitting(true);

      const grouped = groupByCategory(questions);

      // 🔹 SUBMIT PER SUBCATEGORY
      for (const cat in grouped) {
        const subQuestions = grouped[cat];

        const formattedAnswers = subQuestions.map((q) => ({
          question_id: q.id,
          score: Number(answers[q.id]),
        }));

        await submitSubcategory({
          assessment_id: assessmentId,
          subcategory_id: subQuestions[0].subcategory_id,
          answers: formattedAnswers,
          inherent_likelihood: riskProfile?.operational_likelihood || 3,
          inherent_impact: riskProfile?.operational_impact || 3,
        });
      }

      // 🔹 GENERATE SUMMARY
      const summaryRes = await generateSummary({
        assessment_id: assessmentId,
      });

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

  return (
    <Container>
      <h2>NIST CSF Assessment</h2>

      {loading && <p>Loading questions...</p>}

      {Object.keys(grouped).map((cat) => (
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
                          setAnswers((prev: any) => ({
                            ...prev,
                            [q.id]: score,
                          }))
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

      <Button onClick={handleSubmit}>
        {submitting ? "Submitting..." : "Submit Assessment"}
      </Button>

      {/* 🔥 RESULT SECTION */}
      {result && (
        <div style={{ marginTop: 50 }}>
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
            style={{
              background: "#111",
              padding: 20,
              whiteSpace: "pre-wrap",
            }}
          >
            {result.summary || result.data?.ai_reason}
          </pre>
        </div>
      )}
    </Container>
  );
}

const th = {
  border: "1px solid #333",
  padding: 10,
};

const td = {
  border: "1px solid #333",
  padding: 10,
};