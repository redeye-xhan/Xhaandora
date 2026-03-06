import { NextRequest, NextResponse } from 'next/server';
import { supabase, sessionService, taskService, metricsService } from '@/lib/supabase';
import { validateInput } from '@/lib/validation';
import {
  createSessionSchema,
  createTaskSchema,
  updateTaskSchema,
  timerSettingsSchema,
} from '@/lib/validation';
import { parseError, successResponse, paginatedResponse } from '@/lib/utils';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get authenticated user from request
 */
export const getAuthUser = async (request: NextRequest) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return user;
};

/**
 * Create an error response
 */
export const createErrorResponse = (
  message: string,
  status: number = 400,
  details?: Record<string, any>
) => {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status }
  );
};

// ============================================
// SESSIONS API ROUTES
// ============================================

export async function POST(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/api/sessions')) {
    const user = await getAuthUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    try {
      const body = await request.json();

      // Validate input
      const validation = await validateInput(createSessionSchema, body);
      if (!validation.valid) {
        return createErrorResponse('Invalid input', 400, validation.errors);
      }

      // Create session
      const session = await sessionService.createSession(user.id, validation.data!);

      return NextResponse.json(
        successResponse(session, 'Session created successfully'),
        { status: 201 }
      );
    } catch (error) {
      const err = parseError(error);
      return createErrorResponse(err.error, err.status);
    }
  }
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/api/sessions')) {
    const user = await getAuthUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    try {
      const searchParams = request.nextUrl.searchParams;
      const limit = parseInt(searchParams.get('limit') || '20');
      const offset = parseInt(searchParams.get('offset') || '0');

      const sessionsData = await sessionService.getSessions(user.id, limit, offset);

      return NextResponse.json(
        successResponse(sessionsData, 'Sessions retrieved successfully'),
        { status: 200 }
      );
    } catch (error) {
      const err = parseError(error);
      return createErrorResponse(err.error, err.status);
    }
  }
}

// ============================================
// TASKS API ROUTES
// ============================================

export async function POST_TASKS(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/api/tasks')) {
    const user = await getAuthUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    try {
      const body = await request.json();

      // Validate input
      const validation = await validateInput(createTaskSchema, body);
      if (!validation.valid) {
        return createErrorResponse('Invalid input', 400, validation.errors);
      }

      // Create task
      const task = await taskService.createTask(user.id, validation.data!);

      return NextResponse.json(
        successResponse(task, 'Task created successfully'),
        { status: 201 }
      );
    } catch (error) {
      const err = parseError(error);
      return createErrorResponse(err.error, err.status);
    }
  }
}

export async function GET_TASKS(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/api/tasks')) {
    const user = await getAuthUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    try {
      const searchParams = request.nextUrl.searchParams;
      const status = searchParams.get('status') || undefined;

      const tasks = await taskService.getTasks(user.id, status);

      return NextResponse.json(
        successResponse(tasks, 'Tasks retrieved successfully'),
        { status: 200 }
      );
    } catch (error) {
      const err = parseError(error);
      return createErrorResponse(err.error, err.status);
    }
  }
}

export async function PUT(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/api/tasks')) {
    const user = await getAuthUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    try {
      const taskId = request.nextUrl.searchParams.get('id');
      if (!taskId) {
        return createErrorResponse('Task ID required', 400);
      }

      const body = await request.json();

      // Validate input
      const validation = await validateInput(updateTaskSchema, body);
      if (!validation.valid) {
        return createErrorResponse('Invalid input', 400, validation.errors);
      }

      // Update task
      const task = await taskService.updateTask(taskId, validation.data!);

      return NextResponse.json(
        successResponse(task, 'Task updated successfully'),
        { status: 200 }
      );
    } catch (error) {
      const err = parseError(error);
      return createErrorResponse(err.error, err.status);
    }
  }
}

export async function DELETE(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/api/tasks')) {
    const user = await getAuthUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    try {
      const taskId = request.nextUrl.searchParams.get('id');
      if (!taskId) {
        return createErrorResponse('Task ID required', 400);
      }

      // Delete task
      await taskService.deleteTask(taskId);

      return NextResponse.json(
        successResponse(null, 'Task deleted successfully'),
        { status: 200 }
      );
    } catch (error) {
      const err = parseError(error);
      return createErrorResponse(err.error, err.status);
    }
  }
}

// ============================================
// METRICS API ROUTES
// ============================================

export async function GET_METRICS(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/api/metrics')) {
    const user = await getAuthUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    try {
      const searchParams = request.nextUrl.searchParams;
      const range = searchParams.get('range');

      if (range === 'today') {
        const metrics = await metricsService.getMetricsToday(user.id);
        return NextResponse.json(
          successResponse(metrics, 'Metrics retrieved successfully'),
          { status: 200 }
        );
      }

      if (range === 'week') {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const metrics = await metricsService.getMetricsRange(user.id, startDate, endDate);
        return NextResponse.json(
          successResponse(metrics, 'Weekly metrics retrieved successfully'),
          { status: 200 }
        );
      }

      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      if (!startDate || !endDate) {
        return createErrorResponse('startDate and endDate required', 400);
      }

      const metrics = await metricsService.getMetricsRange(user.id, startDate, endDate);

      return NextResponse.json(
        successResponse(metrics, 'Metrics retrieved successfully'),
        { status: 200 }
      );
    } catch (error) {
      const err = parseError(error);
      return createErrorResponse(err.error, err.status);
    }
  }
}

// ============================================
// HEALTH CHECK API ROUTE
// ============================================

export async function GET_HEALTH(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/api/health')) {
    try {
      const { data, error } = await supabase.from('profiles').select('count');

      if (error) throw error;

      return NextResponse.json(
        {
          status: 'ok',
          message: 'Service is operational',
          timestamp: new Date().toISOString(),
          database: 'connected',
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Service is down',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
        },
        { status: 503 }
      );
    }
  }
}
