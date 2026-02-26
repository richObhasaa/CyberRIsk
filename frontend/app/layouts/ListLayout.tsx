"use client";

import { useState } from 'react';

interface ListItem {
    title: string;
    description: string;
    icon?: React.ReactNode;
    tag?: string;
    actionButton?: React.ReactNode;
}

interface ListLayoutProps {
    title?: string;
    subtitle?: string;
    items: ListItem[];
    pageSize?: number;
}

const ListLayout: React.FC<ListLayoutProps> = ({
    title,
    subtitle,
    items,
    pageSize = 10,
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    const goTo = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Generate page number buttons — show max 5 around current
    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    return (
        <section className="bg-transparent text-white px-6 sm:px-12 lg:px-24 fade-in">
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
                <div className="grid grid-cols-15 gap-4 py-3 px-4 border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500 font-bold bg-white/[0.1]">
                    <div className="col-span-1">#</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-3">Title</div>
                    <div className="col-span-3">Description</div>
                    <div className="col-span-1 text-center">Tag</div>
                    <div className="col-end-15 text-center">Action</div>
                </div>

                {/* List rows */}
                <div className="divide-y divide-white/[0.06] bg-white/[0.05]">
                    {paginatedItems.map((item, index) => (
                        <div
                            key={startIndex + index}
                            className="group grid grid-cols-15 gap-4 items-center px-4 py-4 hover:bg-white/[0.03] transition-all duration-300 fade-up"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            {/* Index — shows global number */}
                            <div className="col-span-1 text-xs text-gray-600 font-mono group-hover:text-gray-400 transition-colors duration-300">
                                {String(startIndex + index + 1).padStart(2, '0')}
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
                            <div className="col-span-3">
                                <span className="text-sm font-semibold text-white group-hover:text-[#B19EEF] transition-colors duration-300">
                                    {item.title}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="col-span-3">
                                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                    {item.description}
                                </p>
                            </div>

                            {/* Tag */}
                            {item.tag && (
                                <div className="col-span-1 flex justify-center">
                                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-tighter text-gray-500 whitespace-nowrap">
                                        {item.tag}
                                    </span>
                                </div>
                            )}

                            {/* Action Button */}
                            {item.actionButton && (
                                <div className="col-end-15 flex justify-center">
                                    <div className="duration-300">
                                        {item.actionButton}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-4 px-4 flex items-center justify-between">
                    <span className="text-[11px] text-gray-600">
                        {startIndex + 1}–{Math.min(startIndex + pageSize, items.length)} of {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            {/* Prev */}
                            <button
                                onClick={() => goTo(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                ←
                            </button>

                            {/* Page numbers */}
                            {getPageNumbers().map((page, i) =>
                                page === "..." ? (
                                    <span key={`ellipsis-${i}`} className="px-2 text-xs text-gray-600">...</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => goTo(page as number)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${currentPage === page
                                            ? "bg-[#B19EEF] border-[#B19EEF] text-white"
                                            : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            {/* Next */}
                            <button
                                onClick={() => goTo(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ListLayout;