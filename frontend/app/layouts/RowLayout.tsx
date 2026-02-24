import React from 'react';

interface RowLayoutProps {
    title: string;
    subtitle?: string;
    content: string;
    imageSrc: string;
    imageAlt: string;
    reverse?: boolean;
}

const RowLayout: React.FC<RowLayoutProps> = ({
    title,
    subtitle,
    content,
    imageSrc,
    imageAlt,
    reverse = false,
}) => {
    return (
        <section className="bg-black text-white py-20 px-6 sm:px-12 lg:px-24">
            <div className={`max-w-7xl mx-auto flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                {/* Text Content */}
                <div className="flex-1 space-y-6 fade-in">
                    {subtitle && (
                        <span className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">
                            {subtitle}
                        </span>
                    )}
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {title}
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        {content}
                    </p>
                    <div className="pt-4">
                        <button className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Image Container */}
                <div className="flex-1 w-full">
                    <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-2xl border border-white/10 glass-card">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className="object-cover w-full h-full opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RowLayout;
