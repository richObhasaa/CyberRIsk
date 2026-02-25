import { z } from "zod";

export const riskSchema = z.object({
  // ===== MODULE 2 =====
  organizationSector: z.string().optional(),
  employeeCount: z.number().optional(),
  systemType: z.string().optional(),

  // ===== MODULE 3 =====
  ciaValue: z.string().optional(),

  // ===== MODULE 4 =====
  vulnerabilities: z.array(z.string()).optional(),

assets: z
  .array(
    z.object({
      name: z.string(),
      type: z.string(),
      ciaValue: z.enum(["Low", "Medium", "High"]),
    })
  )
  .optional(),

  // ===== EXISTING =====
  risks: z.object({
    operational: z.object({
      likelihood: z.number(),
      impact: z.number(),
      controlEffectiveness: z.number(),
    }),
    financial: z.object({
      likelihood: z.number(),
      impact: z.number(),
      controlEffectiveness: z.number(),
    }),
    compliance: z.object({
      likelihood: z.number(),
      impact: z.number(),
      controlEffectiveness: z.number(),
    }),
    reputational: z.object({
      likelihood: z.number(),
      impact: z.number(),
      controlEffectiveness: z.number(),
    }),
    strategic: z.object({
      likelihood: z.number(),
      impact: z.number(),
      controlEffectiveness: z.number(),
    }),
  }),
});