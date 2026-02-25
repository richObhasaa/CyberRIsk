import React from 'react';

interface ListItem {
    title: string;
    description: string;
    icon?: React.ReactNode;
    tag?: string;
}

interface ListLayoutProps {
    title?: string;
    subtitle?: string;
    items: ListItem[];
}

const ListLayout: React.FC<ListLayoutProps> = ({
    title,
    subtitle,
    items,
}) => {
    return (
        <section className="bg-transparent text-white px-6 sm:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                {(title || subtitle) && (
                    <div className="mb-5 space-y-0">
                        {title && (
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent fade-up">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <span className="text-[#B19EEF] font-bold uppercase tracking-widest text-xs fade-in">
                                {subtitle}
                            </span>
                        )}
                    </div>
                )}

                {/* Header row */}
                <div className="grid grid-cols-12 gap-4 py-3 px-4 border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500 font-bold bg-white/[0.1]">
                    <div className="col-span-1">#</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-4">Title</div>
                    <div className="col-span-5">Description</div>
                    <div className="col-span-1 text-right">Tag</div>
                </div>

                {/* List rows */}
                <div className="divide-y divide-white/[0.06] bg-white/[0.05]">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="group grid grid-cols-12 gap-4 items-center px-4 py-4 hover:bg-white/[0.03] transition-all duration-300 fade-up"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            {/* Index */}
                            <div className="col-span-1 text-xs text-gray-600 font-mono group-hover:text-gray-400 transition-colors duration-300">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            {/* Icon */}
                            <div className="col-span-1">
                                {item.icon && (
                                    <div className="p-2 w-fit rounded-xl bg-[#B19EEF]/10 text-[#B19EEF] group-hover:bg-[#B19EEF]/20 transition-colors duration-300">
                                        {item.icon}
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div className="col-span-4">
                                <span className="text-sm font-semibold text-white group-hover:text-[#B19EEF] transition-colors duration-300">
                                    {item.title}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="col-span-5">
                                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                    {item.description}
                                </p>
                            </div>

                            {/* Tag */}
                            <div className="col-span-1 flex justify-end">
                                {item.tag && (
                                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-tighter text-gray-500 whitespace-nowrap">
                                        {item.tag}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer row count */}
                <div className="mt-4 px-4 text-[11px] text-gray-600">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </div>
            </div>
        </section>
    );
};

export default ListLayout;