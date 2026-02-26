"use client";

import { useEffect, useState, useRef } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatbotInterface() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: "user", content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // Replace this with your actual API call
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.content }),
            }); // BUTUH REAL API
            const data = await res.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-10 right-10">
            <button
                onClick={() => setOpen(!open)}
                className="bg-[#B19EEF] text-white px-4 py-4 rounded-full shadow-lg hover:bg-[#B19EEF]/80 transition-colors"
            >
                <img src="/image.png" alt="Chat" className="w-8 h-8 invert" />
            </button>

            {open && (
                <div className="fade-up fixed p-6 !pt-6 bottom-30 right-10 w-100 h-120 bg-[#14152a] rounded-lg shadow-lg flex flex-col">

                    {/* Header */}
                    <div className="flex flex-row items-center justify-between h-[5%]">
                        <p className="text-xl font-bold">CyberRisk Assistant</p>
                        <button onClick={() => setOpen(false)} className="text-xl font-bold">X</button>
                    </div>

                    {/* Messages */}
                    <div className="mt-5 flex-1 border border-white/10 rounded-lg overflow-y-auto p-3 flex flex-col gap-3">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-4">
                                <img src="/image.png" alt="Bot" className="w-10 h-10 invert opacity-30" />
                                <p className="text-white/40 text-sm font-medium">How can I help you today?</p>
                                <p className="text-white/20 text-xs">Ask me anything about cybersecurity risks.</p>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-[#B19EEF] text-white rounded-br-sm"
                                            : "bg-white/10 text-white/90 rounded-bl-sm"
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/10 text-white/50 px-4 py-2 rounded-2xl rounded-bl-sm text-sm">
                                            Thinking...
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <div className="mt-4 flex flex-row items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#B19EEF]/50 transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#B19EEF] hover:bg-[#B19EEF]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <img src="/send.png" alt="Send" className="w-4 h-4 invert" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}