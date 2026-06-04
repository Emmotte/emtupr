import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useTheme } from '../components/ThemeProvider';
import AdminProjectList from '../components/admin/AdminProjectList';
import NotionEditor from '../components/admin/NotionEditor';
import {
  LogOut,
  Save,
  Trash2,
  Upload,
  Globe,
  Lock,
  Link as LinkIcon,
  Sparkles,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

interface Project {
  title: string;
  category: string;
  description: string;
  content: string;
  skills: string[];
  isPublic: boolean;
  link: string;
  period: string;
  role: string;
  thumbnail: string;
  createdAt?: any;
}

export default function Admin() {
  const { theme, style } = useTheme();
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  // Projects data state
  const [projects, setProjects] = useState<{ id: string; [key: string]: any }[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Design');
  const [period, setPeriod] = useState('');
  const [role, setRole] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [thumbnail, setThumbnail] = useState('');
  const [content, setContent] = useState('');
  const [projectCreatedAt, setProjectCreatedAt] = useState<any>(null);

  // Save / Upload UI state
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailProgress, setThumbnailProgress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  // Observe auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all projects if authenticated
  const fetchAllProjects = async () => {
    setLoadingProjects(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort projects by createdAt desc
      list.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      });
      setProjects(list);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setErrorMessage('Could not load projects. Check Firebase rules.');
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllProjects();
    }
  }, [user]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Failed to authenticate');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await signOut(auth);
      setSelectedProjectId(null);
      setIsEditing(false);
    }
  };

  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Auto-generate slug when title changes (only for new projects)
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (isNewProject) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Start creating a new project
  const startNewProject = () => {
    setIsEditing(true);
    setIsNewProject(true);
    setSelectedProjectId(null);
    setSlug('');
    setTitle('');
    setCategory('Design');
    setPeriod('');
    setRole('');
    setSkillsText('');
    setDescription('');
    setLink('');
    setIsPublic(true);
    setThumbnail('');
    setContent('');
    setProjectCreatedAt(null);
    setErrorMessage(null);
  };

  // Load project into editor when selected
  const loadProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    setSelectedProjectId(projectId);
    setIsEditing(true);
    setIsNewProject(false);
    setSlug(projectId);
    setTitle(proj.title || '');
    setCategory(proj.category || 'Design');
    setPeriod(proj.period || '');
    setRole(proj.role || '');
    setSkillsText(proj.skills ? proj.skills.join(', ') : '');
    setDescription(proj.description || '');
    setLink(proj.link || '');
    setIsPublic(proj.isPublic !== false);
    setThumbnail(proj.thumbnail || '');
    setContent(proj.content || '');
    setProjectCreatedAt(proj.createdAt || null);
    setErrorMessage(null);
  };

  // Upload thumbnail image file
  // Uses GitHub Contents API (commits to repo) when githubToken is set,
  // falls back to local /api/upload middleware for dev without token.
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    setThumbnailProgress('Uploading image...');

    const token = import.meta.env.VITE_GITHUB_TOKEN;

    if (token) {
      // --- GitHub Contents API ---
      try {
        setThumbnailProgress('Encoding image...');
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);

        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

        setThumbnailProgress(`Committing ${filename} to repo...`);
        const response = await fetch(
          `https://api.github.com/repos/Emmotte/emtupr/contents/public/uploads/${filename}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `Upload ${filename}`,
              content: base64,
              branch: 'main',
            }),
          }
        );

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || 'GitHub upload failed');
        }

        // Use raw.githubusercontent.com URL — image is available immediately
        const url = `https://raw.githubusercontent.com/Emmotte/emtupr/main/public/uploads/${filename}`;
        setThumbnail(url);
        setThumbnailProgress(`Uploaded! Image available now at raw URL.`);
      } catch (err: any) {
        console.error(err);
        setErrorMessage(`GitHub upload failed: ${err.message}`);
        setThumbnailProgress(null);
      } finally {
        setUploadingThumbnail(false);
      }
    } else {
      // --- Local /api/upload fallback (dev mode) ---
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Upload failed');
        }
        const data = await res.json();
        setThumbnail(data.url);
        setThumbnailProgress('Upload successful!');
      } catch (err: any) {
        console.error(err);
        setErrorMessage(`Thumbnail upload failed: ${err.message}`);
        setThumbnailProgress(null);
      } finally {
        setUploadingThumbnail(false);
      }
    }
  };

  // Validate fields and save to Firestore
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validations
    if (!title.trim()) {
      setErrorMessage('Title is required');
      return;
    }
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanSlug) {
      setErrorMessage('Valid URL slug is required (alphanumeric, dashes, underscores)');
      return;
    }

    if (isNewProject) {
      // Check if project with the same slug already exists
      const exists = projects.some((p) => p.id === cleanSlug);
      if (exists) {
        setErrorMessage(`A project with slug "${cleanSlug}" already exists. Please choose a different slug.`);
        return;
      }
    }

    if (description.length > 500) {
      setErrorMessage('Description must be 500 characters or less.');
      return;
    }

    setSaving(true);
    try {
      const parsedSkills = skillsText
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // Create document payload
      // MUST satisfy isValidProject schema constraint (keys.size() <= 11)
      const projectPayload: { [key: string]: any } = {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        content: content,
        skills: parsedSkills,
        isPublic: !!isPublic,
        link: link.trim(),
        period: period.trim(),
        role: role.trim(),
        thumbnail: thumbnail.trim(),
      };

      if (isNewProject) {
        // serverTimestamp() is a server-side sentinel — Firestore resolves it
        // to request.time, satisfying the rule: incoming().createdAt == request.time
        projectPayload.createdAt = serverTimestamp();
        await setDoc(doc(db, 'projects', cleanSlug), projectPayload);
      } else {
        // Carry over original createdAt timestamp (must match existing().createdAt rule)
        projectPayload.createdAt = projectCreatedAt || serverTimestamp();
        await setDoc(doc(db, 'projects', cleanSlug), projectPayload);
      }

      alert(`Project "${title}" saved successfully!`);
      setIsEditing(false);
      setIsNewProject(false);
      setSelectedProjectId(null);
      fetchAllProjects();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to save project: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete project from Firestore
  const handleDeleteProject = async () => {
    if (!slug) return;
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    setSaving(true);
    try {
      await deleteDoc(doc(db, 'projects', slug));
      alert(`Project "${title}" deleted successfully.`);
      setIsEditing(false);
      setIsNewProject(false);
      setSelectedProjectId(null);
      fetchAllProjects();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to delete project: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Render Login state
  if (!user && !authLoading) {
    return (
      <div className={`flex-1 flex items-center justify-center min-h-[80vh] px-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#e0e0e0]'}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-md p-8 border ${
            theme === 'dark'
              ? 'border-neutral-800 bg-[#0d0d0d] text-white shadow-2xl'
              : 'win95-window backdrop-blur-sm'
          }`}
        >
          {theme === 'light' && (
            <div className="win95-titlebar mb-4">
              <span>admin_login.exe</span>
              <div className="flex gap-1">
                <div className="win95-titlebar-btn font-bold">X</div>
              </div>
            </div>
          )}

          <div className={theme === 'light' ? 'win95-body' : ''}>
            <div className="text-center mb-8">
              <h1 className={`text-3xl font-black tracking-tighter uppercase ${theme === 'dark' ? 'text-white font-display' : 'text-black'}`}>
                Admin Portal
              </h1>
              <p className={`text-xs uppercase tracking-widest mt-2 font-mono ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080]'}`}>
                Sign in to manage portfolio
              </p>
            </div>

            {authError && (
              <div className="mb-6 p-4 text-xs font-mono border bg-red-950/20 border-red-900/50 text-red-400 rounded-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className={`text-[10px] uppercase tracking-widest font-bold ${theme === 'dark' ? 'text-neutral-500' : 'text-black'}`}>
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@emtupr.dev"
                  className={`w-full text-sm px-4 py-3 focus:outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#151515] border border-neutral-800 text-white font-mono focus:border-neutral-600'
                      : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={`text-[10px] uppercase tracking-widest font-bold ${theme === 'dark' ? 'text-neutral-500' : 'text-black'}`}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full text-sm px-4 py-3 focus:outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#151515] border border-neutral-800 text-white font-mono focus:border-neutral-600'
                      : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                  }`}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                  theme === 'dark'
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-[#c0c0c0] text-black border-2 border-b-black border-r-black border-t-white border-l-white hover:active:border-b-white hover:active:border-r-white hover:active:border-t-black hover:active:border-l-black hover:active:bg-[#d0d0d0]'
                }`}
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Loading Screen
  if (authLoading) {
    return (
      <div className={`flex-1 flex items-center justify-center min-h-[50vh] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <div className="text-center font-mono text-sm animate-pulse">
          Authenticating access...
        </div>
      </div>
    );
  }

  // Dashboard Workspace view
  return (
    <div className={`flex-1 flex flex-col w-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050505] text-neutral-100' : 'bg-[#e0e0e0] text-black'}`}>
      {/* Top Admin Navigation Header */}
      <header className={`px-6 py-4 flex justify-between items-center border-b ${
        theme === 'dark'
          ? 'border-neutral-800 bg-[#0d0d0d]'
          : 'border-b-black bg-[#c0c0c0] border-2 border-t-white border-l-white shadow-[0_1px_0_#000]'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'bg-neutral-900 border border-neutral-700 text-white' : 'bg-[#000080] text-white border border-black shadow-[1px_1px_0_#fff]'}`}>
            System
          </span>
          <span className="font-mono text-sm font-bold uppercase tracking-widest">
            emtupr control panel
          </span>
        </div>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-2 border transition-all ${
            theme === 'dark'
              ? 'bg-[#151515] border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
              : 'bg-[#c0c0c0] border-b-black border-r-black border-t-white border-l-white text-black hover:active:border-b-white hover:active:border-r-white hover:active:border-t-black hover:active:border-l-black'
          }`}
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </header>

      {/* Main Workspace Panels */}
      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6">
        
        {/* Left Side: Projects Listing Sidebar */}
        <aside className="w-full md:w-1/3 flex-none">
          <AdminProjectList
            projects={projects}
            selectedId={selectedProjectId || undefined}
            onSelect={loadProject}
            onCreateNew={startNewProject}
            theme={theme}
          />
        </aside>

        {/* Right Side: Editors Panel */}
        <main className={`flex-1 min-h-[500px] border relative ${
          theme === 'dark' ? 'border-neutral-800 bg-[#0d0d0d]' : 'border-black bg-white shadow-[4px_4px_0_#000]'
        }`}>
          {theme === 'light' && (
            <div className="win95-titlebar mb-1">
              <span>project_composer.exe</span>
              <div className="flex gap-1">
                <div className="win95-titlebar-btn font-bold">X</div>
              </div>
            </div>
          )}

          <div className={`p-6 h-full flex flex-col ${theme === 'light' ? 'win95-body' : ''}`}>
            
            {/* Display status or error alert messages */}
            {errorMessage && (
              <div className="mb-6 p-4 text-xs font-mono border bg-red-950/20 border-red-900/50 text-red-400 rounded-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.form
                  key="editing-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSaveProject}
                  className="space-y-6 flex-1 flex flex-col"
                >
                  <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-4 border-neutral-800">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        {isNewProject ? 'Create New Project' : `Edit: ${title}`}
                      </h2>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono mt-1">
                        Fields must strictly align with security guidelines.
                      </p>
                    </div>
                    
                    {/* Actions bar */}
                    <div className="flex gap-3 text-xs font-bold uppercase tracking-wider">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedProjectId(null);
                        }}
                        className={`px-4 py-2.5 border transition-all ${
                          theme === 'dark'
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                            : 'bg-[#c0c0c0] border-b-black border-r-black border-t-white border-l-white text-black hover:active:border-b-white hover:active:border-r-white hover:active:border-t-black hover:active:border-l-black'
                        }`}
                      >
                        Cancel
                      </button>
                      
                      {!isNewProject && (
                        <button
                          type="button"
                          onClick={handleDeleteProject}
                          className="px-4 py-2.5 bg-red-650/10 border border-red-900 text-red-500 hover:bg-red-900 hover:text-white transition-all flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}

                      <button
                        type="submit"
                        disabled={saving}
                        className={`px-5 py-2.5 flex items-center gap-1.5 transition-all ${
                          theme === 'dark'
                            ? 'bg-white text-black hover:bg-neutral-200 disabled:opacity-50'
                            : 'bg-[#c0c0c0] border-b-black border-r-black border-t-white border-l-white text-black hover:active:border-b-white hover:active:border-r-white hover:active:border-t-black hover:active:border-l-black disabled:opacity-50'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Post'}
                      </button>
                    </div>
                  </div>

                  {/* Metadata Input Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    
                    {/* URL Slug (doc ID) */}
                    <div className="flex flex-col gap-1">
                      <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold">
                        URL Slug / ID *
                      </label>
                      <input
                        type="text"
                        required
                        disabled={!isNewProject}
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                        placeholder="my-cool-project"
                        className={`w-full px-3 py-2 focus:outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-[#151515] border border-neutral-800 text-white font-mono focus:border-neutral-600 disabled:opacity-50'
                            : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                        }`}
                      />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-1">
                      <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Project Title"
                        className={`w-full px-3 py-2 focus:outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-[#151515] border border-neutral-800 text-white font-mono focus:border-neutral-600'
                            : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                        }`}
                      />
                    </div>

                    {/* Category Selector */}
                    <div className="flex flex-col gap-1">
                      <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full px-3 py-2 focus:outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-[#151515] border border-neutral-800 text-white font-mono focus:border-neutral-600'
                            : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                        }`}
                      >
                        <option value="Design">Design (Physical)</option>
                        <option value="Engineering">Engineering (Physical)</option>
                        <option value="Photography">Photography (Digital)</option>
                        <option value="Video">Video (Digital)</option>
                        <option value="Audio">Audio (Digital)</option>
                      </select>
                    </div>

                    {/* Period */}
                    <div className="flex flex-col gap-1">
                      <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold">
                        Period / Timeline
                      </label>
                      <input
                        type="text"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        placeholder="e.g. 2026 or 2023 — Present"
                        className={`w-full px-3 py-2 focus:outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-[#151515] border border-neutral-800 text-white font-mono focus:border-neutral-600'
                            : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                        }`}
                      />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-1">
                      <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold">
                        Role
                      </label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Lead Designer / Sound Engineer"
                        className={`w-full px-3 py-2 focus:outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-[#151515] border border-neutral-800 text-white font-mono focus:border-neutral-600'
                            : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                        }`}
                      />
                    </div>

                    {/* Skills/Tags */}
                    <div className="flex flex-col gap-1">
                      <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold">
                        Skills / Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        placeholder="e.g. React, Lightroom, Sound Design"
                        className={`w-full px-3 py-2 focus:outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-[#151515] border border-neutral-800 text-white font-mono focus:border-neutral-600'
                            : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                        }`}
                      />
                    </div>

                    {/* Link */}
                    <div className="flex flex-col gap-1">
                      <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" /> Live Link
                      </label>
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://example.com/project"
                        className={`w-full px-3 py-2 focus:outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-[#151515] border border-neutral-800 text-white font-mono focus:border-neutral-600'
                            : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                        }`}
                      />
                    </div>

                    {/* Status Publish */}
                    <div className="flex flex-col gap-1">
                      <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold">
                        Visibility Status
                      </label>
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="visibility"
                            checked={isPublic}
                            onChange={() => setIsPublic(true)}
                            className="accent-black"
                          />
                          <Globe className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Publicly Published</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="visibility"
                            checked={!isPublic}
                            onChange={() => setIsPublic(false)}
                            className="accent-black"
                          />
                          <Lock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Draft (Private)</span>
                        </label>
                      </div>
                    </div>
                  </div>



                  {/* Thumbnail File upload dropzone */}
                  <div className="flex flex-col gap-1 text-xs">
                    <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold">
                      Thumbnail Image
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      {/* Upload Box */}
                      <div className={`flex-1 w-full border border-dashed rounded p-4 text-center cursor-pointer transition-colors relative ${
                        theme === 'dark'
                          ? 'border-neutral-800 bg-[#151515] hover:border-neutral-600'
                          : 'border-black bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          disabled={uploadingThumbnail}
                        />
                        <div className="flex flex-col items-center gap-1">
                          <Upload className={`w-6 h-6 ${theme === 'dark' ? 'text-neutral-500' : 'text-black'}`} />
                          <span className="font-bold">
                            {uploadingThumbnail ? 'Uploading...' : 'Upload Thumbnail File'}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            Drag & drop or click to select image
                          </span>
                        </div>
                      </div>

                      {/* Manual Thumbnail URL Link */}
                      <div className="flex-1 w-full flex flex-col gap-1">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                          Or Paste Image URL
                        </span>
                        <input
                          type="text"
                          value={thumbnail}
                          onChange={(e) => setThumbnail(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className={`w-full px-3 py-2.5 focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#151515] border border-neutral-800 text-white font-mono focus:border-neutral-600'
                              : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                          }`}
                        />
                      </div>

                      {/* Preview Box */}
                      {thumbnail && (
                        <div className="w-24 h-16 border rounded overflow-hidden flex-shrink-0 bg-neutral-900">
                          <img src={thumbnail} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    {thumbnailProgress && (
                      <div className="text-[10px] font-mono text-neutral-400 mt-1">{thumbnailProgress}</div>
                    )}
                  </div>

                  {/* Description Box */}
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-center">
                      <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold">
                        Description / Snippet *
                      </label>
                      <span className={`font-mono text-[10px] ${description.length > 500 ? 'text-red-500' : 'text-neutral-500'}`}>
                        {description.length} / 500 chars
                      </span>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter a brief project snippet..."
                      maxLength={500}
                      className={`w-full px-3 py-2.5 focus:outline-none transition-colors resize-none ${
                        theme === 'dark'
                          ? 'bg-[#151515] border border-neutral-800 text-white font-sans focus:border-neutral-600'
                          : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black shadow-[inset_1px_1px_0_#808080]'
                      }`}
                    />
                  </div>

                  {/* Notion-Style Block Markdown Editor */}
                  <div className="flex-1 flex flex-col gap-1 text-xs min-h-[400px]">
                    <label className="uppercase tracking-widest font-mono text-neutral-500 font-bold">
                      Detailed Project Content (Notion Block Markdown)
                    </label>
                    <div className="flex-1 flex flex-col min-h-[350px]">
                      <NotionEditor
                        markdown={content}
                        onChange={setContent}
                        projectId={slug}
                        theme={theme}
                      />
                    </div>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="welcome-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4"
                >
                  <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-neutral-900 text-neutral-500' : 'bg-neutral-100 text-[#808080]'}`}>
                    <FolderOpen className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Composer Console</h3>
                    <p className={`text-xs max-w-sm mt-2 font-mono ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080]'}`}>
                      Select an existing project from the left panel to modify it, or click "+ Create New Project" to add a new asset.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
