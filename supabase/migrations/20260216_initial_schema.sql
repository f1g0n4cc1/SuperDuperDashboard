-- 1. Create Profiles Table (1:1 with Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY DEFAULT auth.uid(),
  full_name TEXT,
  avatar_url TEXT,
  theme_pref TEXT DEFAULT 'batcave',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create User Settings (JSONB for Widget Layout)
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY DEFAULT auth.uid(),
  dashboard_layout JSONB DEFAULT '{"widgets": [], "order": []}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'todo', -- 'todo', 'in_progress', 'done'
  priority INTEGER DEFAULT 1, -- 1-4 scale
  category TEXT DEFAULT 'General',
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Journal Entries
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  content TEXT,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- 6. Define Global RLS Policies (The "Stay In Your Lane" Rule)
-- Profiles
CREATE POLICY "Users can only access their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
-- User Settings
CREATE POLICY "Users can only access their own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);
-- Tasks
CREATE POLICY "Users can only access their own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
-- Journal
CREATE POLICY "Users can only access their own journal" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);

-- 7. The Profile Creation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  INSERT INTO public.user_settings (user_id) VALUES (new.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
