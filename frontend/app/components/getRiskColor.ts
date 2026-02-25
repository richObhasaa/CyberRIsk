export function getRiskLevel(score: number) {
  if (score >= 16) return "Critical";
  if (score >= 10) return "High";
  if (score >= 5) return "Medium";
  return "Low";
}

export function getRiskColor(level: string) {
  switch (level) {
    case "Critical":
      return "bg-red-600";
    case "High":
      return "bg-orange-500";
    case "Medium":
      return "bg-yellow-400";
    default:
      return "bg-green-500";
  }
}