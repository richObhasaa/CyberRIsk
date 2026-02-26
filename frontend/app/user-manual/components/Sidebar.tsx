"use client";

import Link from "next/link";

const navItems = [
  {
    title: "Getting Started",
    items: [
      { label: "Overview", href: "#overview" },
      { label: "Features", href: "#features" },
      { label: "Before You Start", href: "#prereq" },
    ],
  },
  {
    title: "Risk Assessments & Audits",
    items: [
      { label: "Web Security Audit", href: "#web-audit" },
      { label: "Business Risk Assessment", href: "#business-risk" },
      { label: "Filling Forms", href: "#filling-forms" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "AI Assistant", href: "#ai" },
      { label: "About Us", href: "#about" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24">
        {navItems.map((group) => (
          <div key={group.title} className="mb-8">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
              {group.title}
            </p>

            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg px-2 py-1.5 transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}