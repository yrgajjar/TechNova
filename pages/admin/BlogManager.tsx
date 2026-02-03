import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BlogPost, BlogSettings, BlogAuthor } from '../../types';
import { Plus, Trash2, Edit2, Save, X, LayoutGrid, List, Columns, Settings, UserPlus, Link as LinkIcon, Check } from 'lucide-react';
import { RichTextEditor } from '../../components/RichTextEditor';

export const BlogManager: React.FC = () => {
  const { data, addBlogPost, updateBlogPost, deleteBlogPost, updateBlogSettings } = useData();
  const [activeTab, setActiveTab] = useState<'posts' | 'settings'>('posts');
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  // Fallback defaults if blogSettings doesn't exist yet
  const settings: BlogSettings = data.blogSettings || {
    layout: 'grid',
    showSidebar: true,
    postsPerPage: 6,
    sidebarTitle: 'Explore'
  };

  const savePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const postData: BlogPost = {
      id: editingPost.id || Date.now().toString(),
      title: editingPost.title || 'Untitled',
      slug: editingPost.slug || 'untitled',
      excerpt: editingPost.excerpt || '',
      content: editingPost.content || '',
      author: editingPost.author || 'Admin',
      authors: editingPost.authors || [], 
      relatedPostIds: editingPost.relatedPostIds || [], // Save related posts
      date: editingPost.date || new Date().toISOString(),
      isPublished: editingPost.isPublished ?? true,
      coverImage: editingPost.coverImage,
      imageCaption: editingPost.imageCaption,
      tags: editingPost.tags
    };

    if (editingPost.id) updateBlogPost(postData);
    else addBlogPost(postData);
    setEditingPost(null);
  };

  const handleSettingsSave = (newSettings: BlogSettings) => {
    updateBlogSettings(newSettings);
  };

  // Author Management within Post
  const addAuthor = () => {
      const newAuthor: BlogAuthor = { name: 'New Author', role: 'Role', avatar: '' };
      setEditingPost({
          ...editingPost,
          authors: [...(editingPost?.authors || []), newAuthor]
      });
  };

  const updateAuthor = (idx: number, field: keyof BlogAuthor, val: string) => {
      if (!editingPost?.authors) return;
      const newAuthors = [...editingPost.authors];
      newAuthors[idx] = { ...newAuthors[idx], [field]: val };
      setEditingPost({ ...editingPost, authors: newAuthors });
  };

  const removeAuthor = (idx: number) => {
      if (!editingPost?.authors) return;
      const newAuthors = editingPost.authors.filter((_, i) => i !== idx);
      setEditingPost({ ...editingPost, authors: newAuthors });
  };

  // Related Post Toggle
  const toggleRelatedPost = (postId: string) => {
      const current = editingPost?.relatedPostIds || [];
      const updated = current.includes(postId) 
          ? current.filter(id => id !== postId)
          : [...current, postId];
      setEditingPost({ ...editingPost, relatedPostIds: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Blog Manager</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
             <button onClick={() => setActiveTab('posts')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'posts' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                Posts
             </button>
             <button onClick={() => setActiveTab('settings')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'settings' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                <Settings className="h-3 w-3 mr-1" /> Settings
             </button>
        </div>
      </div>

      {activeTab === 'posts' && (
        <>
            <div className="flex justify-end">
                {!editingPost && (
                    <button onClick={() => setEditingPost({ authors: [], relatedPostIds: [] })} className="bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-brand-700">
                        <Plus className="h-4 w-4 mr-2" /> New Post
                    </button>
                )}
            </div>

            {editingPost ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">{editingPost.id ? 'Edit Post' : 'Create New Post'}</h3>
                    <button onClick={() => setEditingPost(null)} className="text-gray-500 hover:text-gray-800"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={savePost} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Title</label>
                            <input required className="w-full border p-2 rounded" value={editingPost.title || ''} onChange={e => setEditingPost({...editingPost, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Slug</label>
                            <input required className="w-full border p-2 rounded" value={editingPost.slug || ''} onChange={e => setEditingPost({...editingPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} />
                        </div>
                    </div>
                    
                    {/* Authors Section */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-bold">Authors</label>
                            <button type="button" onClick={addAuthor} className="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 flex items-center">
                                <UserPlus className="h-3 w-3 mr-1" /> Add Author
                            </button>
                        </div>
                        <div className="space-y-3">
                            {editingPost.authors?.map((author, idx) => (
                                <div key={idx} className="flex gap-2 items-start">
                                    <img src={author.avatar || 'https://via.placeholder.com/40'} className="h-8 w-8 rounded-full bg-gray-200 object-cover" />
                                    <div className="flex-1 grid grid-cols-3 gap-2">
                                        <input className="border p-1 rounded text-sm" placeholder="Name" value={author.name} onChange={e => updateAuthor(idx, 'name', e.target.value)} />
                                        <input className="border p-1 rounded text-sm" placeholder="Role/Title" value={author.role} onChange={e => updateAuthor(idx, 'role', e.target.value)} />
                                        <input className="border p-1 rounded text-sm" placeholder="Avatar URL" value={author.avatar} onChange={e => updateAuthor(idx, 'avatar', e.target.value)} />
                                    </div>
                                    <button type="button" onClick={() => removeAuthor(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            ))}
                            {(!editingPost.authors || editingPost.authors.length === 0) && (
                                <div className="text-xs text-gray-500 italic">No detailed authors added. Will use legacy author field.</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Excerpt (Short description)</label>
                        <textarea className="w-full border p-2 rounded" rows={2} value={editingPost.excerpt || ''} onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        {/* WYSIWYG Editor */}
                        <RichTextEditor 
                            value={editingPost.content || ''} 
                            onChange={(html) => setEditingPost({...editingPost, content: html})} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Cover Image URL</label>
                            <input className="w-full border p-2 rounded" value={editingPost.coverImage || ''} onChange={e => setEditingPost({...editingPost, coverImage: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Image Caption (Optional)</label>
                            <input className="w-full border p-2 rounded" value={editingPost.imageCaption || ''} onChange={e => setEditingPost({...editingPost, imageCaption: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tags (comma separated)</label>
                        <input className="w-full border p-2 rounded" value={editingPost.tags || ''} onChange={e => setEditingPost({...editingPost, tags: e.target.value})} />
                    </div>

                    {/* Related Posts Section - The "Last ma option" */}
                    <div className="border-t pt-4 mt-4">
                        <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                            <LinkIcon className="h-4 w-4 mr-2" /> Related Articles (Must Read)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-gray-50 p-3 rounded border">
                            {data.blogPosts
                                ?.filter(p => p.id !== editingPost.id) // Exclude self
                                .map(p => {
                                    const isSelected = editingPost.relatedPostIds?.includes(p.id);
                                    return (
                                        <div 
                                            key={p.id} 
                                            onClick={() => toggleRelatedPost(p.id)}
                                            className={`p-2 rounded border cursor-pointer flex items-center justify-between transition-colors ${isSelected ? 'bg-brand-50 border-brand-500' : 'bg-white border-gray-200 hover:bg-gray-100'}`}
                                        >
                                            <span className="text-sm truncate mr-2">{p.title}</span>
                                            {isSelected && <Check className="h-4 w-4 text-brand-600 flex-shrink-0" />}
                                        </div>
                                    );
                                })}
                            {(!data.blogPosts || data.blogPosts.length <= 1) && (
                                <p className="text-xs text-gray-500">No other posts available to link.</p>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Select articles to appear in the "Read Also" section at the bottom of the post.</p>
                    </div>

                    <div className="flex items-center gap-4 border-t pt-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked={editingPost.isPublished ?? true} onChange={e => setEditingPost({...editingPost, isPublished: e.target.checked})} className="rounded text-brand-600 focus:ring-brand-500" />
                            <span className="font-medium">Published</span>
                        </label>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 shadow-lg transition transform active:scale-95">Save Post</button>
                    </div>
                </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                {data.blogPosts?.map(post => (
                    <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">{post.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()} • {post.isPublished ? 'Published' : 'Draft'}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingPost(post)} className="text-brand-600 p-2 hover:bg-brand-50 rounded"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => { if(window.confirm('Delete post?')) deleteBlogPost(post.id) }} className="text-red-600 p-2 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    </div>
                ))}
                {(!data.blogPosts || data.blogPosts.length === 0) && <p className="text-center text-gray-500 py-10">No blog posts found.</p>}
                </div>
            )}
        </>
      )}

      {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
              <h3 className="text-lg font-bold mb-6">Blog Layout Configuration</h3>
              
              <div className="space-y-6">
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Layout Style</label>
                      <div className="grid grid-cols-2 gap-4">
                          <button 
                             onClick={() => handleSettingsSave({...settings, layout: 'grid'})}
                             className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-all ${settings.layout === 'grid' ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                              <LayoutGrid className="h-8 w-8 mb-2" />
                              <span className="font-medium">Grid (Tile) View</span>
                          </button>
                          <button 
                             onClick={() => handleSettingsSave({...settings, layout: 'list'})}
                             className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-all ${settings.layout === 'list' ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                              <List className="h-8 w-8 mb-2" />
                              <span className="font-medium">List View</span>
                          </button>
                      </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div className="flex items-center">
                          <Columns className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                              <p className="font-bold text-gray-900">Enable Sidebar</p>
                              <p className="text-xs text-gray-500">Show Search, Recent Posts, and Tags widget.</p>
                          </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={settings.showSidebar} onChange={e => handleSettingsSave({...settings, showSidebar: e.target.checked})} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                  </div>
                  
                  {settings.showSidebar && (
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Sidebar Title</label>
                          <input 
                             className="w-full border p-2 rounded-lg" 
                             value={settings.sidebarTitle || 'Explore'} 
                             onChange={e => handleSettingsSave({...settings, sidebarTitle: e.target.value})} 
                          />
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};