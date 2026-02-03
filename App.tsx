import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import { Layout } from './components/Layout';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Services } from './pages/public/Services';
import { Contact } from './pages/public/Contact';
import { DynamicPage } from './pages/public/DynamicPage';
import { AppRunner } from './pages/public/AppRunner';
import { Careers } from './pages/public/Careers';
import { JobDetail } from './pages/public/JobDetail';
import { BlogList } from './pages/public/BlogList';
import { BlogDetail } from './pages/public/BlogDetail';

// Admin Pages
import { AdminLayout } from './components/AdminLayout';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { EmployeeDashboard } from './pages/admin/EmployeeDashboard'; // New
import { PageManager } from './pages/admin/PageManager';
import { ServiceManager } from './pages/admin/ServiceManager';
import { AppBuilder } from './pages/admin/AppBuilder';
import { CareerManager } from './pages/admin/CareerManager';
import { BlogManager } from './pages/admin/BlogManager';
import { Settings } from './pages/admin/Settings';
import { NavigationManager } from './pages/admin/NavigationManager';

const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="page/:slug" element={<DynamicPage />} />
              <Route path="app/:slug" element={<AppRunner />} />
              <Route path="careers" element={<Careers />} />
              <Route path="careers/:slug" element={<JobDetail />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="employee" element={<EmployeeDashboard />} />
              <Route path="pages" element={<PageManager />} />
              <Route path="navigation" element={<NavigationManager />} />
              <Route path="apps" element={<AppBuilder />} />
              <Route path="careers" element={<CareerManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="services" element={<ServiceManager />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </DataProvider>
  );
};

export default App;