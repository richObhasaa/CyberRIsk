import { supabase } from "../db/supabase";
import {
  calculateMaturity,
  calculateInherent,
  calculateResidual,
} from "./scoring.engine";

export async function submitSubcategory(
  payload: any
) {
  const {
    assessment_id,
    subcategory_id,
    answers,
    inherent_likelihood,
    inherent_impact,
    user_id,
  } = payload;

  if (!answers?.length)
    throw new Error("Answers required");

  // CHECK LOCK
  const { data: assessment } = await supabase
    .from("assessments")
    .select("status, organization_id")
    .eq("id", assessment_id)
    .single();

  if (!assessment)
    throw new Error("Assessment not found");

  if (assessment.status === "finalized")
    throw new Error("Assessment is locked (finalized)");

  const questionIds = answers.map(
    (a: any) => a.question_id
  );

  const { data: questions, error } =
    await supabase
      .from("nist_questions")
      .select("id, weight")
      .in("id", questionIds);

  if (error) throw new Error(error.message);

  const enriched = answers.map((a: any) => {
    const q = questions?.find(
      (x) => x.id === a.question_id
    );

    return {
      question_id: a.question_id,
      score: a.score,
      weight: q?.weight || 1,
    };
  });

  const maturity = calculateMaturity(enriched);
  const inherent = calculateInherent(
    inherent_likelihood,
    inherent_impact
  );
  const residual = calculateResidual(
    inherent,
    maturity
  );

  const { error: upsertError } =
    await supabase
      .from("assessment_subcategory_results")
      .upsert({
        assessment_id,
        subcategory_id,
        inherent_likelihood,
        inherent_impact,
        inherent_score: inherent,
        maturity_level: maturity,
        residual_score: residual,
        control_effectiveness: maturity / 5,
      });

  if (upsertError)
    throw new Error(upsertError.message);

  // AUDIT
  await supabase.from("audit_logs").insert({
    user_id,
    organization_id: assessment.organization_id,
    assessment_id,
    event_type: "SUBCATEGORY_SUBMITTED",
    user_input: JSON.stringify(payload),
    ai_output: {
      maturity,
      inherent,
      residual,
    },
    model_version: "v1",
  });

  return { maturity, inherent, residual };
}