"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { submitSubcategory } from "../../lib/api";

export default function AssessmentPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    try {
      await submitSubcategory({
        assessment_id: id,
        subcategory_id: "GV.OC-01",
        inherent_likelihood: 3,
        inherent_impact: 4,
        answers: [
          {
            question_id: "YOUR_QUESTION_UUID",
            score: 4,
          },
        ],
      });

      alert("Submitted successfully");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Assessment Submit</h1>

      <button
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Example"}
      </button>
    </div>
  );
}