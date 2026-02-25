import React from 'react';

interface TextInputProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    className = "",
}) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            <label className="text-sm font-semibold text-gray-400 ml-1 tracking-wide">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#B19EEF]/50 focus:shadow-[0_0_20px_-5px_rgba(177,158,239,0.2)] transition-all duration-300 glass-card"
            />
        </div>
    );
};

export const PasswordInput: React.FC<TextInputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = "password",
    className = "",
}) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            <label className="text-sm font-semibold text-gray-400 ml-1 tracking-wide">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#B19EEF]/50 focus:shadow-[0_0_20px_-5px_rgba(177,158,239,0.2)] transition-all duration-300 glass-card"
            />
        </div>
    );
};

export const EmailInput: React.FC<TextInputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = "email",
    className = "",
}) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            <label className="text-sm font-semibold text-gray-400 ml-1 tracking-wide">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#B19EEF]/50 focus:shadow-[0_0_20px_-5px_rgba(177,158,239,0.2)] transition-all duration-300 glass-card"
            />
        </div>
    );
};

export const BigTextInput: React.FC<TextInputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    className = "",
}) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            <label className="text-sm font-semibold text-gray-400 ml-1 tracking-wide">
                {label}
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-[200px] bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#B19EEF]/50 focus:shadow-[0_0_20px_-5px_rgba(177,158,239,0.2)] transition-all duration-300 glass-card resize-none"
            />
        </div>
    );
};

interface SelectInputProps {
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
    label,
    options,
    value,
    onChange,
    className = "",
}) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            <label className="text-sm font-semibold text-gray-400 ml-1 tracking-wide">
                {label}
            </label>
            <div className="relative group">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white appearance-none focus:outline-none focus:border-[#B19EEF]/50 focus:shadow-[0_0_20px_-5px_rgba(177,158,239,0.2)] transition-all duration-300 glass-card cursor-pointer"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#020403] text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#B19EEF] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

interface RangeInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    className?: string;
}

export const RangeInput: React.FC<RangeInputProps> = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    className = "",
}) => {
    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

    return (
        <div className={`flex flex-col gap-4 w-full ${className}`}>
            <div className="flex justify-between items-end ml-1">
                <label className="text-sm font-semibold text-gray-400 tracking-wide">
                    {label}
                </label>
                <span className="text-lg font-bold text-[#B19EEF] tabular-nums">
                    {value}
                </span>
            </div>
            <div className="relative flex items-center h-6 group">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer group-hover:bg-white/20 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#B19EEF] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(177,158,239,0.5)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125"
                    style={{
                        background: `linear-gradient(to right, #B19EEF 0%, #B19EEF ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`
                    }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-tighter px-1">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};
