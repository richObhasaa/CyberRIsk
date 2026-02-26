"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function FlipFeatureCard({ feature }: any) {
  const Icon = feature.icon;

  return (
    <motion.div
      whileHover={{ rotateY: 180, scale: 1.02 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="group relative h-[220px] w-full cursor-pointer [transform-style:preserve-3d] hover:shadow-[0_0_40px_rgba(34,211,238,0.18)]"
    >
      {/* FRONT */}
      <div className="absolute inset-0 backface-hidden rounded-2xl p-[1px] bg-gradient-to-r from-[#0891b2]/40 via-[#22d3ee]/30 to-[#0891b2]/40">
        <div className="rounded-2xl bg-gradient-to-br from-[#052e35] via-[#041c22] to-[#020617] backdrop-blur-xl p-6 h-full flex flex-col">

          {/* ===== TOP CONTENT ===== */}
          <div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0e7490] to-[#22d3ee] flex items-center justify-center mb-4 shadow-md shadow-cyan-500/20">
              <Icon size={22} className="text-white" />
            </div>

            <h4 className="font-semibold text-white leading-snug">
              {feature.title}
            </h4>
          </div>

          {/* ===== PUSH SPACE (important for alignment) ===== */}
          <div className="flex-grow" />

          {/* ===== BUTTON (always bottom) ===== */}
          <div className="mt-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-3 py-1 text-[11px] text-cyan-200/80 backdrop-blur transition-all duration-300 group-hover:border-cyan-300/50 group-hover:bg-cyan-400/10">
              <span>View details</span>
              <ArrowUpRight
                size={12}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BACK */}
      <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-[1px] bg-gradient-to-r from-[#0891b2]/35 via-[#22d3ee]/25 to-[#0891b2]/35">
        <div className="rounded-2xl bg-gradient-to-br from-[#041c22]/90 via-[#020617]/95 to-black backdrop-blur-xl p-6 h-full flex flex-col justify-center items-center text-center">
          <p className="text-sm text-gray-300 leading-relaxed">
            {feature.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
