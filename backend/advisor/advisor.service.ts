import { supabase } from "../src/db/supabase";

export const reviewAssessment = async (
  assessmentId: string,
  advisorId: string,
  summary: string
) => {
  const { data, error } = await supabase
    .from("assessments")
    .select("status, advisor_id")
    .eq("id", assessmentId)
    .single();

  if (error) throw error;

  if (data.status !== "under_review") {
    throw new Error("Assessment not in review state");
  }

  await supabase
    .from("assessments")
    .update({
      advisor_summary: summary,
      advisor_id: advisorId,
      advisor_reviewed_at: new Date(),
      status: "finalized",
    })
    .eq("id", assessmentId);
};