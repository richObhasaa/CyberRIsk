"use client";

import { useState } from "react";
import { Container, Button } from "./UI";
import { generateSummary } from "../../lib/api";
import { exportAssessmentPDF } from "../../lib/pdf";
import { TextInput, SelectInput, RangeInput } from "@/app/components/formComponents";

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
      for (const cat of Object.keys(grouped)) {
        if (!answers[cat]) {
          alert("Please answer all subcategories before submitting.");
          return;
        }
      }
    } else {
      for (const q of questions) {
        if (!answers[q.id]) {
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
  const totalCount = role === "IT" ? Object.keys(grouped).length : questions.length;
  const answeredCount = role === "IT"
    ? Object.keys(grouped).filter((cat) => !!answers[cat]).length
    : Object.keys(answers).length;

  const categoryMap: Record<string, any> = {};
  if (categories && categories.length > 0) {
    for (const cat of categories) {
      categoryMap[cat.id] = cat;
    }
  }

  return (
    <Container>
      <h2 className="text-2xl font-bold text-white">NIST CSF Assessment</h2>

      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-400">Loading questions...</p>
        </div>
      )}

      {!loading && totalCount === 0 && (
        <div className="text-center py-10">
          <p className="text-red-400">No questions found. Please go back and try again.</p>
          {prevStep && <Button onClick={prevStep}>← Back</Button>}
        </div>
      )}

      {!loading && totalCount > 0 && (
        <p className="text-gray-400 mb-5">
          Answer all {totalCount} questions below. Progress: {answeredCount}/{totalCount}
        </p>
      )}

      {/* ====== IT ROLE: CARD LAYOUT ====== */}
      {role === "IT" && Object.keys(grouped).map((cat) => {
        const parentId = cat.replace(/-\d+$/, "");
        const catInfo = categoryMap[parentId];
        return (
          <div key={cat} className="flex items-center justify-between flex-wrap gap-3 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <span className="bg-[#B19EEF]/20 text-[#B19EEF] border border-[#B19EEF]/30 rounded-lg px-3 py-0.5 text-xs font-bold tracking-wide whitespace-nowrap">
                {cat}
              </span>
              <span className="text-sm font-medium text-gray-200">
                {catInfo?.name || cat}
              </span>
            </div>

            {/* ✅ RangeInput for IT score (1–5) */}
            <div className="w-64">
              <RangeInput
                label=""
                value={answers[cat] || 1}
                onChange={(val) => setAnswers((prev: any) => ({ ...prev, [cat]: val }))}
                min={1}
                max={5}
                labels={["Initial", "Developing", "Defined", "Managed", "Optimized"]}
              />
            </div>
          </div>
        );
      })}

      {/* ====== NON_IT ROLE: TABLE LAYOUT ====== */}
      {role !== "IT" && Object.keys(grouped).map((cat) => (
        <div key={cat} className="mb-10">
          <h3 className="text-white font-semibold text-base mb-3">{cat}</h3>
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="border border-white/10 px-4 py-3 text-left text-xs font-semibold text-gray-400 tracking-wide">Question</th>
                  {[1, 2, 3, 4, 5].map(s => (
                    <th key={s} className="border border-white/10 px-4 py-3 text-center text-xs font-semibold text-gray-400 tracking-wide w-12">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grouped[cat].map((q: any) => (
                  <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="border border-white/10 px-4 py-3 text-sm text-gray-300">{q.question_text}</td>
                    {[1, 2, 3, 4, 5].map((score) => (
                      <td key={score} className="border border-white/10 px-4 py-3 text-center">
                        <input
                          type="radio"
                          name={q.id}
                          value={score}
                          checked={answers[q.id] === score}
                          onChange={() => setAnswers((prev: any) => ({ ...prev, [q.id]: score }))}
                          className="accent-[#B19EEF] w-4 h-4 cursor-pointer"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-4">
        {prevStep && <Button onClick={prevStep}>← Back</Button>}
        {!loading && totalCount > 0 && (
          <Button onClick={handleSubmit}>
            {submitting ? "Submitting..." : `Submit Assessment (${answeredCount}/${totalCount})`}
          </Button>
        )}
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div id="assessment-result" className="mt-12">
          <hr className="border-white/10 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Assessment Result</h2>

          <div className="flex flex-col gap-3 mb-6">
            <TextInput
              label="Maturity Score"
              value={String(result.maturity || result.data?.maturity_score || "")}
              onChange={() => { }}
            />
            <TextInput
              label="Residual Score"
              value={String(result.residual || result.data?.residual_score || "")}
              onChange={() => { }}
            />
            <TextInput
              label="Risk Tier"
              value={String(result.riskTier || result.data?.risk_tier || "")}
              onChange={() => { }}
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full mb-6">
            <label className="text-xs font-semibold text-gray-400 ml-1 tracking-wide">AI Reasoning</label>
            <pre className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 whitespace-pre-wrap font-sans">
              {result.summary || result.data?.ai_reason}
            </pre>
          </div>

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