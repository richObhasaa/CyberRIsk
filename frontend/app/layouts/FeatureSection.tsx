import React, { useRef } from 'react';

interface Feature {
    title?: string;
    description: string;
    icon?: React.ReactNode;
}

interface FeatureSectionProps {
    title?: string;
    subtitle?: string;
    features: Feature[];
}

const CardItem = ({ feature }: { feature: Feature }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.setProperty('--mouse-x', `50%`);
        card.style.setProperty('--mouse-y', `50%`);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group flex-1 hover:md:flex-[3] border border-white/10 rounded-4xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out relative overflow-hidden h-[200px] hover:border-[#B19EEF]/30 hover:shadow-[0_0_30px_-5px_rgba(177,158,239,0.2)]"
        >
            {/* Dynamic gradient layer */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(177,158,239,0.13) 0%, rgba(177,158,239,0.05) 40%, transparent 70%)`,
                }}
            />

            {/* Left accent line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] bg-gradient-to-b from-transparent via-[#B19EEF] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Default / sibling state: big icon centered, title below */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full group-hover:hidden p-6">
                <div className="
                    mb-3 group-hover/parent:mb-0
                    w-12 h-12 group-hover/parent:w-20 group-hover/parent:h-20
                    rounded-xl bg-white/[0.03] border border-white/10
                    flex items-center justify-center
                    transition-all duration-300 shrink-0
                    [&>svg]:w-6 [&>svg]:h-6 [&>*]:w-6 [&>*]:h-6
                    group-hover/parent:[&>svg]:w-10 group-hover/parent:[&>svg]:h-10
                    group-hover/parent:[&>*]:w-10 group-hover/parent:[&>*]:h-10
                ">
                    {feature.icon || (
                        <div className="w-6 h-6 group-hover/parent:w-10 group-hover/parent:h-10 rounded-full bg-[#B19EEF]/20 border border-[#B19EEF] transition-all duration-300" />
                    )}
                </div>
                <h3 className="
                    text-xl font-semibold text-center
                    transition-all duration-300
                    group-hover/parent:opacity-0 group-hover/parent:h-0 group-hover/parent:mb-0 group-hover/parent:overflow-hidden
                ">
                    {feature.title}
                </h3>
            </div>

            {/* Hovered state: two-column grid */}
            <div className="relative z-10 hidden group-hover:grid grid-cols-[auto_1fr] gap-x-5 items-center w-full h-full px-6">
                {/* Left: icon */}
                <div className="
                    w-14 h-14 rounded-xl bg-white/[0.03] border border-[#B19EEF]/50
                    flex items-center justify-center shrink-0
                    shadow-[0_0_20px_-4px_rgba(177,158,239,0.35)]
                    [&>svg]:w-7 [&>svg]:h-7 [&>*]:w-7 [&>*]:h-7
                ">
                    {feature.icon || (
                        <div className="w-7 h-7 rounded-full bg-[#B19EEF]/20 border border-[#B19EEF]" />
                    )}
                </div>

                {/* Right: title + description stacked */}
                <div className="flex flex-col justify-center gap-1 min-w-0 overflow-hidden">
                    <h3 className="text-base font-bold text-[#B19EEF] leading-tight truncate">
                        {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm line-clamp-3">
                        {feature.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FeatureSection: React.FC<FeatureSectionProps> = ({ features }) => {
    return (
        <section className="bg-black text-white mt-0 py-6 px-6 sm:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6 h-max min-h-[200px] group/parent">
                    {features.map((feature, index) => (
                        <CardItem key={index} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;