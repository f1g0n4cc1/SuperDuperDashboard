-- 1. Implement Length Constraints to prevent "Denial of Wallet" attacks
-- Tasks
ALTER TABLE public.tasks 
  ADD CONSTRAINT title_length_check CHECK (char_length(title) <= 255),
  ADD CONSTRAINT category_length_check CHECK (char_length(category) <= 50);

-- Notes
ALTER TABLE public.notes 
  ADD CONSTRAINT title_length_check CHECK (char_length(title) <= 255),
  ADD CONSTRAINT content_length_check CHECK (char_length(content) <= 10000);

-- Profiles
ALTER TABLE public.profiles 
  ADD CONSTRAINT full_name_length_check CHECK (char_length(full_name) <= 100);

-- Journal Entries
ALTER TABLE public.journal_entries 
  ADD CONSTRAINT content_length_check CHECK (char_length(content) <= 5000);

-- Projects
ALTER TABLE public.projects 
  ADD CONSTRAINT name_length_check CHECK (char_length(name) <= 100);

-- 2. JSONB Size Protection for User Settings
-- Function to validate JSONB size (Limit to 100KB)
CREATE OR REPLACE FUNCTION public.check_jsonb_size()
RETURNS TRIGGER AS $$
BEGIN
  -- octet_length of the text representation gives us the size in bytes
  IF octet_length(NEW.dashboard_layout::text) > 102400 THEN
    RAISE EXCEPTION 'Dashboard layout exceeds the 100KB security limit.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for User Settings
DROP TRIGGER IF EXISTS ensure_jsonb_size_limit ON public.user_settings;
CREATE TRIGGER ensure_jsonb_size_limit
  BEFORE INSERT OR UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE PROCEDURE public.check_jsonb_size();
