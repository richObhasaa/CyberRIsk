"use client";

import { useState } from "react";
import {
  Building2,
  Database,
  ShieldAlert,
  Sliders,
  ChevronDown,
} from "lucide-react";
import Section from "./Section";

export default function FillingFormsSection() {
  const [open, setOpen] = useState<number | null>(0);

  const sections = [
    {
      title: "Organization Information",
      icon: Building2,
      items: [
        "Organization Name",
        "Business Sector",
        "Employee Size",
        "System Type",
      ],
    },
    {
      title: "Asset Registration",
      icon: Database,
      items: [
        "Asset Name",
        "Owner",
        "Location",
        "Asset Type",
        "CIA Level",
      ],
    },
    {
      title: "Vulnerability Selection",
      icon: ShieldAlert,
      items: [
        "Injection",
        "Broken Authentication",
        "Sensitive Data Exposure",
        "Access Control Failures",
        "Security Misconfiguration",
        "Cross-Site Attacks",
        "Logging & Monitoring",
        "Dependency & Software",
      ],
    },
    {
      title: "Advanced Risk Overrides (Optional)",
      icon: Sliders,
      items: ["Control Effectiveness (%)"],
    },
  ];

  return (
    <Section id="filling-forms" title="Filling the Forms">
      <div className="space-y-3">
        {sections.map((section, i) => {
          const Icon = section.icon;
          const isOpen = open === i;

          return (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-cyan-400/15 bg-gradient-to-br from-[#020617]/80 via-[#041c22]/70 to-[#020617]/90 backdrop-blur transition-all duration-300 hover:border-cyan-300/40"
            >
              {/* subtle top glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-400/5 to-transparent" />

              {/* left accent */}
              <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#22d3ee] to-[#0891b2] opacity-70 group-hover:opacity-100" />

              {/* HEADER */}
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#041c22] border border-cyan-400/20">
                    <Icon size={18} className="text-cyan-300" />
                  </div>

                  <span className="font-semibold text-white tracking-wide">
                    {section.title}
                  </span>
                </div>

                <ChevronDown
                  size={18}
                  className={`text-cyan-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* CONTENT */}
              <div
                className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      {section.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-gray-300"
                        >
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-cyan-400/70 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}