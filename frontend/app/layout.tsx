import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "./components/NavbarWrapper";
import { NavbarProvider } from "@/app/context/NavbarContext";
import { useRequireAuth } from "./lib/useRequireAuth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CyberRisk — AI-Powered Cyber Risk Platform",
  description:
    "Assess, detect, and protect your infrastructure with real-time AI-driven cyber risk intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const { loading } = useRequireAuth();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-inter antialiased bg-[#020403] text-white`}>
        <NavbarProvider>
          <NavbarWrapper />
          {children}
        </NavbarProvider>
      </body>
    </html >
  );
}