import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Service, CustomPage, SiteContent, AIApp, Job, JobApplication, GlobalSettings, ActivityLog, HeaderConfig, FooterConfig, BlogPost, BlogSettings, User } from '../types';
import { getAppData, saveAppData, resetToDefaults } from '../services/storage';

interface DataContextType {
  data: AppData;
  updateContent: (section: keyof SiteContent, content: any) => void;
  // Services
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  // Pages
  addPage: (page: CustomPage) => void;
  updatePage: (page: CustomPage) => void;
  deletePage: (id: string) => void;
  // Blog
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  updateBlogSettings: (settings: BlogSettings) => void; 
  // AI Apps
  addAIApp: (app: AIApp) => void;
  updateAIApp: (app: AIApp) => void;
  deleteAIApp: (id: string) => void;
  // Jobs
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  // Applications
  addApplication: (app: JobApplication) => void;
  updateApplicationStatus: (id: string, status: JobApplication['status']) => void;
  deleteApplication: (id: string) => void;
  // Users
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
  // System
  updateSettings: (settings: GlobalSettings) => void;
  updateHeader: (header: HeaderConfig) => void;
  updateFooter: (footer: FooterConfig) => void;
  resetData: () => void;
  importData: (jsonData: string) => boolean;
  exportData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(getAppData());

  useEffect(() => {
    saveAppData(data);
    applyTheme(data.settings.themeColor, data.settings.font);
    applyFavicon(data.settings.faviconUrl);
  }, [data]);

  // Apply theme dynamically
  const applyTheme = (colorHex: string, fontName: string = 'Inter') => {
    const root = document.documentElement;
    // Set Font
    root.style.setProperty('--font-family', `"${fontName}"`);

    // Helper to tint colors for Tailwind palette generation
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    }
    
    // Simple function to lighten/darken
    const adjustColor = (hex: string, percent: number) => {
        const {r,g,b} = hexToRgb(hex);
        const amount = Math.floor(255 * percent / 100);
        const R = Math.min(255, Math.max(0, r + amount));
        const G = Math.min(255, Math.max(0, g + amount));
        const B = Math.min(255, Math.max(0, b + amount));
        const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
        return "#" + RR + GG + BB;
    };

    // Apply colors
    root.style.setProperty('--color-brand-50', adjustColor(colorHex, 90));
    root.style.setProperty('--color-brand-100', adjustColor(colorHex, 70));
    root.style.setProperty('--color-brand-500', colorHex);
    root.style.setProperty('--color-brand-600', adjustColor(colorHex, -10));
    root.style.setProperty('--color-brand-700', adjustColor(colorHex, -20));
    root.style.setProperty('--color-brand-800', adjustColor(colorHex, -30));
    root.style.setProperty('--color-brand-900', adjustColor(colorHex, -40));
  };

  const applyFavicon = (url?: string) => {
      if (!url) return;
      const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          newLink.href = url;
          document.head.appendChild(newLink);
      } else {
          link.href = url;
      }
  };

  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      activityLogs: [newLog, ...(prev.activityLogs || []).slice(0, 49)] // Keep last 50
    }));
  };

  // Helper to create log object for atomic updates
  const createLog = (action: string, details: string): ActivityLog => ({
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString()
  });

  const updateContent = (section: keyof SiteContent, content: any) => {
    setData(prev => ({ ...prev, content: { ...prev.content, [section]: content } }));
    logActivity('Content Update', `Updated ${section} section`);
  };

  // Service CRUD
  const addService = (s: Service) => {
    setData(p => ({ ...p, services: [...p.services, s] }));
    logActivity('Service Added', s.title);
  };
  const updateService = (s: Service) => {
    setData(p => ({ ...p, services: p.services.map(i => i.id === s.id ? s : i) }));
    logActivity('Service Updated', s.title);
  };
  const deleteService = (id: string) => {
    setData(p => {
        const newLog = createLog('Service Deleted', `ID: ${id}`);
        return { 
            ...p, 
            services: p.services.filter(i => i.id !== id),
            activityLogs: [newLog, ...(p.activityLogs || []).slice(0, 49)]
        };
    });
  };

  // Page CRUD
  const addPage = (pg: CustomPage) => {
    setData(p => ({ ...p, pages: [...p.pages, pg] }));
    logActivity('Page Created', pg.title);
  };
  const updatePage = (pg: CustomPage) => {
    setData(p => ({ ...p, pages: p.pages.map(i => i.id === pg.id ? pg : i) }));
    logActivity('Page Updated', pg.title);
  };
  const deletePage = (id: string) => {
    setData(p => {
        const newLog = createLog('Page Deleted', `ID: ${id}`);
        return {
            ...p, 
            pages: p.pages.filter(i => i.id !== id),
            activityLogs: [newLog, ...(p.activityLogs || []).slice(0, 49)]
        };
    });
  };

  // Blog CRUD
  const addBlogPost = (post: BlogPost) => {
    setData(p => ({ ...p, blogPosts: [...(p.blogPosts || []), post] }));
    logActivity('Blog Post Created', post.title);
  };
  const updateBlogPost = (post: BlogPost) => {
    setData(p => ({ ...p, blogPosts: (p.blogPosts || []).map(i => i.id === post.id ? post : i) }));
    logActivity('Blog Post Updated', post.title);
  };
  const deleteBlogPost = (id: string) => {
    setData(p => {
        const newLog = createLog('Blog Post Deleted', `ID: ${id}`);
        return {
            ...p, 
            blogPosts: (p.blogPosts || []).filter(i => i.id !== id),
            activityLogs: [newLog, ...(p.activityLogs || []).slice(0, 49)]
        };
    });
  };
  const updateBlogSettings = (settings: BlogSettings) => {
    setData(p => ({ ...p, blogSettings: settings }));
    logActivity('Blog Settings', 'Updated layout configuration');
  };

  // AI App CRUD
  const addAIApp = (app: AIApp) => {
    setData(p => ({ ...p, aiApps: [...p.aiApps, app] }));
    logActivity('AI App Created', app.name);
  };
  const updateAIApp = (app: AIApp) => {
    setData(p => ({ ...p, aiApps: p.aiApps.map(i => i.id === app.id ? app : i) }));
    logActivity('AI App Updated', app.name);
  };
  const deleteAIApp = (id: string) => {
    setData(p => {
        const newLog = createLog('AI App Deleted', `ID: ${id}`);
        return {
            ...p, 
            aiApps: p.aiApps.filter(i => i.id !== id),
            activityLogs: [newLog, ...(p.activityLogs || []).slice(0, 49)]
        };
    });
  };

  // Job CRUD
  const addJob = (job: Job) => {
    setData(p => ({ ...p, jobs: [...p.jobs, job] }));
    logActivity('Job Posted', job.title);
  };
  const updateJob = (job: Job) => {
    setData(p => ({ ...p, jobs: p.jobs.map(i => i.id === job.id ? job : i) }));
    logActivity('Job Updated', job.title);
  };
  const deleteJob = (id: string) => {
    setData(p => {
        const newLog = createLog('Job Deleted', `ID: ${id}`);
        return {
            ...p, 
            jobs: p.jobs.filter(i => i.id !== id),
            activityLogs: [newLog, ...(p.activityLogs || []).slice(0, 49)]
        };
    });
  };

  const addApplication = (app: JobApplication) => {
    setData(p => ({ ...p, applications: [app, ...p.applications] }));
  };
  const updateApplicationStatus = (id: string, status: JobApplication['status']) => {
    setData(p => ({
        ...p,
        applications: p.applications.map(a => a.id === id ? { ...a, status } : a)
    }));
    logActivity('Application Status', `Updated to ${status}`);
  };
  const deleteApplication = (id: string) => {
    setData(p => {
        const newLog = createLog('Application Deleted', `ID: ${id}`);
        return {
            ...p, 
            applications: p.applications.filter(i => i.id !== id),
            activityLogs: [newLog, ...(p.activityLogs || []).slice(0, 49)]
        };
    });
  };

  // User CRUD
  const addUser = (user: User) => {
      setData(p => ({ ...p, users: [...(p.users || []), user] }));
      logActivity('User Added', `${user.username} (${user.role})`);
  };
  const deleteUser = (id: string) => {
      setData(p => ({ ...p, users: (p.users || []).filter(u => u.id !== id) }));
      logActivity('User Deleted', `ID: ${id}`);
  };

  const updateSettings = (settings: GlobalSettings) => {
    setData(prev => ({ ...prev, settings }));
    logActivity('Settings Updated', 'Global configuration changed');
  };

  const updateHeader = (header: HeaderConfig) => {
    setData(prev => ({ ...prev, header }));
    logActivity('Header Updated', 'Main navigation changed');
  };

  const updateFooter = (footer: FooterConfig) => {
    setData(prev => ({ ...prev, footer }));
    logActivity('Footer Updated', 'Footer content changed');
  };

  const resetData = () => {
    const defaults = resetToDefaults();
    setData(defaults);
    logActivity('System Reset', 'Restored to factory defaults');
  };

  const importData = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.settings && parsed.services) {
        setData(parsed);
        logActivity('Data Import', 'Full system restore from JSON');
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const exportData = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `technova_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logActivity('Data Export', 'System backup downloaded');
  };

  return (
    <DataContext.Provider value={{ 
      data, updateContent, 
      addService, updateService, deleteService,
      addPage, updatePage, deletePage,
      addBlogPost, updateBlogPost, deleteBlogPost, updateBlogSettings,
      addAIApp, updateAIApp, deleteAIApp,
      addJob, updateJob, deleteJob,
      addApplication, updateApplicationStatus, deleteApplication,
      addUser, deleteUser,
      updateSettings, updateHeader, updateFooter, 
      resetData, importData, exportData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};