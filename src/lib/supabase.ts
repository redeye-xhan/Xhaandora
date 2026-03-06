import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type {
  PomodoroSession,
  Task,
  UserProfile,
  ProductivityMetric,
  Notification,
  CreateSessionRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiResponse,
  PaginatedResponse,
} from './types'





const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

let supabaseInstance: SupabaseClient | null = null

const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    } catch (e) {
      console.error('Supabase initialization error:', e)
      throw new Error('Failed to initialize Supabase client')
    }
  }
  return supabaseInstance
}

export let supabase: SupabaseClient

try {
  supabase = getSupabaseClient()
} catch (e) {
  console.warn('Supabase not fully initialized - will retry at runtime')
  
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}





export const authService = {
  async signUp(email: string, password: string, username?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username || email.split('@')[0] },
      },
    })
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  },

  async signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
    })
    if (error) throw error
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getSession()
    return data.session?.user ?? null
  },
}





export const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)

    await this.updateProfile(userId, { avatar_url: data.publicUrl })
    return data.publicUrl
  },
}





export const sessionService = {
  async createSession(
    userId: string,
    request: CreateSessionRequest
  ): Promise<PomodoroSession> {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .insert([
        {
          user_id: userId,
          session_type: request.session_type,
          task_id: request.task_id,
          start_time: new Date().toISOString(),
          completed: false,
          interrupted: false,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async completeSession(
    sessionId: string,
    notes?: string
  ): Promise<PomodoroSession> {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .update({
        end_time: new Date().toISOString(),
        completed: true,
        notes,
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getSessionsToday(userId: string): Promise<PomodoroSession[]> {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', `${today}T00:00:00`)
      .lte('start_time', `${today}T23:59:59`)
      .order('start_time', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getSessions(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<PaginatedResponse<PomodoroSession>> {
    const { data, error, count } = await supabase
      .from('pomodoro_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      data: data || [],
      total: count || 0,
      page: Math.floor(offset / limit) + 1,
      limit,
      pages: Math.ceil((count || 0) / limit),
    }
  },

  async getSessionStats(userId: string, days: number = 7) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString())
      .eq('completed', true)

    if (error) throw error

    const sessions = data || []
    const totalSessions = sessions.length
    const focusSessions = sessions.filter((s: any) => s.session_type === 'work').length
    const totalMinutes = sessions.reduce((acc: number, s: any) => acc + (s.duration_seconds || 0) / 60, 0)

    return {
      totalSessions,
      focusSessions,
      totalMinutes,
      averageFocusPerSession: totalSessions > 0 ? totalMinutes / totalSessions : 0,
    }
  },
}





export const taskService = {
  async createTask(userId: string, request: CreateTaskRequest): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: userId,
          title: request.title,
          description: request.description,
          estimated_pomodoros: request.estimated_pomodoros || 1,
          completed_pomodoros: 0,
          status: 'todo',
          priority: request.priority || 'medium',
          due_date: request.due_date,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTask(taskId: string, updates: UpdateTaskRequest): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        ...(updates.status === 'completed' && { completed_at: new Date().toISOString() }),
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async completeTask(taskId: string): Promise<Task> {
    return this.updateTask(taskId, {
      status: 'completed',
    })
  },

  async getTasks(userId: string, status?: string): Promise<Task[]> {
    let query = supabase.from('tasks').select('*').eq('user_id', userId)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getTodaysTasks(userId: string): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .gte('due_date', today)
      .lte('due_date', today)
      .neq('status', 'archived')

    if (error) throw error
    return data || []
  },

  async deleteTask(taskId: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)

    if (error) throw error
  },
}





export const metricsService = {
  async getMetricsToday(userId: string): Promise<ProductivityMetric | null> {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('productivity_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (error && error.code !== 'PGRST116') {
      
      console.error('Error fetching metrics:', error)
    }

    return data || null
  },

  async getMetricsRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<ProductivityMetric[]> {
    const { data, error } = await supabase
      .from('productivity_metrics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
  },

  async updateMetrics(userId: string, metrics: Partial<ProductivityMetric>) {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('productivity_metrics')
      .upsert(
        {
          user_id: userId,
          date: today,
          ...metrics,
        },
        { onConflict: 'user_id,date' }
      )
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getStreakInfo(userId: string) {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data || { current_streak: 0, longest_streak: 0 }
  },
}





export const notificationService = {
  async getNotifications(userId: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  async createNotification(
    userId: string,
    notification: Omit<Notification, 'id' | 'read' | 'created_at' | 'read_at'>
  ) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          ...notification,
          read: false,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteNotification(notificationId: string) {
    const { error } = await supabase.from('notifications').delete().eq('id', notificationId)

    if (error) throw error
  },
}





export const settingsService = {
  async getTimerSettings(userId: string) {
    const { data, error } = await supabase
      .from('timer_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return (
      data || {
        work_duration_minutes: 25,
        break_duration_minutes: 5,
        long_break_duration_minutes: 15,
        sessions_until_long_break: 4,
        auto_start_next_session: false,
        sound_enabled: true,
        notification_enabled: true,
      }
    )
  },

  async updateTimerSettings(userId: string, settings: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('timer_settings')
      .upsert(
        {
          user_id: userId,
          ...settings,
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) throw error
    return data
  },
}





export const handleSupabaseError = (error: unknown): string => {
  console.error('Supabase error:', error)

  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>
    if (err.code === 'PGRST116') {
      return 'No data found'
    }

    if (err.status === 401) {
      return 'Authentication failed. Please log in.'
    }

    if (err.status === 403) {
      return 'Permission denied. You do not have access to this resource.'
    }

    if (typeof err.message === 'string' && err.message.includes('duplicate')) {
      return 'This item already exists.'
    }

    if (typeof err.message === 'string') {
      return err.message
    }
  }

  return 'An unexpected error occurred. Please try again.'
}
