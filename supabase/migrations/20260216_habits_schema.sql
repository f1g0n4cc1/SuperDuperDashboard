-- Create Habits Table
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  frequency TEXT DEFAULT 'daily',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Habit Logs (Daily Completions)
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES public.habits ON DELETE CASCADE NOT NULL,
  completed_at DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, completed_at)
);

-- Enable RLS
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access their own habit logs" 
ON public.habit_logs FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.habits 
    WHERE habits.id = habit_logs.habit_id 
    AND habits.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own habit logs" 
ON public.habit_logs FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.habits 
    WHERE habits.id = habit_id 
    AND habits.user_id = auth.uid()
  )
);
