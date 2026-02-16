-- Create a function to get or create a daily journal entry
CREATE OR REPLACE FUNCTION public.get_or_create_daily_journal()
RETURNS SETOF public.journal_entries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
    entry_id UUID;
BEGIN
    -- Try to find an entry from today
    SELECT id INTO entry_id
    FROM public.journal_entries
    WHERE user_id = auth.uid()
      AND created_at::date = today_date
    LIMIT 1;

    -- If not found, create one
    IF entry_id IS NULL THEN
        INSERT INTO public.journal_entries (user_id, content, mood)
        VALUES (auth.uid(), '', 5)
        RETURNING id INTO entry_id;
    END IF;

    -- Return the entry
    RETURN QUERY
    SELECT *
    FROM public.journal_entries
    WHERE id = entry_id;
END;
$$;
