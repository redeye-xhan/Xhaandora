



import type { ApiResponse, PaginatedResponse, ErrorResponse } from './types';


export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map((val) => String(val).padStart(2, '0'))
    .join(':');
};


export const formatMinutesToReadable = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
};


export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};


export const calculateProductivityScore = (
  sessionsCompleted: number,
  focusMinutes: number,
  tasksCompleted: number = 0,
  interruptions: number = 0
): number => {
  
  let score = Math.min(sessionsCompleted * 10, 100);

  
  const focusBonus = Math.min(Math.floor(focusMinutes / 15), 50);
  score += focusBonus;

  
  const taskBonus = Math.min(tasksCompleted * 5, 50);
  score += taskBonus;

  
  const interruptionPenalty = Math.max(interruptions * 5, 0);
  score -= interruptionPenalty;

  
  return Math.max(0, Math.min(100, Math.round(score)));
};


export const generateProductivityInsight = (
  score: number,
  streak: number,
  focusMinutes: number
): string => {
  if (score >= 90) {
    return `🔥 Exceptional focus! You're on a ${streak}-day streak with ${focusMinutes} minutes of focus.`;
  }

  if (score >= 75) {
    return `💪 Great performance! Keep up the momentum — you're ${streak} days into your streak.`;
  }

  if (score >= 50) {
    return `📈 Making progress! Total focus time today: ${focusMinutes} minutes.`;
  }

  if (score >= 25) {
    return `⏰ Getting started. Try one more session to boost your productivity score.`;
  }

  return `💡 Remember to take a break! You've earned some rest after your sessions.`;
};


export const calculateOptimalFocusTime = (
  pastSessions: Array<{ hour: number; productivity_score: number }>
): number => {
  if (pastSessions.length === 0) {
    return 14; 
  }

  
  const hourlyScores = new Map<number, number[]>();

  pastSessions.forEach((session) => {
    const scores = hourlyScores.get(session.hour) || [];
    scores.push(session.productivity_score);
    hourlyScores.set(session.hour, scores);
  });

  
  let bestHour = 14;
  let bestScore = 0;

  hourlyScores.forEach((scores, hour) => {
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avgScore > bestScore) {
      bestScore = avgScore;
      bestHour = hour;
    }
  });

  return bestHour;
};


export const shouldStreetContinue = (lastActiveDate: string): boolean => {
  const lastDate = new Date(lastActiveDate);
  const today = new Date();

  
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  
  return diffDays <= 2;
};


export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


export const formatTime = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};


export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
};


export const successResponse = <T>(
  data: T,
  message: string = 'Success'
): ApiResponse<T> => ({
  success: true,
  data,
  message,
});


export const errorResponse = (
  error: string,
  message: string = 'An error occurred'
): ApiResponse<null> => ({
  success: false,
  error,
  message,
});


export const paginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => ({
  data,
  total,
  page,
  limit,
  pages: Math.ceil(total / limit),
});


export const parseError = (error: unknown): ErrorResponse => {
  const now = new Date();

  if (error instanceof Error) {
    return {
      error: error.message,
      code: 'UNKNOWN_ERROR',
      status: 500,
    };
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, any>;

    if (err.code && err.message) {
      return {
        error: err.message,
        code: err.code,
        status: err.status || 500,
        details: err.details,
      };
    }

    if (err.error) {
      return {
        error: err.error,
        code: err.code || 'UNKNOWN_ERROR',
        status: err.status || 500,
      };
    }
  }

  return {
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500,
  };
};


export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelay: number = 100
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};


export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
};


export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};


export const isOnline = (): boolean => {
  return typeof window !== 'undefined' && navigator.onLine;
};


export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};


export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};


export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};


export const isValidUUID = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};


export const batchAsync = async <T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }

  return results;
};
