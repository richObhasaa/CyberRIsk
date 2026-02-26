"use client";

import { motion } from "framer-motion";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export default function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="px-6 py-14">
      <div className="max-w-6xl mx-auto">
        
        {/* animated title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-semibold text-white mb-6"
        >
          {title}
        </motion.h2>

        <div className="text-gray-300 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
}