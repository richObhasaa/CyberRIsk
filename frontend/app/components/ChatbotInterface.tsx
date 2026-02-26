"use client";

import { useEffect, useState } from "react";

export default function ChatbotInterface() {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [open]);

    return (
        <div className="fixed bottom-10 right-10">
            <button onClick={() => setOpen(!open)} className="bg-[#B19EEF] text-white px-4 py-4 rounded-full shadow-lg hover:bg-[#B19EEF]/80 transition-colors">
                <img src="/chat.png" alt="Chat" className="w-8 h-8" />
            </button>
            {open && (
                <div className="fade-up fixed bottom-30 right-10 w-100 h-120 bg-[#14152a] rounded-lg shadow-lg ">
                    <div className="flex flex-row items-center justify-between p-5">
                        <p className="text-xl font-bold">CyberRIsk Assistant</p>
                        <button onClick={() => setOpen(false)} className="text-xl font-bold">X</button>
                    </div>
                    <div className="">

                    </div>
                </div>
            )}
        </div>
    );
}