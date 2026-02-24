"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let isScrolled = false;
        const handleScroll = () => {
            const currentScroll = window.scrollY > 20;
            if (currentScroll !== isScrolled) {
                isScrolled = currentScroll;
                setScrolled(currentScroll);
            }
        };
        // Use passive: true to ensure the browser doesn't wait for JS
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return <>
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 transition-all duration-300">
            <nav className={`inline-flex items-center border border-white/[0.08] bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 motion-reduce:duration-1 rounded-full ${scrolled ? "py-2 px-2 gap-15" : "py-2 px-2 gap-250"}`}>
                <div className="flex flex-1 items-center justify-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">C</span>
                    </div>
                </div>

                {/* Middle: Links */}
                <div className="hidden md:flex items-center gap-6">
                    <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Manual
                    </a>
                    <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Contact
                    </a>
                    <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium border border-transparent hover:bg-transparent hover:text-white hover:border-white transition-colors">
                        Get Started
                    </button>
                </div>
            </nav>
        </div>
    </>
}