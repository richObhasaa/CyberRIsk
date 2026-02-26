"use client";
import { useState, useEffect } from "react";
import { getAccessToken } from "../lib/auth";

interface NavbarProps {
    mode: "short" | "dashboard" | "hidden" | null;
}

export default function Navbar({ mode }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

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

    useEffect(() => {
        setAccessToken(getAccessToken());
    }, [getAccessToken()]);

    const isShort = scrolled || mode === "short" || mode === "dashboard";

    return <>
        <div className={`${mode === "hidden" ? "hidden" : ""} fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 transition-all duration-300`}>
            <nav className={`
                inline-flex items-center ${mode === "short" ? "justify-between" : "justify-center"}
                border border-white/[0.08] bg-white/[0.02]
                shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl backdrop-saturate-150
                transition-all duration-500 motion-reduce:duration-1 rounded-full
                ${isShort
                    ? "w-125 py-2 px-4"
                    : "w-[calc(100vw-6rem)] py-2 px-2"
                }
                ${mode === "short" || mode === "dashboard" ? "w-auto" : ""}
            `}>
                <div className={`flex flex-1 items-center ${mode === "short" ? "justify-center" : "justify-start"} gap-2 px-4`}>
                    <img src="/vercel.svg" alt="Logo" className="w-7 h-auto" />
                </div>
                {/* Middle: Links */}
                <div className={`hidden ${(mode !== null && (mode === "short" || mode === "dashboard")) ? "md:hidden" : "md:flex"} items-center gap-6`}>
                    <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Manual
                    </a>
                    <a href="/check-url" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        URL Checker
                    </a>
                    <a href="/audit" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Audit Form
                    </a>
                    {accessToken === null ?
                        <button onClick={() => window.location.href = "/auth#login"} className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium border border-transparent hover:bg-transparent hover:text-white hover:border-white transition-colors">
                            Get Started
                        </button> :
                        <button onClick={() => window.location.href = "/logout"} className="px-4 py-2 rounded-full bg-transparent text-white text-sm font-medium border border-white hover:bg-white hover:text-black hover:border-black transition-colors">
                            Logout
                        </button>
                    }
                </div>
                {accessToken !== null && mode === "short" && (
                    <button onClick={() => window.location.href = "/logout"} className="px-4 py-2 rounded-full bg-transparent text-white text-sm font-medium border border-white hover:bg-white hover:text-black hover:border-black transition-colors">
                        Logout
                    </button>
                )}
            </nav>
        </div>
    </>
}