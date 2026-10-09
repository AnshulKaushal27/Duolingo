export interface UserProfile {
  id: number;
  username: string;
  email: string;
  display_name: string;
  avatar_url: string;
  streak: number;
  hearts: number;
  max_hearts: number;
  gems: number;
  total_xp: number;
  last_active_date: string;
}

export interface SkillStatus {
  id: number;
  unit_id: number;
  order_index: number;
  title: string;
  icon_name: string;
  total_crowns: number;
  completed_lessons: number;
  total_lessons: number;
  status: "locked" | "available" | "completed" | "mastered";
  crowns_earned: number;
  next_lesson_id: number | null;
}

export interface UnitWithSkills {
  id: number;
  course_id: number;
  unit_number: number;
  title: string;
  description: string;
  color_hex: string;
  skills: SkillStatus[];
}

export interface CourseTree {
  id: number;
  code: string;
  title: string;
  flag_icon: string;
  description: string;
  units: UnitWithSkills[];
}

export interface ExerciseClient {
  id: number;
  lesson_id: number;
  order_index: number;
  type: "multiple_choice" | "translate_word_bank" | "match_pairs" | "fill_in_the_blank" | "type_the_answer";
  prompt: string;
  question_text: string;
  audio_text?: string;
  client_payload: any;
}

export interface LessonStartData {
  attempt_id: string;
  lesson_id: number;
  lesson_title: string;
  skill_id: number;
  skill_title: string;
  xp_reward: number;
  total_exercises: number;
  exercises: ExerciseClient[];
}

export interface ExerciseSubmitResult {
  exercise_id: number;
  is_correct: boolean;
  correct_solution: string;
  hearts_remaining: number;
  hearts_deducted: number;
  is_duplicate: boolean;
  explanation?: string;
}

export interface LessonCompleteResult {
  success: boolean;
  xp_earned: number;
  total_xp: number;
  streak: number;
  streak_extended: boolean;
  hearts_remaining: number;
  lesson_id: number;
  skill_completed: boolean;
  next_skill_unlocked_id: number | null;
  accuracy_percentage: number;
}

export interface LeaderboardUser {
  id: number;
  rank: number;
  display_name: string;
  username: string;
  avatar_url: string;
  weekly_xp: number;
  is_current_user: boolean;
}

export interface LeaderboardData {
  league: string;
  time_remaining: string;
  entries: LeaderboardUser[];
}

export interface QuestItem {
  id: number;
  title: string;
  current_progress: number;
  target_progress: number;
  reward_gems: number;
  completed: boolean;
}

export interface AchievementItem {
  id: number;
  code: string;
  title: string;
  description: string;
  icon: string;
  target_value: number;
  current_value: number;
  unlocked: boolean;
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    // Dynamically match the current browser hostname (localhost -> localhost:8000, 127.0.0.1 -> 127.0.0.1:8000)
    // This ensures same-site cookie exchange so browsers never block SameSite=lax cookies on subresource fetch calls.
    return `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;
  }
  return "http://127.0.0.1:8000/api/v1";
}

// Fetch helper with error handling
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${url}`, {
    credentials: "include", // Ensure duo_session HTTP-only cookie is passed
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const errData = await res.json();
      if (errData && errData.detail) {
        message = typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail);
      }
    } catch {
      const raw = await res.text().catch(() => "");
      if (raw) message = raw;
    }
    const error = new Error(message) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export interface GuidebookData {
  unit_number: number;
  title: string;
  description: string;
  color_hex: string;
  key_phrases: Array<{
    phrase: string;
    translation: string;
    pronunciation?: string;
  }>;
  grammar_tips: Array<{
    title: string;
    explanation: string;
    examples: Array<{ es: string; en: string }>;
  }>;
}

export const api = {
  // Authentication & Session
  signup: (data: { name: string; email: string; username: string; password: string }) =>
    fetchJson<UserProfile>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { identifier: string; password: string }) =>
    fetchJson<UserProfile>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetchJson<{ success: boolean; message: string }>("/auth/logout", {
      method: "POST",
    }),

  getMe: () =>
    fetchJson<UserProfile>("/auth/me"),

  socialLogin: (provider: "google" | "facebook") =>
    fetchJson<UserProfile>("/auth/social-login", {
      method: "POST",
      body: JSON.stringify({ provider }),
    }),

  forgotPassword: (email: string) =>
    fetchJson<{ success: boolean; message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // Course Tree & Profile
  getCourseTree: (code: string = "es") => fetchJson<CourseTree>(`/courses/${code}/tree`),
  getUserProfile: () => fetchJson<UserProfile>("/user/profile"),
  refillHearts: () => fetchJson<{ success: boolean; hearts: number; gems: number; message: string }>("/user/hearts/refill", { method: "POST" }),
  practiceHeart: () => fetchJson<{ success: boolean; hearts: number; gems: number; message: string }>("/user/hearts/practice", { method: "POST" }),
  getGuidebook: (unitId: number) => fetchJson<GuidebookData>(`/courses/units/${unitId}/guidebook`),
  jumpAhead: (unitId: number) => fetchJson<{ success: boolean; message: string }>(`/courses/units/${unitId}/jump-ahead`, { method: "POST" }),
  claimChest: () => fetchJson<{ success: boolean; gems: number; reward: number }>("/user/chest/claim", { method: "POST" }),

  // Lessons
  startLesson: (lessonId: number) =>
    fetchJson<LessonStartData>(`/lessons/${lessonId}/start`, { method: "POST" }),

  submitExercise: (lessonId: number, exerciseId: number, attemptId: string, answer: any) =>
    fetchJson<ExerciseSubmitResult>(`/lessons/${lessonId}/exercises/${exerciseId}/submit`, {
      method: "POST",
      body: JSON.stringify({ attempt_id: attemptId, submitted_answer: answer }),
    }),

  completeLesson: (lessonId: number, attemptId: string) =>
    fetchJson<LessonCompleteResult>(`/lessons/${lessonId}/complete`, {
      method: "POST",
      body: JSON.stringify({ attempt_id: attemptId }),
    }),

  // Gamification
  getLeaderboard: () => fetchJson<LeaderboardData>("/leaderboard"),
  getQuests: () => fetchJson<QuestItem[]>("/quests"),
  getAchievements: () => fetchJson<AchievementItem[]>("/achievements"),
};
