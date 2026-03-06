import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, authService, handleSupabaseError } from '@/lib/supabase';





export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setError(null);
      } catch (err) {
        setError(handleSupabaseError(err));
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, username?: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signUp(email, password, username);
      return true;
    } catch (err) {
      setError(handleSupabaseError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signIn(email, password);
      return true;
    } catch (err) {
      setError(handleSupabaseError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
      return true;
    } catch (err) {
      setError(handleSupabaseError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInGitHub = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signInWithGitHub();
      return true;
    } catch (err) {
      setError(handleSupabaseError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signOut();
      setUser(null);
      return true;
    } catch (err) {
      setError(handleSupabaseError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email);
      return true;
    } catch (err) {
      setError(handleSupabaseError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInGoogle,
    signInGitHub,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };
};





import { sessionService } from '@/lib/supabase';
import type { PomodoroSession, CreateSessionRequest } from '@/lib/types';

export const useSessions = (userId: string | null) => {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [todaySessions, setTodaySessions] = useState<PomodoroSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sessionService.getSessions(userId);
      setSessions(data.data);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadTodaySessions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sessionService.getSessionsToday(userId);
      setTodaySessions(data);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createSession = useCallback(
    async (request: CreateSessionRequest) => {
      if (!userId) return null;
      setError(null);
      try {
        const session = await sessionService.createSession(userId, request);
        
        setTodaySessions((prev) => [session, ...prev]);
        return session;
      } catch (err) {
        setError(handleSupabaseError(err));
        return null;
      }
    },
    [userId]
  );

  const completeSession = useCallback(
    async (sessionId: string, notes?: string) => {
      setError(null);
      try {
        const updated = await sessionService.completeSession(sessionId, notes);
        
        setTodaySessions((prev) =>
          prev.map((s) => (s.id === sessionId ? updated : s))
        );
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? updated : s))
        );
        return updated;
      } catch (err) {
        setError(handleSupabaseError(err));
        return null;
      }
    },
    []
  );

  const getStatsToday = useCallback(async () => {
    if (!userId) return null;
    setError(null);
    try {
      return await sessionService.getSessionStats(userId, 1);
    } catch (err) {
      setError(handleSupabaseError(err));
      return null;
    }
  }, [userId]);

  useEffect(() => {
    loadTodaySessions();
  }, [loadTodaySessions]);

  return {
    sessions,
    todaySessions,
    loading,
    error,
    loadSessions,
    loadTodaySessions,
    createSession,
    completeSession,
    getStatsToday,
  };
};





import { taskService } from '@/lib/supabase';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/lib/types';

export const useTasks = (userId: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async (status?: string) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(userId, status);
      setTasks(data);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadTodaysTasks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTodaysTasks(userId);
      setTodaysTasks(data);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createTask = useCallback(
    async (request: CreateTaskRequest) => {
      if (!userId) return null;
      setError(null);
      try {
        const task = await taskService.createTask(userId, request);
        setTasks((prev) => [task, ...prev]);
        return task;
      } catch (err) {
        setError(handleSupabaseError(err));
        return null;
      }
    },
    [userId]
  );

  const updateTask = useCallback(
    async (taskId: string, updates: UpdateTaskRequest) => {
      setError(null);
      try {
        const updated = await taskService.updateTask(taskId, updates);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        setTodaysTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        return updated;
      } catch (err) {
        setError(handleSupabaseError(err));
        return null;
      }
    },
    []
  );

  const completeTask = useCallback(
    async (taskId: string) => {
      return updateTask(taskId, { status: 'completed' });
    },
    [updateTask]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      setError(null);
      try {
        await taskService.deleteTask(taskId);
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setTodaysTasks((prev) => prev.filter((t) => t.id !== taskId));
        return true;
      } catch (err) {
        setError(handleSupabaseError(err));
        return false;
      }
    },
    []
  );

  useEffect(() => {
    loadTasks();
    loadTodaysTasks();
  }, [loadTasks, loadTodaysTasks]);

  return {
    tasks,
    todaysTasks,
    loading,
    error,
    loadTasks,
    loadTodaysTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
  };
};





import { metricsService } from '@/lib/supabase';
import type { ProductivityMetric } from '@/lib/types';

export const useMetrics = (userId: string | null) => {
  const [todayMetrics, setTodayMetrics] = useState<ProductivityMetric | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodayMetrics = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const metrics = await metricsService.getMetricsToday(userId);
      setTodayMetrics(metrics);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getMetricsRange = useCallback(
    async (startDate: string, endDate: string) => {
      if (!userId) return [];
      setError(null);
      try {
        return await metricsService.getMetricsRange(userId, startDate, endDate);
      } catch (err) {
        setError(handleSupabaseError(err));
        return [];
      }
    },
    [userId]
  );

  const getStreakInfo = useCallback(async () => {
    if (!userId) return null;
    setError(null);
    try {
      return await metricsService.getStreakInfo(userId);
    } catch (err) {
      setError(handleSupabaseError(err));
      return null;
    }
  }, [userId]);

  useEffect(() => {
    loadTodayMetrics();
  }, [loadTodayMetrics]);

  return {
    todayMetrics,
    loading,
    error,
    loadTodayMetrics,
    getMetricsRange,
    getStreakInfo,
  };
};





import { profileService } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types';

export const useProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile(userId);
      setProfile(data);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!userId) return null;
      setError(null);
      try {
        const updated = await profileService.updateProfile(userId, updates);
        setProfile(updated);
        return updated;
      } catch (err) {
        setError(handleSupabaseError(err));
        return null;
      }
    },
    [userId]
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!userId) return null;
      setError(null);
      try {
        return await profileService.uploadAvatar(userId, file);
      } catch (err) {
        setError(handleSupabaseError(err));
        return null;
      }
    },
    [userId]
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    uploadAvatar,
  };
};
