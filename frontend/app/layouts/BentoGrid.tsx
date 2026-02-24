import React from 'react';

interface BentoItemProps {
    title: string;
    description: string;
    className?: string;
    graphic?: React.ReactNode;
}

const BentoItem: React.FC<BentoItemProps> = ({ title, description, className = "", graphic }) => (
    <div className={`group relative overflow-hidden rounded-3xl border border-white/10 glass-card bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] ${className}`}>
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
            {graphic && <div className="mt-6">{graphic}</div>}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
);

const BentoGrid: React.FC = () => {
    return (
        <section className="bg-black text-white py-20 px-6 sm:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold mb-4">Precision Intelligence</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Leverage state-of-the-art infrastructure designed for modern security and risk management.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-full md:h-[600px]">
                    <BentoItem
                        title="Real-time Monitoring"
                        description="Continuous surveillance of your digital perimeter with sub-second latency."
                        className="md:col-span-2 md:row-span-1"
                        graphic={<div className="h-20 w-full bg-gradient-to-r from-cyan-500/20 to-transparent rounded-lg border border-cyan-500/30" />}
                    />
                    <BentoItem
                        title="AI Analytics"
                        description="Predictive modeling for potential threats."
                        className="md:col-span-1 md:row-span-2"
                    />
                    <BentoItem
                        title="Secure Vault"
                        description="Military-grade encryption for your most sensitive assets."
                        className="md:col-span-1 md:row-span-1"
                    />
                    <BentoItem
                        title="Global Compliance"
                        description="Automatic alignment with regional regulations."
                        className="md:col-span-1 md:row-span-1"
                    />
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
