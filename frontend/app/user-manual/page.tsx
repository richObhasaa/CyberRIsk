"use client";

import { motion } from "framer-motion";
import FlipFeatureCard from "./components/FlipFeatureCard";
import { Globe, ShieldCheck, Brain, BarChart3, Sparkles, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";

const features = [
  {
    title: "Web Security Audit",
    icon: Globe,
    desc: "Automated scanning of web applications.",
  },
  {
    title: "Business Risk Assessment",
    icon: ShieldCheck,
    desc: "Structured risk evaluation.",
  },
  {
    title: "AI Security Assistant",
    icon: Brain,
    desc: "AI-powered guidance.",
  },
  {
    title: "Risk Analytics Dashboard",
    icon: BarChart3,
    desc: "Visual risk insights.",
  },
];

const faqs = [
  {
    q: "Is CyberRisk suitable for small organizations?",
    a: "Yes. The platform is designed to scale from small teams to large enterprises.",
  },
  {
    q: "Does the Web Audit affect my live website?",
    a: "The audit is designed to be non-destructive and safe for standard environments.",
  },
  {
    q: "Can I export the assessment results?",
    a: "Yes, results can be exported from the dashboard if the feature is enabled.",
  },
];

function Section({ id, title, children }: any) {
  return (
    <section id={id} className="px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
          {title}
        </h2>
        <div className="text-gray-300 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
}


export default function CyberRiskUserManual() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {/* ================= INTRO ================= */}
      <section className="px-6 pt-20 pb-10">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-6 backdrop-blur"
          >
            <Sparkles size={14} />
            CyberRisk Documentation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-[#B19EEF] bg-clip-text text-transparent"
          >
            CyberRisk User Manual
          </motion.h1>

          <p className="mt-4 text-gray-300 max-w-3xl">
            This user manual provides a complete guide to using the CyberRisk
            platform. It explains the platform features, required
            preparations, and step‑by‑step instructions to help organizations
            perform cybersecurity risk assessments effectively.
          </p>

          <p className="mt-4 text-gray-300 max-w-3xl">
          CyberRisk is an AI‑powered cybersecurity risk assessment platform
          designed to help organizations identify, analyze, and mitigate
          digital risks in a structured and measurable way.
        </p>

        <p className="mt-4 text-gray-300 max-w-3xl">
          The platform integrates Web Security Audit and Business Risk
          Assessment into a unified dashboard, enabling security teams,
          auditors, and decision makers to gain clear visibility into their
          security posture.
        </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <Section id="features" title="Core Features">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
                <FlipFeatureCard key={i} feature={feature} />
            ))}
        </div>
      </Section>

      {/* ================= PREREQUISITES ================= */}
      <Section id="prerequisites" title="Prerequisites / Before You Start">
        <div className="space-y-3">

  {[
    "Ensure you have an active CyberRisk account.",
    "Prepare the target website URL for security audit.",
    "Gather organizational information for risk assessment.",
    "Use a modern browser (Chrome, Edge, or Firefox).",
    "Ensure stable internet connectivity.",
  ].map((item, i) => (
    <div
      key={i}
      className="group flex items-start gap-3 rounded-xl border border-cyan-400/15 bg-gradient-to-r from-[#041c22]/60 to-[#020617]/60 p-4 backdrop-blur transition-all duration-300 hover:border-cyan-300/40 hover:bg-[#041c22]/80"
    >
      {/* icon */}
      <CheckCircle2
        size={18}
        className="mt-0.5 text-cyan-300/80 group-hover:text-cyan-200"
      />

      {/* text */}
      <p className="text-gray-300 leading-relaxed">
        {item}
      </p>
    </div>
  ))}

</div>
      </Section>

      {/* ================= WEB AUDIT ================= */}
      <Section id="web-audit" title="Step‑by‑Step: Web Security Audit">
       
        <div className="space-y-3">
            {[
                "Navigate to the Web Security Audit page.",
                "Enter the target website URL.",
                "Configure scan options if available.",
                "Click Run Audit.",
                "Wait for the automated scan to complete.",
                "Review detected vulnerabilities in the results panel.",
            ].map((step, i) => (
            <div
                key={i}
                className="group relative overflow-hidden rounded-xl border border-cyan-400/15 bg-[#020617]/60 backdrop-blur transition-all duration-300 hover:border-cyan-300/40 hover:bg-[#041c22]/70"
            >
            {/* left accent line */}
            <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#22d3ee] to-[#0891b2] opacity-70 group-hover:opacity-100" />

            <div className="flex items-start gap-4 p-4">
                {/* step number */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#041c22] text-xs font-semibold text-cyan-300 border border-cyan-400/20">
                {i + 1}
                </div>

                {/* text */}
                <p className="text-gray-300 leading-relaxed">
                {step}
                </p>
            </div>
            </div>
         ))}

        </div>
      </Section>

      {/* ================= BUSINESS RISK ================= */}
      <Section
        id="business-risk"
        title="Step‑by‑Step: Business Risk Assessment"
      >
        <div className="space-y-3">

  {[
    "Open the Risk Assessment module.",
    "Fill in organizational profile information.",
    "Answer the provided risk evaluation questions.",
    "Submit the assessment form.",
    "Review the calculated risk score and recommendations.",
 ].map((step, i) => (
            <div
                key={i}
                className="group relative overflow-hidden rounded-xl border border-cyan-400/15 bg-[#020617]/60 backdrop-blur transition-all duration-300 hover:border-cyan-300/40 hover:bg-[#041c22]/70"
            >
            {/* left accent line */}
            <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#22d3ee] to-[#0891b2] opacity-70 group-hover:opacity-100" />

            <div className="flex items-start gap-4 p-4">
                {/* step number */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#041c22] text-xs font-semibold text-cyan-300 border border-cyan-400/20">
                {i + 1}
                </div>

                {/* text */}
                <p className="text-gray-300 leading-relaxed">
                {step}
                </p>
            </div>
            </div>
         ))}

</div>
      </Section>

      {/* ================= AI FEATURE ================= */}
      <Section id="ai" title="AI Security Assistant">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-[#041c22]/70 via-[#020617]/80 to-black p-6 backdrop-blur">

  {/* subtle glow */}
  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

  <p className="text-gray-300 leading-relaxed">
    The AI Security Assistant provides intelligent explanations,
    remediation suggestions, and contextual guidance based on your
    assessment results.
  </p>

  <p className="mt-4 text-gray-300 leading-relaxed">
    Use this feature to accelerate analysis, understand complex
    findings, and receive recommended next actions.
  </p>

</div>
      </Section>

      {/* ================= ABOUT ================= */}
      <Section id="about" title="About Us">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-[#020617] via-[#041c22]/80 to-[#020617] p-6 backdrop-blur">

  {/* accent line */}
  <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#22d3ee] to-[#0891b2]" />

  <p className="text-gray-300 leading-relaxed">
    CyberRisk is developed to simplify cybersecurity risk management
    for modern organizations. Our mission is to make risk assessment
    more automated, measurable, and accessible through AI-driven
    technology.
  </p>

</div>
      </Section>

      {/* ================= FAQ ================= */}
      <Section id="faq" title="Frequently Asked Questions">
        <div className="space-y-3">
  {faqs.map((faq, i) => {
    const open = openIndex === i;

    return (
      <div
        key={i}
        className="overflow-hidden rounded-xl border border-cyan-400/15 bg-gradient-to-r from-[#041c22]/60 to-[#020617]/60 backdrop-blur transition-all duration-300"
      >
        {/* QUESTION */}
        <button
          onClick={() => setOpenIndex(open ? null : i)}
          className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-[#041c22]/60"
        >
          <span className="font-medium text-white">{faq.q}</span>

          <ChevronDown
            size={18}
            className={`text-cyan-300 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* ANSWER */}
        <div
          className={`grid transition-all duration-300 ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <p className="px-4 pb-4 text-gray-300 leading-relaxed">
              {faq.a}
            </p>
          </div>
        </div>
      </div>
    );
  })}
</div>

      </Section>
    </div>
  );
}
