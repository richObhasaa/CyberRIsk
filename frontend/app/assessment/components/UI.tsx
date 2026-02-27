export function Container({ children }: any) {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 md:px-20 py-16 text-white">
      <div className="bg-black/30 border border-white/10 rounded-2xl p-10 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}

export function Button({ children, onClick, className = "", ...props }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-2xl font-semibold
        bg-white text-black
        border border-transparent
        hover:bg-transparent hover:text-white hover:border-white/50
        transition-all duration-300
        active:scale-95
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className = "", ...props }: any) {
  return (
    <input
      {...props}
      className={`
        w-full px-4 py-3 rounded-xl
        bg-[#111] border border-white/20
        text-white placeholder-white/40
        focus:outline-none focus:border-[#B19EEF]
        transition-all duration-300
        ${className}
      `}
    />
  );
}

export function Slider({ label, value, onChange }: any) {
  return (
    <div className="mb-8">
      <label className="block mb-2 text-white/70">
        {label}: <span className="text-white font-semibold">{value}</span>
      </label>

      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#B19EEF] cursor-pointer"
      />
    </div>
  );
}