"use client"

import { TextInput, PasswordInput, EmailInput } from "../components/formComponents";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, register, resendConfirmation } from "../lib/auth";

export default function AuthPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"login" | "register">("login");
    const [animKey, setAnimKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            if (mode === "login") {
                await login(email, password);
                router.replace("/urltest");
            } else {
                await register(email, password);
                setMessage("Registration successful. Check your email to confirm.");
                setMode("login");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            setMode(hash === "#register" ? "register" : "login");
            setAnimKey(k => k + 1);
        };

        handleHashChange();
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const toggleMode = (e: React.MouseEvent) => {
        e.preventDefault();
        const newMode = mode === "login" ? "register" : "login";
        window.location.hash = newMode;
    };

    return (
        <div className="relative min-h-screen w-full flex items-start justify-center py-25">
            <div className="flex flex-col items-center justify-center w-full max-w-md p-10 border border-white/10 rounded-3xl mx-4 z-10">

                {/* Title animates on mode change */}
                <h1
                    key={`title-${animKey}`}
                    className="text-3xl font-bold mb-8 text-white fade-up"
                >
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                </h1>

                <form onSubmit={handleSubmit} className="w-full space-y-5">

                    {/* Name field slides in when registering */}
                    <div
                        key={`name-${animKey}`}
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${mode === "register"
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0"
                            }`}
                    >
                        <div className="fade-up pb-1">
                            <TextInput
                                label="Name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={setName}
                            />
                        </div>
                    </div>

                    {/* Email and password fade up on mode change */}
                    <div key={`email-${animKey}`} className="fade-up" style={{ animationDelay: mode === "register" ? "80ms" : "0ms" }}>
                        <EmailInput
                            label="Email Address"
                            placeholder="Enter your email"
                            value={email}
                            onChange={setEmail}
                        />
                    </div>

                    <div key={`password-${animKey}`} className="fade-up" style={{ animationDelay: mode === "register" ? "140ms" : "40ms" }}>
                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={setPassword}
                        />
                    </div>

                    <div key={`btn-${animKey}`} className="fade-up" style={{ animationDelay: mode === "register" ? "200ms" : "80ms" }}>
                        <button
                            className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] mt-4 active:scale-95"
                            type="submit"
                        >
                            {mode === "register" ? "Register" : "Sign In"}
                        </button>
                    </div>

                    <div key={`footer-${animKey}`} className="flex flex-col items-center gap-4 mt-5 text-sm fade-in">
                        <button
                            onClick={toggleMode}
                            className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                            {mode === "register"
                                ? "Already have an account? Sign In"
                                : "Don't have an account? Register here"}
                        </button>

                        <a href="/forgot-password" title="Coming soon" className="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-xs">
                            Forgot your password?
                        </a>
                    </div>
                </form>
            </div>

            {/* Background Effects */}
            <div className="hidden md:block absolute pointer-events-none inset-x-0 bottom-0 h-100 bg-gradient-to-t from-[#B19EEF]/20 to-transparent" />
            <div className="hidden md:block absolute pointer-events-none inset-y-0 left-0 w-100 bg-gradient-to-r from-black to-transparent" />
            <div className="hidden md:block absolute pointer-events-none inset-y-0 right-0 w-100 bg-gradient-to-l from-black to-transparent" />
        </div>
    );
}


{/*async function handleResend() {
    setError("");
    setMessage("");

    try {
      await resendConfirmation(email);
      setMessage("Confirmation email sent again.");
    } catch (err: any) {
      setError(err.message);
    }
  }
*/}