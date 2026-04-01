// src/components/ui/Spinner.tsx
export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "currentColor",
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
        flexShrink: 0,
      }}
      role="status"
      aria-label="Loading"
    />
  );
}
