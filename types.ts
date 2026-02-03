export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// --- PAGE BUILDER TYPES ---
export type SectionType = 
  | 'hero' 
  | 'text' 
  | 'features' 
  | 'cta' 
  | 'faq' 
  | 'html' 
  | 'services' 
  | 'stats' 
  | 'testimonials' 
  | 'process' 
  | 'contact';

export interface Section {
  id: string;
  type: SectionType;
  content: any; // Dynamic content based on type
  settings?: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
  };
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  description?: string; // SEO meta description
  sections: Section[];
  isPublished: boolean;
  isSystem?: boolean; // If true, cannot be deleted (e.g., Home)
}

// --- BLOG TYPES ---
export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string; // URL
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML
  coverImage?: string;
  imageCaption?: string; // New: For the caption under main image
  author: string; // Legacy support
  authors?: BlogAuthor[]; // New: List of detailed authors
  relatedPostIds?: string[]; // New: List of related blog post IDs
  date: string;
  isPublished: boolean;
  tags?: string;
}

export interface BlogSettings {
  layout: 'grid' | 'list';
  showSidebar: boolean;
  postsPerPage: number;
  sidebarTitle?: string;
}

// --- NAVIGATION & FOOTER TYPES ---
export interface NavItem {
  id: string;
  label: string;
  path?: string; 
  isExternal?: boolean;
  isOpenInNewTab?: boolean;
  isEnabled: boolean;
  isMegaMenu?: boolean; // New: Toggles "Columns/Tiles" layout
  children?: NavItem[]; 
}

export interface HeaderConfig {
  logoUrl: string;
  logoText: string;
  isSticky: boolean;
  showMobileMenu: boolean;
  backgroundColor: string; // Tailwind class or hex
  textColor: string;
  items: NavItem[];
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  type: 'text' | 'links' | 'contact' | 'social';
  content?: string; // For 'text'
  links?: FooterLink[]; // For 'links' and 'social'
}

export interface FooterConfig {
  backgroundColor: string;
  textColor: string;
  columns: FooterColumn[];
  copyrightText: string;
  showYear: boolean;
}

// --- AI APP BUILDER TYPES ---
export interface AIAppInput {
  id: string;
  label: string;
  key: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  options?: string; // Comma separated for select
  placeholder?: string;
}

export interface AIApp {
  id: string;
  name: string;
  slug: string;
  description: string;
  inputs: AIAppInput[];
  promptTemplate: string;
  outputType: 'text' | 'card';
  actionLabel: string;
}

// --- CAREER MODULE TYPES ---
export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string; // New
  location: string;
  isRemote: boolean; // New
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salaryRange?: string; // New e.g. "$100k - $120k"
  experience: string;
  description: string; // HTML/Rich text
  requirements: string[]; // Legacy array support, though description handles most now
  benefits?: string[]; // New
  isActive: boolean;
  postedDate: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateName: string;
  email: string;
  phone: string;
  resumeId?: string; // ID for IndexedDB
  resumeName?: string;
  coverLetter?: string;
  status: 'new' | 'reviewed' | 'rejected' | 'hired';
  appliedDate: string;
}

export interface SiteContent {
  about: {
    title: string;
    content: string;
    mission: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

// --- GLOBAL SETTINGS ---
export interface GlobalSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  logoUrl?: string;
  faviconUrl?: string;
  themeColor: string; // Changed from enum to string for Custom Color support
  font: 'Inter' | 'Roboto' | 'Open Sans' | 'Lato' | 'Poppins';
  features: {
    careers: boolean;
    aiApps: boolean;
    blog: boolean; // Added Blog toggle
    maintenanceMode: boolean;
  };
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

// --- AUTH & USER TYPES ---
export interface User {
  id: string;
  username: string;
  password?: string; // Stored locally for demo purposes
  role: 'admin' | 'employee';
  email?: string; // Used to link to applications
  isAuthenticated: boolean;
}

export interface AppData {
  settings: GlobalSettings;
  users: User[]; // New: List of users
  header: HeaderConfig;
  footer: FooterConfig;
  services: Service[];
  pages: CustomPage[];
  blogPosts: BlogPost[]; 
  blogSettings: BlogSettings; 
  aiApps: AIApp[];
  jobs: Job[];
  applications: JobApplication[];
  content: SiteContent;
  activityLogs: ActivityLog[];
}