







export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  preferred_theme: string;
  language: string;
  timezone: string;
  notifications_enabled: boolean;
  bio?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: UserProfile;
  session: any;
  access_token: string;
  refresh_token: string;
}





export type SessionType = 'work' | 'break' | 'long_break';

export interface PomodoroSession {
  id: string;
  user_id: string;
  session_type: SessionType;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  completed: boolean;
  task_id?: string;
  notes?: string;
  interrupted: boolean;
  interruption_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionNote {
  id: string;
  session_id: string;
  user_id: string;
  accomplishment?: string;
  distractions?: string;
  next_plan?: string;
  created_at: string;
  updated_at: string;
}





export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  estimated_pomodoros: number;
  completed_pomodoros: number;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  due_date?: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}





export interface DailyPlan {
  id: string;
  user_id: string;
  date: string;
  task_id?: string;
  planned_pomodoros: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}





export interface ProductivityMetric {
  id: string;
  user_id: string;
  date: string;
  pomodoros_completed: number;
  focus_minutes: number;
  break_minutes: number;
  productivity_score: number;
  created_at: string;
  updated_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date?: string;
  created_at: string;
  updated_at: string;
}





export interface UserXP {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  xp_reward: number;
  icon_url?: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}





export type TreeType = 'oak' | 'pine' | 'birch' | 'maple' | 'spruce';

export interface ForestTree {
  id: string;
  user_id: string;
  session_id?: string;
  tree_type: TreeType;
  growth_stage: number;
  is_alive: boolean;
  planted_at: string;
  completed_at?: string;
  created_at: string;
}





export interface MusicPreference {
  id: string;
  user_id: string;
  selected_track: string;
  volume_level: number;
  muted: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimerSettings {
  id: string;
  user_id: string;
  work_duration_minutes: number;
  break_duration_minutes: number;
  long_break_duration_minutes: number;
  sessions_until_long_break: number;
  auto_start_next_session: boolean;
  sound_enabled: boolean;
  notification_enabled: boolean;
  created_at: string;
  updated_at: string;
}





export type AutomationTrigger = 'pomodoro_start' | 'pomodoro_end' | 'session_complete' | 'break_start' | 'break_end';
export type AutomationAction = 'enable_dnd' | 'disable_dnd' | 'pause_music' | 'play_music' | 'send_notification' | 'lock_apps';

export interface AutomationRule {
  id: string;
  user_id: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlockedSite {
  id: string;
  user_id: string;
  url: string;
  created_at: string;
}





export type NotificationType = 'session_end' | 'streak_alert' | 'reminder' | 'achievement' | 'goal_update';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message?: string;
  action_url?: string;
  read: boolean;
  created_at: string;
  read_at?: string;
}





export interface HydrationReminder {
  id: string;
  user_id: string;
  time: string;
  amount_ml: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}





export interface FileUpload {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  bucket: string;
  created_at: string;
}





export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}





export interface DailyStatsResponse {
  date: string;
  pomodoros_completed: number;
  focus_minutes: number;
  break_minutes: number;
  productivity_score: number;
  tasks_completed: number;
  interruptions: number;
}

export interface WeeklyStatsResponse {
  week_start: string;
  week_end: string;
  total_pomodoros: number;
  total_focus_hours: number;
  average_daily_productivity: number;
  best_day: string;
  days: DailyStatsResponse[];
}

export interface ProductivityInsights {
  current_streak: number;
  longest_streak: number;
  average_daily_focus: number;
  most_productive_hour: number;
  recommended_focus_time: string;
  focus_consistency_score: number;
  improvement_suggestions: string[];
}





export interface AIProductivityAnalysis {
  productivity_score: number;
  insights: string[];
  recommendations: string[];
  optimal_focus_schedule: {
    focus_time: string;
    duration_minutes: number;
  }[];
  task_prioritization: {
    task_id: string;
    priority_score: number;
    reason: string;
  }[];
}

export interface TaskEstimation {
  estimated_pomodoros: number;
  confidence_score: number;
  reasoning: string;
  alternative_estimates: {
    optimistic: number;
    pessimistic: number;
  };
}





export interface SessionExportData {
  session_id: string;
  date: string;
  type: SessionType;
  duration_minutes: number;
  task: string;
  completed: boolean;
  notes: string;
}

export interface ExportFormat {
  format: 'csv' | 'json' | 'pdf';
  date_range: {
    start: string;
    end: string;
  };
  include_notes: boolean;
  include_metrics: boolean;
}





export interface WebhookEvent {
  id: string;
  user_id: string;
  event_type: 'session_completed' | 'streak_updated' | 'task_completed' | 'achievement_earned';
  payload: Record<string, any>;
  created_at: string;
}

export interface WebhookSubscription {
  id: string;
  user_id: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
}





export interface CreateSessionRequest {
  session_type: SessionType;
  task_id?: string;
}

export interface UpdateSessionRequest {
  end_time?: string;
  completed?: boolean;
  notes?: string;
  interrupted?: boolean;
  interruption_reason?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  estimated_pomodoros?: number;
  priority?: TaskPriority;
  due_date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimated_pomodoros?: number;
  completed_pomodoros?: number;
}

export interface CreateNotificationRequest {
  type: NotificationType;
  title: string;
  message?: string;
  action_url?: string;
}





export interface ErrorResponse {
  error: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}
