import React from 'react';

interface StatItem {
    label: string;
    value: string;
    description?: string;
}

interface StatsSectionProps {
    title?: string;
    stats: StatItem[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ title, stats }) => {
    return (
        <section className="bg-black text-white py-20 px-6 sm:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                {title && (
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 fade-in">
                        {title}
                    </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-8 rounded-2xl glass-card border border-white/5 bg-white/[0.02] text-center transition-transform hover:scale-105"
                        >
                            <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-2">
                                {stat.value}
                            </span>
                            <span className="text-cyan-400 font-medium uppercase tracking-widest text-xs mb-3">
                                {stat.label}
                            </span>
                            {stat.description && (
                                <p className="text-gray-500 text-sm">
                                    {stat.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
