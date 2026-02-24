import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

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
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} font-inter antialiased bg-[#020403] text-white`}>
                {children}
            </body>
        </html>
    );
}
