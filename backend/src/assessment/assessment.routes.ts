import express from "express";
import { submitSubcategory } from "./assessment.service";
import { verifyToken } from "../auth/verifyAssesment";
import { supabase } from "../db/supabase";

const router = express.Router();

/**
 * Submit per subcategory (Hybrid)
 */
router.post(
  "/submit-subcategory",
  verifyToken,
  async (req, res) => {
    try {
      const result = await submitSubcategory(
        req.body
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
);

/**
 * Finalize assessment (aggregate)
 */
router.post(
  "/finalize",
  verifyToken,
  async (req, res) => {
    try {
      const { assessment_id } = req.body;

      const { data } = await supabase
        .from("assessment_subcategory_results")
        .select("residual_score, maturity_level")
        .eq("assessment_id", assessment_id);

      if (!data?.length)
        return res
          .status(400)
          .json({ error: "No results found" });

      const avgResidual =
        data.reduce(
          (s, r) => s + r.residual_score,
          0
        ) / data.length;

      const avgMaturity =
        data.reduce(
          (s, r) => s + r.maturity_level,
          0
        ) / data.length;

      await supabase
        .from("assessments")
        .update({
          residual_score: avgResidual,
          maturity_average: avgMaturity,
          status: "finalized",
        })
        .eq("id", assessment_id);

      res.json({
        success: true,
        avgResidual,
        avgMaturity,
      });
    } catch (err: any) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

export default router;

