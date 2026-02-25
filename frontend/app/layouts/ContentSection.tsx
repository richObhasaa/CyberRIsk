import React from 'react';

interface ContentSectionProps {
    title?: string;
    subtitle?: string;
    content?: string;
    children?: React.ReactNode;
    className?: string;
    centered?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({
    title,
    subtitle,
    content,
    children,
    className = "",
    centered = true
}) => {
    return (
        <section className={`bg-transparent text-white py-5 !pb-0 px-6 sm:px-12 lg:px-24 ${className}`}>
            <div className={`max-w-4xl mx-auto ${centered ? 'text-center' : ''}`}>
                {subtitle && (
                    <span className="text-[#B19EEF] font-semibold tracking-widest uppercase text-xs mb-4 block">
                        {subtitle}
                    </span>
                )}
                {title && (
                    <h2 className="text-3xl md:text-4xl font-bold mb-10 fade-in tracking-tight">
                        {title}
                    </h2>
                )}
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                    {content || children}
                </div>
            </div>
        </section>
    );
};

export default ContentSection;
