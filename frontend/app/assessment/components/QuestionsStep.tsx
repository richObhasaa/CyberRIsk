"use client";

import { useState } from "react";
import { Container, Button } from "./UI";

export default function QuestionsStep({
  questions,
  loading,
  riskProfile,
  submitSubcategory,
  assessmentId,
}: any) {
  const [answers, setAnswers] = useState<any>({});

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
      alert("Assessment not created yet.");
      return;
    }

    const grouped = groupByCategory(questions);

    for (const cat in grouped) {
      const subQuestions = grouped[cat];

      const formattedAnswers = subQuestions.map((q) => ({
        question_id: q.id,
        score: answers[q.id],
      }));

      await submitSubcategory({
        assessment_id: assessmentId,
        subcategory_id: subQuestions[0].subcategory_id,
        answers: formattedAnswers,
        inherent_likelihood: riskProfile.operational_likelihood,
        inherent_impact: riskProfile.operational_impact,
      });
    }

    alert("Assessment submitted successfully.");
  }

  const grouped = groupByCategory(questions);

  return (
    <Container>
      <h2>NIST CSF Assessment</h2>

      {loading && <p>Loading...</p>}

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
                        onChange={() =>
                          setAnswers({
                            ...answers,
                            [q.id]: score,
                          })
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
        Submit Assessment
      </Button>
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