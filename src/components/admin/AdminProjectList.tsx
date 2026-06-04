import { useState } from 'react';
import { Search } from 'lucide-react';

interface ProjectListItem {
  id: string;
  title: string;
  category: string;
  isPublic: boolean;
  period?: string;
}

interface AdminProjectListProps {
  projects: ProjectListItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  theme: 'light' | 'dark';
}

export default function AdminProjectList({
  projects,
  selectedId,
  onSelect,
  onCreateNew,
  theme
}: AdminProjectListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'digital' | 'physical'>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' ||
      project.category.toLowerCase() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`flex flex-col h-full border ${theme === 'dark' ? 'border-neutral-800 bg-[#0d0d0d]' : 'border-black bg-white shadow-[4px_4px_0_#000]'}`}>
      {theme === 'light' && (
        <div className="win95-titlebar mb-1">
          <span>projects_explorer.exe</span>
          <div className="flex gap-1">
            <div className="win95-titlebar-btn font-bold">X</div>
          </div>
        </div>
      )}

      <div className={`p-4 flex flex-col gap-4 flex-1 ${theme === 'light' ? 'win95-body' : ''}`}>
        <button
          onClick={onCreateNew}
          className={`w-full py-3 px-4 text-sm font-bold uppercase tracking-wider transition-all ${
            theme === 'dark'
              ? 'bg-neutral-100 text-black hover:bg-neutral-300'
              : 'bg-[#c0c0c0] text-black border-2 border-b-black border-r-black border-t-white border-l-white hover:active:border-b-white hover:active:border-r-white hover:active:border-t-black hover:active:border-l-black hover:active:bg-[#d0d0d0]'
          }`}
        >
          + Create New Project
        </button>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-4 w-4 ${theme === 'dark' ? 'text-neutral-500' : 'text-black'}`} />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full text-xs pl-9 pr-3 py-2 focus:outline-none transition-colors ${
              theme === 'dark'
                ? 'bg-[#151515] border border-neutral-800 text-neutral-100 font-mono focus:border-neutral-600'
                : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
            }`}
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-1 text-xs">
          {(['all', 'digital', 'physical'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`flex-1 py-1 uppercase font-bold tracking-wider border transition-all ${
                filterCategory === cat
                  ? theme === 'dark'
                    ? 'bg-neutral-800 border-neutral-700 text-white'
                    : 'bg-black text-white border-black'
                  : theme === 'dark'
                    ? 'bg-[#151515] border-neutral-800 text-neutral-500 hover:text-neutral-300'
                    : 'bg-[#c0c0c0] border-[#808080] text-[#555] hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects list */}
        <div className="flex-1 overflow-y-auto max-h-[400px] md:max-h-[calc(100vh-320px)] space-y-2 pr-1">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const isSelected = project.id === selectedId;
              return (
                <div
                  key={project.id}
                  onClick={() => onSelect(project.id)}
                  className={`p-3 cursor-pointer border transition-all flex flex-col gap-1 ${
                    isSelected
                      ? theme === 'dark'
                        ? 'bg-neutral-800 border-neutral-600 text-white'
                        : 'bg-[#000080] text-white border-black'
                      : theme === 'dark'
                        ? 'bg-[#151515] border-neutral-900 text-neutral-400 hover:border-neutral-800 hover:bg-[#1a1a1a]'
                        : 'bg-white border-gray-300 hover:bg-gray-100 text-black'
                  }`}
                >
                  <div className="font-bold text-sm truncate">{project.title}</div>
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider opacity-85">
                    <span>{project.category}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-sm ${
                        project.isPublic
                          ? theme === 'dark'
                            ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/30'
                            : 'bg-green-200 text-green-800'
                          : theme === 'dark'
                            ? 'bg-amber-950/50 text-amber-400 border border-amber-900/30'
                            : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {project.isPublic ? 'Public' : 'Draft'}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`text-center py-8 text-xs font-mono italic ${theme === 'dark' ? 'text-neutral-600' : 'text-[#808080]'}`}>
              No projects found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
