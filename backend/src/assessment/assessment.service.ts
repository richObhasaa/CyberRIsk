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
  } = payload;

  if (!answers?.length)
    throw new Error("Answers required");

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

  const { data, error: upsertError } =
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
      })
      .select();

  if (upsertError)
    throw new Error(upsertError.message);

  return {
    maturity,
    inherent,
    residual,
    data,
  };
}