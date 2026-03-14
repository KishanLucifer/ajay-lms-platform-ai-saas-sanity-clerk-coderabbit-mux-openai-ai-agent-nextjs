export const TIER_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "ultra", label: "Ultra" },
] as const;

export type Tier = (typeof TIER_OPTIONS)[number]["value"];

type TierColor = "emerald" | "violet" | "cyan";

const TIER_COLOR_MAP: Record<TierColor, { border: string; text: string }> = {
  emerald: {
    border: "border-green-400/20",
    text: "text-green-300",
  },
  violet: {
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
  cyan: {
    border: "border-cyan-400/20",
    text: "text-cyan-300",
  },
};

export function getTierColorClasses(color: TierColor) {
  return TIER_COLOR_MAP[color];
}

// Tier styling constants for UI components
export const TIER_STYLES: Record<
  Tier,
  {
    gradient: string;
    border: string;
    text: string;
    badge: string;
  }
> = {
  free: {
    gradient: "from-lime-400 to-green-500",
    border: "border-cyan-400/30",
    text: "text-cyan-300",
    badge: "bg-cyan-400/90 text-white",
  },
  pro: {
    gradient: "from-emerald-400 to-teal-600",
    border: "border-blue-500/30",
    text: "text-blue-400",
    badge: "bg-blue-500/90 text-white",
  },
  ultra: {
    gradient: "from-green-400 to-emerald-600",
    border: "border-green-400/30",
    text: "text-green-300",
    badge: "bg-green-400/90 text-white",
  },
};

export const TIER_FEATURES = [
  {
    tier: "Free",
    color: "emerald",
    features: [
      "Access to foundational courses",
      "Community Discord access",
      "Basic projects & exercises",
      "Email support",
    ],
  },
  {
    tier: "Pro",
    color: "violet",
    features: [
      "Everything in Free",
      "All Pro-tier courses",
      "Advanced real-world projects",
      "Priority support",
      "Course completion certificates",
    ],
  },
  {
    tier: "Ultra",
    color: "cyan",
    features: [
      "Everything in Pro",
      "AI Learning Assistant",
      "Exclusive Ultra-only content",
      "Monthly 1-on-1 sessions",
      "Private Discord channel",
      "Early access to new courses",
      "Lifetime updates",
    ],
  },
] as const;
