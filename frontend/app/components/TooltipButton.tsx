"use client";
import { useState } from "react";

function TooltipButton({ href, label, title, description }: {
    href: string;
    label: string;
    title: string;
    description: string;
}) {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <button
            onClick={() => window.location.href = href}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className="relative w-full max-w-[300px] bg-white border border-transparent 
                        hover:border-white/50 hover:bg-transparent text-black hover:text-white 
                        font-bold py-4 rounded-2xl transition-all duration-300 
                        shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] mt-4 active:scale-95 cursor-pointer overflow-visible">
            {label}

            <div
                style={{
                    left: pos.x,
                    top: pos.y - 12, // offset above cursor
                    transform: "translate(-50%, -100%)",
                    opacity: visible ? 1 : 0,
                    translate: visible ? "none" : "0 6px",
                }}
                className="absolute w-64 p-3 rounded-2xl bg-black/80 border border-white/10 
                            backdrop-blur-md text-white text-xs font-normal text-left leading-relaxed 
                            transition-all pointer-events-none z-50"
            >
                <p className="font-semibold text-[#B19EEF] mb-1">{title}</p>
                <p className="text-gray-400">{description}</p>
            </div>
        </button>
    );
}

export default TooltipButton;