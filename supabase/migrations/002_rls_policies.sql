-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can view other public profiles
CREATE POLICY "Users can view public profiles" ON public.profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- POMODORO SESSIONS POLICIES
-- ============================================

-- Users can only view their own sessions
CREATE POLICY "Users can view own sessions" ON public.pomodoro_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create sessions for themselves
CREATE POLICY "Users can create own sessions" ON public.pomodoro_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own sessions
CREATE POLICY "Users can update own sessions" ON public.pomodoro_sessions
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own sessions
CREATE POLICY "Users can delete own sessions" ON public.pomodoro_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TASKS POLICIES
-- ============================================

-- Users can only view their own tasks
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create tasks for themselves
CREATE POLICY "Users can create own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own tasks
CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own tasks
CREATE POLICY "Users can delete own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- SUBTASKS POLICIES
-- ============================================

-- Users can only view their own subtasks
CREATE POLICY "Users can view own subtasks" ON public.subtasks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create their own subtasks
CREATE POLICY "Users can create own subtasks" ON public.subtasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own subtasks
CREATE POLICY "Users can update own subtasks" ON public.subtasks
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own subtasks
CREATE POLICY "Users can delete own subtasks" ON public.subtasks
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- DAILY PLANS POLICIES
-- ============================================

-- Users can only view their own daily plans
CREATE POLICY "Users can view own daily plans" ON public.daily_plans
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create their own daily plans
CREATE POLICY "Users can create own daily plans" ON public.daily_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own daily plans
CREATE POLICY "Users can update own daily plans" ON public.daily_plans
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own daily plans
CREATE POLICY "Users can delete own daily plans" ON public.daily_plans
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- SESSION NOTES POLICIES
-- ============================================

-- Users can only view their own session notes
CREATE POLICY "Users can view own session notes" ON public.session_notes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create their own session notes
CREATE POLICY "Users can create own session notes" ON public.session_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own session notes
CREATE POLICY "Users can update own session notes" ON public.session_notes
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own session notes
CREATE POLICY "Users can delete own session notes" ON public.session_notes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PRODUCTIVITY METRICS POLICIES
-- ============================================

-- Users can only view their own metrics
CREATE POLICY "Users can view own metrics" ON public.productivity_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own metrics
CREATE POLICY "Users can insert own metrics" ON public.productivity_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own metrics
CREATE POLICY "Users can update own metrics" ON public.productivity_metrics
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STREAKS POLICIES
-- ============================================

-- Users can only view their own streak
CREATE POLICY "Users can view own streak" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own streak
CREATE POLICY "Users can update own streak" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can insert their own streak
CREATE POLICY "Users can insert own streak" ON public.streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- USER XP POLICIES
-- ============================================

-- Users can only view their own XP
CREATE POLICY "Users can view own xp" ON public.user_xp
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own XP
CREATE POLICY "Users can update own xp" ON public.user_xp
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can insert their own XP
CREATE POLICY "Users can insert own xp" ON public.user_xp
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ACHIEVEMENTS - READ ONLY
-- ============================================

-- Everyone can view achievements
CREATE POLICY "Everyone can view achievements" ON public.achievements
  FOR SELECT USING (true);

-- ============================================
-- USER ACHIEVEMENTS POLICIES
-- ============================================

-- Users can only view their own achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own achievements (via functions)
CREATE POLICY "Users can insert own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FOREST TREES POLICIES
-- ============================================

-- Users can only view their own trees
CREATE POLICY "Users can view own trees" ON public.forest_trees
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create their own trees
CREATE POLICY "Users can create own trees" ON public.forest_trees
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own trees
CREATE POLICY "Users can update own trees" ON public.forest_trees
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- MUSIC PREFERENCES POLICIES
-- ============================================

-- Users can only view their own preferences
CREATE POLICY "Users can view own music preferences" ON public.music_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own preferences
CREATE POLICY "Users can update own music preferences" ON public.music_preferences
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own music preferences" ON public.music_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- BLOCKED SITES POLICIES
-- ============================================

-- Users can only view their own blocked sites
CREATE POLICY "Users can view own blocked sites" ON public.blocked_sites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create their own blocked sites
CREATE POLICY "Users can create own blocked sites" ON public.blocked_sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own blocked sites
CREATE POLICY "Users can delete own blocked sites" ON public.blocked_sites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- AUTOMATION RULES POLICIES
-- ============================================

-- Users can only view their own rules
CREATE POLICY "Users can view own automation rules" ON public.automation_rules
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create their own rules
CREATE POLICY "Users can create own automation rules" ON public.automation_rules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own rules
CREATE POLICY "Users can update own automation rules" ON public.automation_rules
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own rules
CREATE POLICY "Users can delete own automation rules" ON public.automation_rules
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own notifications
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- HYDRATION REMINDERS POLICIES
-- ============================================

-- Users can only view their own reminders
CREATE POLICY "Users can view own hydration reminders" ON public.hydration_reminders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create their own reminders
CREATE POLICY "Users can create own hydration reminders" ON public.hydration_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own reminders
CREATE POLICY "Users can update own hydration reminders" ON public.hydration_reminders
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own reminders
CREATE POLICY "Users can delete own hydration reminders" ON public.hydration_reminders
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TIMER SETTINGS POLICIES
-- ============================================

-- Users can only view their own settings
CREATE POLICY "Users can view own timer settings" ON public.timer_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own settings
CREATE POLICY "Users can update own timer settings" ON public.timer_settings
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own timer settings" ON public.timer_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FILE UPLOADS POLICIES
-- ============================================

-- Users can only view their own files
CREATE POLICY "Users can view own files" ON public.file_uploads
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own files
CREATE POLICY "Users can insert own files" ON public.file_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own files
CREATE POLICY "Users can delete own files" ON public.file_uploads
  FOR DELETE USING (auth.uid() = user_id);
