import { z } from 'zod';





export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});





export const profileUpdateSchema = z.object({
  username: z.string().min(1).max(100).optional(),
  full_name: z.string().max(255).optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
  timezone: z.string().optional(),
  language: z.enum(['en', 'es', 'fr', 'de', 'ja', 'zh']).optional(),
  preferred_theme: z.string().optional(),
  notifications_enabled: z.boolean().optional(),
});





export const sessionTypeSchema = z.enum(['work', 'break', 'long_break']);

export const createSessionSchema = z.object({
  session_type: sessionTypeSchema,
  task_id: z.string().uuid().optional(),
});

export const updateSessionSchema = z.object({
  completed: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
  interrupted: z.boolean().optional(),
  interruption_reason: z.string().max(500).optional(),
});





export const taskStatusSchema = z.enum([
  'todo',
  'in_progress',
  'completed',
  'archived',
]);

export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title required').max(255),
  description: z.string().max(2000).optional(),
  estimated_pomodoros: z.number().int().min(1).max(100).default(1),
  priority: taskPrioritySchema.default('medium'),
  due_date: z.string().date().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  estimated_pomodoros: z.number().int().min(1).max(100).optional(),
  completed_pomodoros: z.number().int().min(0).optional(),
  due_date: z.string().date().optional(),
});

export const createSubtaskSchema = z.object({
  task_id: z.string().uuid(),
  title: z.string().min(1).max(255),
});





export const metricsQuerySchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
});





export const notificationTypeSchema = z.enum([
  'session_end',
  'streak_alert',
  'reminder',
  'achievement',
  'goal_update',
]);

export const createNotificationSchema = z.object({
  type: notificationTypeSchema,
  title: z.string().min(1).max(255),
  message: z.string().max(1000).optional(),
  action_url: z.string().url().optional(),
});





export const timerSettingsSchema = z.object({
  work_duration_minutes: z.number().int().min(1).max(120).default(25),
  break_duration_minutes: z.number().int().min(1).max(60).default(5),
  long_break_duration_minutes: z.number().int().min(1).max(120).default(15),
  sessions_until_long_break: z.number().int().min(1).max(10).default(4),
  auto_start_next_session: z.boolean().default(false),
  sound_enabled: z.boolean().default(true),
  notification_enabled: z.boolean().default(true),
});

export const musicPreferenceSchema = z.object({
  selected_track: z.string().default('focus_beats'),
  volume_level: z.number().min(0).max(100).default(50),
  muted: z.boolean().default(false),
});





export const automationTriggerSchema = z.enum([
  'pomodoro_start',
  'pomodoro_end',
  'session_complete',
  'break_start',
  'break_end',
]);

export const automationActionSchema = z.enum([
  'enable_dnd',
  'disable_dnd',
  'pause_music',
  'play_music',
  'send_notification',
  'lock_apps',
]);

export const createAutomationRuleSchema = z.object({
  trigger: automationTriggerSchema,
  action: automationActionSchema,
  enabled: z.boolean().default(true),
});





export const exportFormatSchema = z.enum(['csv', 'json', 'pdf']);

export const exportRequestSchema = z.object({
  format: exportFormatSchema.default('csv'),
  startDate: z.string().date(),
  endDate: z.string().date(),
  includeNotes: z.boolean().default(true),
  includeMetrics: z.boolean().default(true),
});





export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  page: z.number().int().min(1).default(1),
});

export const taskFilterSchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDateFrom: z.string().date().optional(),
  dueDateTo: z.string().date().optional(),
});

export const sessionFilterSchema = z.object({
  sessionType: sessionTypeSchema.optional(),
  completedOnly: z.boolean().default(false),
  interruptedOnly: z.boolean().default(false),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});





export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>;
export type TimerSettingsInput = z.infer<typeof timerSettingsSchema>;
export type MusicPreferenceInput = z.infer<typeof musicPreferenceSchema>;
export type CreateAutomationRuleInput = z.infer<typeof createAutomationRuleSchema>;
export type ExportRequest = z.infer<typeof exportRequestSchema>;
export type TaskFilter = z.infer<typeof taskFilterSchema>;
export type SessionFilter = z.infer<typeof sessionFilterSchema>;





export const validateInput = async <T>(schema: z.Schema, data: unknown): Promise<{ valid: boolean; data?: T; errors?: Record<string, string> }> => {
  try {
    const validated = await schema.parseAsync(data);
    return { valid: true, data: validated as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: { _global: 'Validation failed' } };
  }
};
