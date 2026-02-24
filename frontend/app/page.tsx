"use client";

import Navbar from "./components/Navbar";
import Plasma from "./components/landingBackground";
import GradientText from "./components/gradientText";
import Typewriter from "./components/Typewriter";
import RowLayout from "./layouts/RowLayout";
import StatsSection from "./layouts/StatsSection";
import FeatureSection from "./layouts/FeatureSection";
import ContentSection from "./layouts/ContentSection";

import BentoGrid from "./layouts/BentoGrid";

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="h-screen w-full relative overflow-hidden">
                {/* Background Layer */}
                <div className="absolute h-screen w-full inset-0 z-0 text-white fade-in">
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <Plasma
                            color="#3d0be0"
                            speed={1}
                            direction="forward"
                            scale={2}
                            opacity={1}
                            mouseInteractive={false}
                        />
                    </div>
                </div>

                {/* Foreground Content */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center items-center gap-1 text-white text-center px-4">
                    <Typewriter />
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <p className="text-3xl md:text-4xl font-medium text-gray-300">with</p>
                        <GradientText
                            colors={["#ffffff", "#a09eff", "#6f3be8"]}
                            animationSpeed={8}
                            showBorder={false}
                            className="text-5xl md:text-7xl font-bold tracking-tight"
                        >
                            CyberRisk
                        </GradientText>
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black to-transparent" />
            </div>

            <ContentSection
                title="AI-Powered Threat Detection"
                subtitle="Real-Time Intelligence"
            />

            <FeatureSection
                features={[
                    {
                        title: "AI-Driven Security Chatbot",
                        description: "Using fine-tuned LLMs as a consultant for your risk management process",
                        icon: "🔒",
                    },
                    {
                        title: "NIST-CSF Compliance",
                        description: "Using fine-tuned LLMs to audit your report for NIST-CSF compliance.",
                        icon: "☁️",
                    },
                    {
                        title: "URL Scanner",
                        description: "Using fine-tuned LLMs to audit your URL.",
                        icon: "📜",
                    },
                ]}
            />

            <RowLayout
                title="AI-Powered Threat Detection"
                subtitle="Real-Time Intelligence"
                content="Leverage our advanced AI engine to detect anomalies and threats in real-time. Our system continuously scans your infrastructure for vulnerabilities and provides instant alerts to mitigate risks before they escalate."
                imageSrc="https://images.unsplash.com/photo-1526374965328-7f62d5cf1634?auto=format&fit=crop&w=1000&q=80"
                imageAlt="AI Threat Detection"
            />

            <BentoGrid />

            <RowLayout
                title="Unified Security Command"
                subtitle="Complete Visibility"
                content="Manage your entire security posture from a single intuitive dashboard. Integrate with your existing cloud infrastructure and on-premise servers for a truly unified view of your digital assets."
                imageSrc="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"
                imageAlt="Security Dashboard"
                reverse={true}
            />

            <StatsSection
                title="Proven Track Record"
                stats={[
                    {
                        label: "Threats Blocked",
                        value: "2M+",
                        description: "Monthly average",
                    },
                    {
                        label: "Risk Reduction",
                        value: "68%",
                        description: "After 3 months",
                    },
                    {
                        label: "Detection Time",
                        value: "< 1s",
                        description: "Industry leading",
                    },
                    {
                        label: "Global Uptime",
                        value: "99.99%",
                        description: "SLA Guaranteed",
                    },
                ]}
            />

            <ContentSection
                title="Ready to Secure Your Future?"
                subtitle="Join the Elite"
                content="CyberRisk provides the tools and intelligence needed to navigate the complex security landscape of today. Our platform is built by experts for experts, ensuring your organization stays one step ahead of tomorrow's threats."
            />
        </>
    );
}
