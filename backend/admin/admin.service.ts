import { supabase } from "../src/db/supabase";

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("organization_users")
    .select(`
      role,
      users ( id, email ),
      organizations ( id, name )
    `);

  if (error) throw error;
  return data;
};

export const promoteToAdvisor = async (
  userId: string,
  organizationId: string
) => {
  const { error } = await supabase
    .from("organization_users")
    .update({ role: "advisor" })
    .eq("user_id", userId)
    .eq("organization_id", organizationId);

  if (error) throw error;
};

export const getAllAssessments = async () => {
  const { data, error } = await supabase
    .from("assessments")
    .select(`
      id,
      name,
      status,
      maturity_average,
      inherent_score,
      residual_score,
      created_at,
      organizations ( name )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};