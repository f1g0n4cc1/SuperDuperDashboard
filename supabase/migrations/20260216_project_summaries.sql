-- Create a View for Project Summaries with pre-calculated stats
CREATE OR REPLACE VIEW public.project_summaries AS
SELECT 
    p.id,
    p.user_id,
    p.name,
    p.description,
    p.status,
    p.created_at,
    COUNT(t.id)::INT AS total_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'done')::INT AS completed_tasks,
    CASE 
        WHEN COUNT(t.id) > 0 THEN ROUND((COUNT(t.id) FILTER (WHERE t.status = 'done')::FLOAT / COUNT(t.id)::FLOAT) * 100)
        ELSE 0
    END AS progress
FROM 
    public.projects p
LEFT JOIN 
    public.tasks t ON t.project_id = p.id
GROUP BY 
    p.id;

-- Ensure RLS is respected (Views in Supabase inherit RLS from underlying tables)
-- but we need to grant access to the authenticated role.
GRANT SELECT ON TABLE public.project_summaries TO authenticated;
