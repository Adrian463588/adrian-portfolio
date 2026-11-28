export type AvatarMotion =
  | "idle"
  | "greeting"
  | "laughing"
  | "surprised"
  | "confused"
  | "angry"
  | "mischievous";

export interface AvatarExpressionState {
  readonly id: string;
  readonly image: string;
  readonly dialogue: string;
  readonly motion?: AvatarMotion;
}

export const DEFAULT_AVATAR_IMAGE = "/images/avatar/about/default.webp";
export const AVATAR_VIDEO_URL = "https://youtu.be/dQw4w9WgXcQ";
export const AVATAR_IDLE_RESET_MS = 30_000;

export const AVATAR_WINK_STATE: AvatarExpressionState = {
  id: "winking",
  image: "/images/avatar/about/winking.webp",
  dialogue: "Hey, you!",
  motion: "greeting",
};

export const AVATAR_EXPRESSION_STATES: readonly AvatarExpressionState[] = [
  { id: "default", image: DEFAULT_AVATAR_IMAGE, dialogue: "", motion: "idle" },
  { id: "greeting", image: "/images/avatar/about/greeting.webp", dialogue: "Hi there!", motion: "greeting" },
  { id: "happy", image: "/images/avatar/about/happy.webp", dialogue: "Nice to meet you!" },
  { id: "laughing", image: "/images/avatar/about/laughing.webp", dialogue: "Haha, that tickles!", motion: "laughing" },
  { id: "surprised", image: "/images/avatar/about/surprised.webp", dialogue: "Wait... again?", motion: "surprised" },
  { id: "confused", image: "/images/avatar/about/confused.webp", dialogue: "Hey! I'm working!", motion: "confused" },
  { id: "angry", image: "/images/avatar/about/angry.webp", dialogue: "Stop poking me!", motion: "angry" },
  { id: "mischievous", image: "/images/avatar/about/mischievous.webp", dialogue: "Fine. I have a surprise for you.", motion: "mischievous" },
  { id: "rickroll", image: "/images/avatar/about/rickroll.webp", dialogue: "You've been Rickrolled!" },
];
