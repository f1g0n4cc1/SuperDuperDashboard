-- Function to calculate the current streak for a habit
CREATE OR REPLACE FUNCTION public.get_habit_stats(target_habit_id UUID)
RETURNS TABLE (
    habit_id UUID,
    current_streak INT,
    total_completions INT,
    last_completed_at DATE
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    streak INT := 0;
    curr_date DATE := CURRENT_DATE;
    found_log BOOLEAN;
BEGIN
    -- 1. Get total completions and last date
    SELECT 
        target_habit_id,
        MAX(completed_at) INTO habit_id, last_completed_at
    FROM public.habit_logs
    WHERE habit_logs.habit_id = target_habit_id;

    SELECT COUNT(*)::INT INTO total_completions
    FROM public.habit_logs
    WHERE habit_logs.habit_id = target_habit_id;

    -- 2. Calculate current streak
    -- If not completed today, start checking from yesterday
    IF NOT EXISTS (SELECT 1 FROM public.habit_logs WHERE habit_logs.habit_id = target_habit_id AND completed_at = curr_date) THEN
        curr_date := curr_date - 1;
    END IF;

    LOOP
        SELECT EXISTS (
            SELECT 1 FROM public.habit_logs 
            WHERE habit_logs.habit_id = target_habit_id AND completed_at = curr_date
        ) INTO found_log;
        
        EXIT WHEN NOT found_log;
        streak := streak + 1;
        curr_date := curr_date - 1;
    END LOOP;

    current_streak := streak;
    RETURN NEXT;
END;
$$;
