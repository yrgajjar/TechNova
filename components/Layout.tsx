import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Monitor, Facebook, Twitter, Linkedin, Mail, ShieldAlert, Instagram, ChevronDown, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';

// Icons map for footer social
const SocialIcons: Record<string, any> = {
  Facebook, Twitter, Linkedin, Instagram, Mail
};

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { data } = useData();
  const { settings, header, footer } = data;

  // Maintenance Mode Check
  if (settings.features.maintenanceMode && !location.pathname.startsWith('/admin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <ShieldAlert className="h-16 w-16 text-brand-600 mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          {settings.siteName} is currently undergoing scheduled maintenance. We will be back shortly.
        </p>
        <div className="mt-8">
           <Link to="/admin" className="text-sm text-gray-400 hover:text-brand-600">Admin Login</Link>
        </div>
      </div>
    );
  }

  const toggleMobileSub = (id: string) => {
    setMobileExpanded(prev => ({...prev, [id]: !prev[id]}));
  };

  return (
    <div className="flex flex-col min-h-screen font-sans" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
      {/* Dynamic Header */}
      <header 
        className={`${header.isSticky ? 'sticky top-0 z-50' : ''} shadow-sm border-b border-gray-100 transition-colors bg-white`}
        style={{ backgroundColor: header.backgroundColor, color: header.textColor }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 z-20">
              {header.logoUrl || settings.logoUrl ? (
                <img src={header.logoUrl || settings.logoUrl} alt="Logo" className="h-8 w-auto" />
              ) : (
                <div className="bg-brand-600 p-2 rounded-lg">
                  <Monitor className="h-6 w-6 text-white" />
                </div>
              )}
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">
                {header.logoText || settings.siteName}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {header.items.filter(i => i.isEnabled).map((item) => {
                // Auto-hide if feature disabled
                if (item.path === '/careers' && !settings.features.careers) return null;
                if (item.path === '/blog' && !settings.features.blog) return null;
                
                const hasChildren = item.children && item.children.length > 0;
                
                return (
                  <div key={item.id} className="group relative">
                    {/* Top Level Item */}
                    <div className="px-3 py-6 inline-flex items-center">
                       {item.isExternal ? (
                          <a href={item.path} target={item.isOpenInNewTab ? '_blank' : '_self'} className="text-sm font-medium hover:text-brand-600 flex items-center transition-colors" style={{ color: header.textColor }}>
                             {item.label}
                          </a>
                       ) : (
                          <Link to={item.path || '#'} className={`text-sm font-medium hover:text-brand-600 flex items-center transition-colors ${location.pathname === item.path ? 'text-brand-600' : ''}`} style={{ color: location.pathname === item.path ? undefined : header.textColor }}>
                             {item.label}
                             {hasChildren && <ChevronDown className="h-3 w-3 ml-1" />}
                          </Link>
                       )}
                    </div>

                    {/* Dropdown / Mega Menu */}
                    {hasChildren && (
                        <div className={`absolute top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-2 
                            ${item.isMegaMenu 
                                ? 'left-1/2 -translate-x-1/2 w-screen max-w-5xl px-4' 
                                : 'left-0 w-64'
                            }`}
                        >
                            <div className="bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden ring-1 ring-black ring-opacity-5">
                                {item.isMegaMenu ? (
                                    /* Mega Menu Layout (Columns & Tiles) */
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white">
                                        {item.children?.map(col => (
                                            <div key={col.id}>
                                                <h4 className="font-bold text-gray-900 mb-3 text-sm tracking-wide uppercase">{col.label}</h4>
                                                <ul className="space-y-2">
                                                    {col.children?.map(sub => (
                                                        <li key={sub.id}>
                                                            <Link to={sub.path || '#'} className="block text-sm text-gray-500 hover:text-brand-600 hover:bg-gray-50 px-2 py-1.5 rounded transition">
                                                                {sub.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* Standard Dropdown */
                                    <div className="py-2">
                                        {item.children?.map(sub => (
                                            <Link 
                                                key={sub.id} 
                                                to={sub.path || '#'} 
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/admin" className="text-sm opacity-70 hover:opacity-100 font-medium" style={{ color: header.textColor }}>
                Admin
              </Link>
              <Link to="/contact" className="px-5 py-2.5 text-sm font-bold text-white bg-brand-600 rounded-full hover:bg-brand-700 transition shadow-lg shadow-brand-200">
                Get Quote
              </Link>
            </div>

            {/* Mobile Menu Button */}
            {header.showMobileMenu && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-black/5 transition"
                style={{ color: header.textColor }}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && header.showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 absolute w-full bg-white z-50 h-[calc(100vh-64px)] overflow-y-auto" style={{ backgroundColor: header.backgroundColor }}>
            <div className="px-4 py-4 space-y-2">
              {header.items.filter(i => i.isEnabled).map((item) => {
                 if (item.path === '/careers' && !settings.features.careers) return null;
                 if (item.path === '/blog' && !settings.features.blog) return null;

                 const hasChildren = item.children && item.children.length > 0;
                 return (
                     <div key={item.id} className="border-b border-gray-50 last:border-0 pb-2">
                         <div className="flex justify-between items-center">
                             <Link 
                                to={item.path || '#'}
                                onClick={() => !hasChildren && setIsMenuOpen(false)}
                                className="block py-3 text-base font-bold text-gray-800"
                                style={{ color: header.textColor }}
                             >
                                {item.label}
                             </Link>
                             {hasChildren && (
                                <button onClick={() => toggleMobileSub(item.id)} className="p-2 text-gray-500">
                                    <ChevronDown className={`h-5 w-5 transform transition-transform ${mobileExpanded[item.id] ? 'rotate-180' : ''}`} />
                                </button>
                             )}
                         </div>
                         
                         {/* Mobile Submenu */}
                         {hasChildren && mobileExpanded[item.id] && (
                             <div className="pl-4 space-y-1 bg-gray-50 rounded-lg p-2 mb-2">
                                 {item.children?.map(child => (
                                     <div key={child.id}>
                                         {child.children ? (
                                             // Mobile Mega Menu Groups
                                             <div className="mb-3">
                                                 <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{child.label}</h5>
                                                 {child.children.map(sub => (
                                                     <Link 
                                                        key={sub.id}
                                                        to={sub.path || '#'}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block py-2 pl-2 text-sm text-gray-600 hover:text-brand-600"
                                                     >
                                                        {sub.label}
                                                     </Link>
                                                 ))}
                                             </div>
                                         ) : (
                                             // Standard Link
                                             <Link 
                                                to={child.path || '#'} 
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block py-2 text-sm text-gray-600 hover:text-brand-600"
                                             >
                                                {child.label}
                                             </Link>
                                         )}
                                     </div>
                                 ))}
                             </div>
                         )}
                     </div>
                 );
              })}
              <div className="pt-4">
                  <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 rounded-lg text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200"
                  >
                      Admin Login
                  </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow relative z-0">
        <Outlet />
      </main>

      {/* Dynamic Footer */}
      <footer style={{ backgroundColor: footer.backgroundColor, color: footer.textColor }}>
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${footer.columns.length} gap-8`}>
            {footer.columns.map(col => (
              <div key={col.id}>
                <h3 className="text-sm font-semibold tracking-wider uppercase mb-4" style={{ color: footer.textColor, opacity: 0.9 }}>
                  {col.title}
                </h3>
                
                {col.type === 'text' && (
                  <p className="text-sm leading-relaxed opacity-75">{col.content}</p>
                )}

                {col.type === 'links' && (
                  <ul className="space-y-2">
                    {col.links?.map((link, idx) => (
                      <li key={idx}>
                        <Link to={link.url} className="text-sm opacity-75 hover:opacity-100 hover:text-white transition">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                
                {col.type === 'contact' && (
                  <ul className="space-y-3 opacity-75 text-sm">
                    <li>{data.content.contact.address}</li>
                    <li>{data.content.contact.phone}</li>
                    <li>{data.settings.contactEmail}</li>
                  </ul>
                )}

                {col.type === 'social' && (
                  <div className="flex space-x-4">
                     {col.links?.map((link, idx) => {
                       const Icon = SocialIcons[link.label] || SocialIcons.Facebook; // Default
                       return (
                         <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="opacity-75 hover:opacity-100 transition hover:text-white">
                           <Icon className="h-5 w-5" />
                         </a>
                       );
                     })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center opacity-75">
            &copy; {footer.showYear ? new Date().getFullYear() : ''} {footer.copyrightText || settings.siteName}.
          </div>
        </div>
      </footer>
    </div>
  );
};