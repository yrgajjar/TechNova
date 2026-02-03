import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { Calendar, User, Search, Tag, ArrowRight } from 'lucide-react';
import { BlogSettings } from '../../types';

export const BlogList: React.FC = () => {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use settings or default
  const settings: BlogSettings = data.blogSettings || {
      layout: 'grid',
      showSidebar: true,
      postsPerPage: 6,
      sidebarTitle: 'Explore'
  };

  const allPosts = data.blogPosts?.filter(p => p.isPublished).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
  
  // Filter logic
  const filteredPosts = allPosts.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.tags?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Derive tags for sidebar
  const allTags = Array.from(new Set(allPosts.flatMap(p => p.tags ? p.tags.split(',').map(t => t.trim()) : []))).slice(0, 10);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">Latest news, insights, and technology trends.</p>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className={`grid gap-12 ${settings.showSidebar ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>
            
            {/* Main Content Area */}
            <div className={`${settings.showSidebar ? 'lg:col-span-8' : ''}`}>
                {filteredPosts.length > 0 ? (
                    <div className={
                        settings.layout === 'grid' 
                            ? `grid grid-cols-1 ${settings.showSidebar ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8`
                            : 'space-y-8'
                    }>
                        {filteredPosts.map(post => (
                            <div key={post.id} className={`group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex ${settings.layout === 'list' ? 'flex-col md:flex-row' : 'flex-col h-full'}`}>
                                {/* Image */}
                                {post.coverImage && (
                                    <div className={`overflow-hidden ${settings.layout === 'list' ? 'md:w-1/3 min-h-[200px]' : 'h-48'}`}>
                                        <Link to={`/blog/${post.slug}`}>
                                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        </Link>
                                    </div>
                                )}
                                
                                {/* Content */}
                                <div className={`p-6 flex flex-col flex-grow ${settings.layout === 'list' ? 'md:w-2/3' : ''}`}>
                                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                                        <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {new Date(post.date).toLocaleDateString()}</span>
                                        <span className="flex items-center"><User className="h-3 w-3 mr-1" /> {post.author}</span>
                                    </div>
                                    <Link to={`/blog/${post.slug}`}>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition mb-3">{post.title}</h3>
                                    </Link>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                                    
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                        {post.tags ? (
                                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{post.tags.split(',')[0]}</span>
                                        ) : <span></span>}
                                        <Link to={`/blog/${post.slug}`} className="text-brand-600 font-bold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                                            Read Article <ArrowRight className="h-3 w-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-900">No Posts Found</h3>
                        <p className="text-gray-500">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>

            {/* Sidebar Widget Area */}
            {settings.showSidebar && (
                <div className="lg:col-span-4 space-y-8">
                    {/* Search Widget */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4">{settings.sidebarTitle || 'Explore'}</h4>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search articles..." 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Tags Widget */}
                    {allTags.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4">Topics</h4>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => (
                                    <button 
                                        key={tag} 
                                        onClick={() => setSearchTerm(tag)}
                                        className="text-xs bg-gray-50 hover:bg-brand-50 text-gray-600 hover:text-brand-600 px-3 py-1.5 rounded-full transition border border-gray-200"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Posts Widget */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4">Recent Posts</h4>
                        <div className="space-y-4">
                            {allPosts.slice(0, 4).map(post => (
                                <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-3 group">
                                    {post.coverImage && (
                                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                            <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                        </div>
                                    )}
                                    <div>
                                        <h5 className="text-sm font-bold text-gray-900 group-hover:text-brand-600 line-clamp-2 transition">{post.title}</h5>
                                        <span className="text-xs text-gray-400 mt-1 block">{new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};