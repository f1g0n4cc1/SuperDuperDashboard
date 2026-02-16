import type { Task } from '../../types/tasks';
import type { Project } from '../../types/projects';

export const ProjectsWidget: React.FC = () => {
  const { projects, createProject } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { tasks, isLoading: tasksLoading, updateTask } = useTasks(selectedProjectId || undefined);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    createProject.mutate({ name: projectName, description: '' });
    setProjectName('');
    setIsAddingProject(false);
  };

  const handleToggleTask = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    updateTask.mutate({ id, updates: { status: newStatus } });
  };

  const selectedProject = (projects as any[]).find(p => p.id === selectedProjectId);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto h-[70vh] flex flex-col">
      <header className="mb-10 flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Project Command</h2>
          <p className="text-batcave-text-secondary italic">"Divide and conquer. Organize your strategic operations."</p>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Project List (Folder View) */}
        <div className="w-64 glass-panel rounded-3xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-batcave-text-secondary">Operations</h3>
            <button onClick={() => setIsAddingProject(true)} className="text-batcave-blue hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
            <button 
              onClick={() => setSelectedProjectId(null)}
              className={`w-full flex items-center p-3 rounded-xl transition-all text-sm ${
                !selectedProjectId ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              <Layout className="w-4 h-4 mr-3" />
              <span className="font-medium">All Objectives</span>
            </button>

            {(projects as any[]).map(project => (
              <button 
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all text-sm group ${
                  selectedProjectId === project.id ? 'bg-batcave-blue/10 text-batcave-blue shadow-lg border border-batcave-blue/10' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                }`}
              >
                <Folder className="w-4 h-4 mr-3" />
                <span className="font-medium truncate">{project.name}</span>
                <span className="ml-auto text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  {Math.round(project.progress)}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Task List (Filtered) */}
        <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col overflow-hidden">
          {isAddingProject ? (
            <form onSubmit={handleAddProject} className="animate-fade-in py-10 text-center">
              <input
                autoFocus
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Name your strategic operation..."
                className="bg-transparent border-none text-2xl font-bold text-white text-center placeholder:text-gray-800 outline-none mb-6 w-full"
              />
              <div className="flex justify-center gap-4">
                <button type="button" onClick={() => setIsAddingProject(false)} className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">ABORT</button>
                <button type="submit" className="px-10 py-2 bg-batcave-blue text-white text-xs font-bold rounded-xl shadow-[0_0_15px_#3b82f6]">INITIALIZE</button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {selectedProject ? selectedProject.name : 'Unified Objectives'}
                  </h3>
                  <p className="text-xs text-batcave-text-secondary uppercase tracking-widest">
                    {selectedProject ? `Operation Progress: ${Math.round(selectedProject.progress)}%` : 'All Active Missions'}
                  </p>
                </div>
                {selectedProject && (
                  <div className="h-1.5 w-48 bg-white/5 rounded-full overflow-hidden mt-2">
                    <div 
                      className="h-full bg-batcave-blue shadow-[0_0_10px_#3b82f6] transition-all duration-700"
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {tasksLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-batcave-blue" />
                  </div>
                ) : (tasks as Task[]).length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl">
                    <p className="text-batcave-text-secondary text-sm italic">No missions assigned to this operation.</p>
                  </div>
                ) : (
                  (tasks as Task[]).map(task => (
                    <div 
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, task.status || '')}
                      className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer group ${
                        task.status === 'done' 
                          ? 'bg-white/2 border-transparent opacity-50' 
                          : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="mr-4 text-batcave-blue">
                        {task.status === 'done' ? (
                          <CheckCircle2 className="w-5 h-5 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                        ) : (
                          <Circle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                      <span className={`font-medium ${task.status === 'done' ? 'line-through' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
