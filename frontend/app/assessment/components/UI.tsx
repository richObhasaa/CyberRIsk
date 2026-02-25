export function Container({ children }: any) {
  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "auto", color: "white" }}>
      {children}
    </div>
  );
}

export function Button({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        margin: "10px 10px 10px 0",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function Input(props: any) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: 10,
        marginTop: 5,
        marginBottom: 15,
        borderRadius: 6,
        border: "1px solid #444",
        background: "#111",
        color: "white",
      }}
    />
  );
}

export function Slider({ label, value, onChange }: any) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label>{label}: {value}</label>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}