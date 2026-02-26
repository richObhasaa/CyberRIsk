import express from "express";
import { submitSubcategory } from "./assessment.service";
import { verifyToken } from "../auth/verifyAssessment";
import { requireApprovalRole } from "../auth/requireApprovalRole";
import { supabase } from "../db/supabase";
import { classifyRiskTier } from "./scoring.engine";

const router = express.Router();

/* =====================================================
   🔥 NEW — CREATE ASSESSMENT
===================================================== */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { organization_id, assessment_type } = req.body;

    if (!organization_id || !assessment_type) {
      return res.status(400).json({
        error: "Missing organization_id or assessment_type",
      });
    }

    const { data, error } = await supabase
      .from("assessments")
      .insert([
        {
          organization_id,
          mode: assessment_type,   // ← PENTING: kolomnya MODE
          status: "draft",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("CREATE ASSESSMENT ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      success: true,
      assessment: data,
    });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   🔥 NEW — GET QUESTIONS BY ROLE
===================================================== */

router.get(
  "/questions/:role",
  verifyToken,
  async (req, res) => {
    try {
      const { role } = req.params;

      const { data, error } = await supabase
        .from("nist_questions")
        .select("*")
        .eq("mode", role)
        .order("subcategory_id", { ascending: true });

      if (error) throw error;

      res.json({
        success: true,
        questions: data || [],
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =====================================================
   🔥 NEW — SUBMIT ALL
===================================================== */
router.post(
  "/submit-all",
  verifyToken,
  async (req, res) => {
    try {
      const user = (req as any).user;
      const { assessment_id, answers } =
        req.body;

      if (!answers?.length)
        return res
          .status(400)
          .json({ error: "Answers required" });

      for (const sub of answers) {
        await submitSubcategory({
          ...sub,
          assessment_id,
          user_id: user.id,
        });
      }

      await supabase
        .from("assessments")
        .update({ status: "submitted" })
        .eq("id", assessment_id);

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =====================================================
   🔥 NEW — AUDITOR REVIEW DECISION
===================================================== */
router.post(
  "/auditor-review",
  verifyToken,
  requireApprovalRole,
  async (req, res) => {
    try {
      const {
        assessment_id,
        decision,
        notes,
      } = req.body;

      if (
        !["approved", "revision_required"].includes(
          decision
        )
      )
        return res
          .status(400)
          .json({ error: "Invalid decision" });

      await supabase
        .from("assessments")
        .update({
          auditor_notes: notes,
          status: decision,
        })
        .eq("id", assessment_id);

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =====================================================
   🔥 ORIGINAL CODE BELOW (TIDAK DIHAPUS)
===================================================== */

/* GET MY ORGANIZATIONS */
router.get(
  "/my-organizations",
  verifyToken,
  async (req, res) => {
    try {
      const user = (req as any).user;

      const { data } = await supabase
        .from("organization_users")
        .select(`
          role,
          organizations (
            id,
            name
          )
        `)
        .eq("user_id", user.id);

      res.json({
        success: true,
        organizations: data || [],
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* CREATE ORGANIZATION */
router.post(
  "/create-organization",
  verifyToken,
  async (req, res) => {
    try {
      const user = (req as any).user;
      const { name } = req.body;

      if (!name)
        return res.status(400).json({
          error: "Organization name required",
        });

      // CEK DULU APAKAH SUDAH ADA
      const { data: existing } = await supabase
        .from("organizations")
        .select("*")
        .eq("name", name)
        .maybeSingle();

      let org = existing;

      if (!existing) {
        const { data, error: insertError } = await supabase
          .from("organizations")
          .insert({ name })
          .select()
          .single();

        if (insertError || !data) {
          console.error("INSERT ORG ERROR:", insertError);
          return res.status(500).json({
            error: insertError?.message || "Failed to create organization",
          });
        }

        org = data;
      }

      if (!org || !org.id) {
        return res.status(500).json({
          error: "Organization could not be resolved",
        });
      }

      // Pastikan user tidak double insert di organization_users
      const { data: link } = await supabase
        .from("organization_users")
        .select("*")
        .eq("user_id", user.id)
        .eq("organization_id", org.id)
        .maybeSingle();

      if (!link) {
        await supabase
          .from("organization_users")
          .insert({
            user_id: user.id,
            organization_id: org.id,
            role: "admin",
          });
      }

      res.json({
        success: true,
        organization: org,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* LIST */
router.get(
  "/list",
  verifyToken,
  async (req, res) => {
    try {
      const user = (req as any).user;

      const { data: orgUser } = await supabase
        .from("organization_users")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (!orgUser)
        return res.status(403).json({
          error: "No organization access",
        });

      const { data } = await supabase
        .from("assessments")
        .select("*")
        .eq("organization_id", orgUser.organization_id)
        .order("created_at", {
          ascending: false,
        });

      res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

/* REVIEW DRAFTS */
router.get(
  "/review/drafts",
  verifyToken,
  async (req, res) => {
    try {
      const user = (req as any).user;

      const { data: orgUser } = await supabase
        .from("organization_users")
        .select("organization_id, role")
        .eq("user_id", user.id)
        .single();

      if (
        !orgUser ||
        !["admin", "auditor"].includes(
          orgUser.role
        )
      )
        return res.status(403).json({
          error: "Access denied",
        });

      const { data } = await supabase
        .from("assessments")
        .select("*")
        .eq("organization_id", orgUser.organization_id)
        .eq("status", "draft")
        .order("created_at", {
          ascending: false,
        });

      res.json({
        success: true,
        drafts: data,
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

/* GET REPORT */
router.get(
  "/:id/report",
  verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { data: assessment } =
        await supabase
          .from("assessments")
          .select("*")
          .eq("id", id)
          .single();

      if (!assessment)
        return res.status(404).json({
          error: "Not found",
        });

      const { data: functions } =
        await supabase
          .from("assessment_function_results")
          .select("*")
          .eq("assessment_id", id);

      res.json({
        success: true,
        data: {
          assessment,
          executive_summary:
            assessment.executive_summary,
          functions,
        },
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

/* SUBMIT SUBCATEGORY */
router.post(
  "/submit-subcategory",
  verifyToken,
  async (req, res) => {
    try {
      const result =
        await submitSubcategory({
          ...req.body,
          user_id: (req as any).user.id,
        });

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
);

/* APPROVE FINALIZE */
router.post(
  "/approve-finalize",
  verifyToken,
  requireApprovalRole,
  async (req, res) => {
    try {
      const {
        assessment_id,
        approval_note,
      } = req.body;

      const { data: assessment } =
        await supabase
          .from("assessments")
          .select("*")
          .eq("id", assessment_id)
          .single();

      if (!assessment)
        return res.status(404).json({
          error: "Not found",
        });

      if (
        assessment.status === "finalized"
      )
        return res.status(400).json({
          error: "Already finalized",
        });

      const { data: sub } =
        await supabase
          .from(
            "assessment_subcategory_results"
          )
          .select(
            "residual_score, inherent_score, maturity_level"
          )
          .eq(
            "assessment_id",
            assessment_id
          );

      if (!sub?.length)
        return res.status(400).json({
          error: "No results",
        });

      const avgResidual =
        sub.reduce(
          (s, r) =>
            s + r.residual_score,
          0
        ) / sub.length;

      const avgMaturity =
        sub.reduce(
          (s, r) =>
            s + r.maturity_level,
          0
        ) / sub.length;

      const overallRiskTier =
        classifyRiskTier(
          avgResidual
        );

      await supabase
        .from("assessments")
        .update({
          residual_score: Number(
            avgResidual.toFixed(2)
          ),
          maturity_average: Number(
            avgMaturity.toFixed(2)
          ),
          status: "finalized",
        })
        .eq("id", assessment_id);

      res.json({
        success: true,
        overallRiskTier,
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

/* AUDITOR SUMMARY */
router.post(
  "/auditor-summary",
  verifyToken,
  requireApprovalRole,
  async (req, res) => {
    try {
      const {
        assessment_id,
        auditor_summary,
      } = req.body;

      const { data: assessment } =
        await supabase
          .from("assessments")
          .select("status")
          .eq("id", assessment_id)
          .single();

      if (!assessment)
        return res.status(404).json({
          error: "Not found",
        });

      if (
        assessment.status !==
        "finalized"
      )
        return res.status(400).json({
          error:
            "Not finalized yet",
        });

      await supabase
        .from("assessments")
        .update({
          auditor_summary,
        })
        .eq("id", assessment_id);

      res.json({
        success: true,
        message:
          "Auditor summary saved",
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);
// AGGREGATE + SUMMARY

router.post("/generate-summary", verifyToken, async (req, res) => {
  try {
    const { assessment_id } = req.body;

    if (!assessment_id) {
      return res.status(400).json({ error: "assessment_id required" });
    }

    /* GET ALL SUBCATEGORY RESULTS */
    const { data: results, error } = await supabase
      .from("assessment_subcategory_results")
      .select("*")
      .eq("assessment_id", assessment_id);

    if (error) throw error;

    if (!results || results.length === 0) {
      return res.status(400).json({ error: "No results found" });
    }

    /* CALCULATE AGGREGATES */
    const avgResidual =
      results.reduce((acc, r) => acc + Number(r.residual_score), 0) /
      results.length;

    const avgMaturity =
      results.reduce((acc, r) => acc + Number(r.maturity_level), 0) /
      results.length;

    /* CLASSIFY RISK */
    let riskTier = "LOW";
    if (avgResidual > 15) riskTier = "CRITICAL";
    else if (avgResidual > 10) riskTier = "HIGH";
    else if (avgResidual > 5) riskTier = "MEDIUM";

    /* AI SUMMARY (BASIC VERSION) */
    const aiSummary = `
This assessment indicates an overall maturity level of ${avgMaturity.toFixed(
      2
    )} out of 5.
The calculated residual risk score is ${avgResidual.toFixed(
      2
    )}, placing the organization in the ${riskTier} risk tier.

Strength areas reflect moderate implementation of cybersecurity controls,
while certain domains may require further investment to reduce residual exposure.

Recommended next steps include strengthening governance oversight,
enhancing monitoring controls, and improving incident response maturity.
`;

    /* UPDATE ASSESSMENT TABLE */
    await supabase
      .from("assessments")
      .update({
        maturity_average: avgMaturity,
        residual_score: avgResidual,
        executive_summary: aiSummary,
        status: "draft",
      })
      .eq("id", assessment_id);

    return res.json({
      success: true,
      maturity: avgMaturity,
      residual: avgResidual,
      riskTier,
      summary: aiSummary,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
export default router;