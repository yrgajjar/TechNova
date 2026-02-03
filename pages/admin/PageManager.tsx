import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { CustomPage, Section } from '../../types';
import { Plus, Trash2, MoveUp, MoveDown, Save, ArrowLeft, Edit2 } from 'lucide-react';

export const PageManager: React.FC = () => {
  const { data, addPage, updatePage, deletePage } = useData();
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);

  // Editor State
  const [pageMeta, setPageMeta] = useState({ title: '', slug: '', description: '' });
  const [sections, setSections] = useState<Section[]>([]);

  const startCreate = () => {
    setEditingPage(null);
    setPageMeta({ title: '', slug: '', description: '' });
    setSections([]);
    setView('edit');
  };

  const startEdit = (page: CustomPage) => {
    setEditingPage(page);
    setPageMeta({ title: page.title, slug: page.slug, description: page.description || '' });
    setSections(page.sections || []);
    setView('edit');
  };

  const savePage = () => {
    const pageData: CustomPage = {
      id: editingPage ? editingPage.id : Date.now().toString(),
      ...pageMeta,
      sections,
      isPublished: true,
      isSystem: editingPage?.isSystem // Preserve system flag
    };

    if (editingPage) {
      updatePage(pageData);
    } else {
      addPage(pageData);
    }
    setView('list');
  };

  // Section Manipulation
  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      content: getInitialContent(type)
    };
    setSections([...sections, newSection]);
  };

  const getInitialContent = (type: Section['type']) => {
      switch(type) {
          case 'hero': return { title: 'New Hero', subtitle: 'Subtitle here', linkText: 'Button', linkUrl: '#' };
          case 'features': return { title: 'Features', items: [{ title: 'Feature 1', description: 'Desc' }] };
          case 'stats': return { items: [{ label: 'Stat 1', value: '100' }] };
          case 'services': return { title: 'Our Services', subtitle: 'Check out what we do' };
          case 'testimonials': return { title: 'Testimonials', items: [{ text: 'Great service!', author: 'John Doe', role: 'CEO' }] };
          case 'faq': return { title: 'FAQ', items: [{ question: 'Question?', answer: 'Answer.' }] };
          case 'process': return { title: 'Our Process', items: [{ title: 'Step 1', description: 'Description' }] };
          case 'cta': return { title: 'Call to Action', text: 'Sign up now', linkText: 'Go', linkUrl: '#' };
          case 'contact': return { title: 'Contact Us', text: 'Reach out anytime' };
          default: return { html: '<p>Content</p>' };
      }
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir >= sections.length) return;
    const newSections = [...sections];
    const temp = newSections[idx];
    newSections[idx] = newSections[idx + dir];
    newSections[idx + dir] = temp;
    setSections(newSections);
  };

  const updateSectionContent = (id: string, content: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, content } : s));
  };

  const renderSectionEditor = (section: Section, idx: number) => {
    const update = (newContent: any) => updateSectionContent(section.id, newContent);
    const c = section.content;

    switch(section.type) {
        case 'hero':
            return (
                <div className="space-y-3">
                   <input placeholder="Headline" className="w-full font-bold text-lg border-b pb-1 outline-none" value={c.title} onChange={e => update({...c, title: e.target.value})} />
                   <textarea placeholder="Subtitle" className="w-full border p-2 rounded" value={c.subtitle} onChange={e => update({...c, subtitle: e.target.value})} />
                   <div className="flex gap-2">
                      <input placeholder="Button Text" className="w-1/2 border p-2 rounded" value={c.linkText} onChange={e => update({...c, linkText: e.target.value})} />
                      <input placeholder="Button URL" className="w-1/2 border p-2 rounded" value={c.linkUrl} onChange={e => update({...c, linkUrl: e.target.value})} />
                   </div>
                   <input placeholder="Image URL (Optional)" className="w-full text-sm text-gray-400 border-b pb-1 outline-none" value={c.image || ''} onChange={e => update({...c, image: e.target.value})} />
                </div>
            );
        case 'services':
            return (
                <div>
                    <input className="font-bold border-b mb-2 w-full" value={c.title} onChange={e => update({...c, title: e.target.value})} placeholder="Section Title" />
                    <input className="border-b mb-4 w-full text-sm" value={c.subtitle} onChange={e => update({...c, subtitle: e.target.value})} placeholder="Subtitle" />
                    <p className="text-xs text-gray-500">Displays services from the Services module automatically.</p>
                </div>
            );
        case 'contact':
            return (
                <div>
                     <input className="font-bold border-b mb-2 w-full" value={c.title} onChange={e => update({...c, title: e.target.value})} placeholder="Section Title" />
                     <textarea className="w-full border p-2 rounded" value={c.text} onChange={e => update({...c, text: e.target.value})} placeholder="Intro text" />
                </div>
            );
        case 'features':
        case 'process':
             return (
                 <div>
                    <input className="font-bold border-b mb-4 w-full" value={c.title} onChange={e => update({...c, title: e.target.value})} placeholder="Section Title" />
                    {c.items?.map((item: any, i: number) => (
                        <div key={i} className="flex gap-2 mb-2 items-start">
                            <span className="mt-2 text-xs font-bold text-gray-400">{i+1}</span>
                            <div className="flex-1 space-y-1">
                                <input className="border p-1 rounded w-full text-sm font-bold" value={item.title} onChange={e => {
                                    const items = [...c.items]; items[i].title = e.target.value; update({...c, items});
                                }} placeholder="Title" />
                                <textarea className="border p-1 rounded w-full text-xs" value={item.description} onChange={e => {
                                    const items = [...c.items]; items[i].description = e.target.value; update({...c, items});
                                }} placeholder="Description" />
                            </div>
                            <button onClick={() => update({...c, items: c.items.filter((_:any, x:number) => x !== i)})} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    ))}
                    <button onClick={() => update({...c, items: [...(c.items||[]), {title: 'New', description: ''}]})} className="text-xs text-blue-600 font-bold">+ Add Item</button>
                 </div>
             );
         case 'faq':
              return (
                  <div>
                     <input className="font-bold border-b mb-4 w-full" value={c.title} onChange={e => update({...c, title: e.target.value})} placeholder="Section Title" />
                     {c.items?.map((item: any, i: number) => (
                         <div key={i} className="flex gap-2 mb-2 items-start">
                             <span className="mt-2 text-xs font-bold text-gray-400">Q</span>
                             <div className="flex-1 space-y-1">
                                 <input className="border p-1 rounded w-full text-sm font-bold" value={item.question} onChange={e => {
                                     const items = [...c.items]; items[i].question = e.target.value; update({...c, items});
                                 }} placeholder="Question" />
                                 <textarea className="border p-1 rounded w-full text-xs" value={item.answer} onChange={e => {
                                     const items = [...c.items]; items[i].answer = e.target.value; update({...c, items});
                                 }} placeholder="Answer" />
                             </div>
                             <button onClick={() => update({...c, items: c.items.filter((_:any, x:number) => x !== i)})} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                         </div>
                     ))}
                     <button onClick={() => update({...c, items: [...(c.items||[]), {question: 'New Question?', answer: ''}]})} className="text-xs text-blue-600 font-bold">+ Add Question</button>
                  </div>
              );
        case 'stats':
             return (
                 <div>
                     {c.items?.map((item: any, i: number) => (
                         <div key={i} className="flex gap-2 mb-2">
                             <input className="border p-1 rounded w-1/2" value={item.label} onChange={e => {
                                 const items = [...c.items]; items[i].label = e.target.value; update({...c, items});
                             }} placeholder="Label" />
                             <input className="border p-1 rounded w-1/2" value={item.value} onChange={e => {
                                 const items = [...c.items]; items[i].value = e.target.value; update({...c, items});
                             }} placeholder="Value (e.g. 50+)" />
                             <button onClick={() => update({...c, items: c.items.filter((_:any, x:number) => x !== i)})} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                         </div>
                     ))}
                     <button onClick={() => update({...c, items: [...(c.items||[]), {label: '', value: ''}]})} className="text-xs text-blue-600 font-bold">+ Add Stat</button>
                 </div>
             );
         case 'testimonials':
              return (
                  <div>
                      <input className="font-bold border-b mb-4 w-full" value={c.title} onChange={e => update({...c, title: e.target.value})} placeholder="Section Title" />
                      {c.items?.map((item: any, i: number) => (
                          <div key={i} className="bg-gray-50 p-2 rounded mb-2 text-sm relative">
                              <textarea className="w-full border p-1 rounded mb-1" value={item.text} onChange={e => {
                                  const items = [...c.items]; items[i].text = e.target.value; update({...c, items});
                              }} placeholder="Quote" />
                              <div className="flex gap-2">
                                  <input className="w-1/2 border p-1 rounded" value={item.author} onChange={e => {
                                      const items = [...c.items]; items[i].author = e.target.value; update({...c, items});
                                  }} placeholder="Author" />
                                  <input className="w-1/2 border p-1 rounded" value={item.role} onChange={e => {
                                      const items = [...c.items]; items[i].role = e.target.value; update({...c, items});
                                  }} placeholder="Role" />
                              </div>
                              <button onClick={() => update({...c, items: c.items.filter((_:any, x:number) => x !== i)})} className="absolute top-1 right-1 text-red-500"><Trash2 className="h-3 w-3" /></button>
                          </div>
                      ))}
                      <button onClick={() => update({...c, items: [...(c.items||[]), {text: '', author: '', role: ''}]})} className="text-xs text-blue-600 font-bold">+ Add Testimonial</button>
                  </div>
              );
        case 'text':
        case 'html':
            return (
                <textarea className="w-full border p-2 rounded font-mono text-sm h-32" 
                   placeholder="Enter HTML or Content..."
                   value={c.html || ''}
                   onChange={e => update({...c, html: e.target.value})} />
            );
        case 'cta':
            return (
                <div className="space-y-3">
                   <input className="w-full font-bold border rounded p-2" placeholder="Title" value={c.title || ''} onChange={e => update({...c, title: e.target.value})} />
                   <textarea className="w-full border rounded p-2" placeholder="Text" value={c.text || ''} onChange={e => update({...c, text: e.target.value})} />
                   <div className="flex gap-2">
                     <input className="w-1/2 border rounded p-2" placeholder="Button Label" value={c.linkText || ''} onChange={e => update({...c, linkText: e.target.value})} />
                     <input className="w-1/2 border rounded p-2" placeholder="Link URL" value={c.linkUrl || ''} onChange={e => update({...c, linkUrl: e.target.value})} />
                   </div>
                 </div>
            );
        default: return null;
    }
  };

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Pages & Content</h2>
          <button onClick={startCreate} className="bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg hover:bg-brand-700 transition">
            <Plus className="h-4 w-4 mr-2" /> New Page
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
          {data.pages.sort((a,b) => (a.isSystem === b.isSystem) ? 0 : a.isSystem ? -1 : 1).map(page => (
            <div key={page.id} className={`p-4 flex justify-between items-center ${page.isSystem ? 'bg-blue-50/50' : ''}`}>
              <div className="flex items-center gap-3">
                {page.isSystem && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">System</span>}
                <div>
                    <h3 className="font-bold text-gray-900">{page.title}</h3>
                    <span className="text-xs text-gray-500">/{page.slug}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(page)} className="text-brand-600 px-3 py-1 hover:bg-brand-50 rounded flex items-center font-medium">
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                </button>
                {!page.isSystem && (
                    <button onClick={() => { if(window.confirm('Delete?')) deletePage(page.id) }} className="text-red-600 px-3 py-1 hover:bg-red-50 rounded flex items-center">
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </button>
                )}
              </div>
            </div>
          ))}
          {data.pages.length === 0 && <div className="p-8 text-center text-gray-500">No pages found.</div>}
        </div>
      </div>
    );
  }

  // Edit View
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between sticky top-0 bg-gray-100 py-4 z-20 border-b border-gray-200">
        <button onClick={() => setView('list')} className="text-gray-500 flex items-center hover:text-gray-900 font-medium">
           <ArrowLeft className="h-4 w-4 mr-1" /> Back to Pages
        </button>
        <h2 className="text-xl font-bold">{editingPage ? `Edit: ${editingPage.title}` : 'Create Page'}</h2>
        <button onClick={savePage} className="bg-brand-600 text-white px-6 py-2 rounded-lg flex items-center shadow-lg hover:bg-brand-700">
           <Save className="h-4 w-4 mr-2" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Settings & Toolbox */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="font-bold border-b pb-2 text-gray-800">Page Settings</h3>
              <div>
                 <label className="block text-sm font-medium mb-1">Title</label>
                 <input className="w-full border p-2 rounded" value={pageMeta.title} onChange={e => setPageMeta({...pageMeta, title: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1">Slug</label>
                 <input disabled={editingPage?.isSystem} className={`w-full border p-2 rounded ${editingPage?.isSystem ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`} value={pageMeta.slug} onChange={e => setPageMeta({...pageMeta, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} />
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1">Description</label>
                 <textarea className="w-full border p-2 rounded" rows={2} value={pageMeta.description} onChange={e => setPageMeta({...pageMeta, description: e.target.value})} />
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
              <h3 className="font-bold border-b pb-2 mb-4 text-gray-800">Add Section</h3>
              <div className="grid grid-cols-2 gap-2">
                 {[
                     'hero', 'text', 'services', 
                     'features', 'stats', 'process', 'faq',
                     'testimonials', 'cta', 'contact', 'html'
                 ].map(type => (
                    <button key={type} onClick={() => addSection(type as any)} className="text-sm bg-gray-50 hover:bg-brand-50 hover:text-brand-700 border hover:border-brand-200 p-2 rounded capitalize text-left transition">
                       + {type}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Section Editor */}
        <div className="lg:col-span-8 space-y-6">
           {sections.map((section, idx) => (
             <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                   <div className="flex items-center gap-2">
                       <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{section.type}</span>
                       <span className="text-xs text-gray-400">ID: {section.id}</span>
                   </div>
                   <div className="flex items-center space-x-1 opacity-100 lg:opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveSection(idx, -1)} className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><MoveUp className="h-4 w-4" /></button>
                      <button onClick={() => moveSection(idx, 1)} className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><MoveDown className="h-4 w-4" /></button>
                      <button onClick={() => removeSection(section.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500 ml-2"><Trash2 className="h-4 w-4" /></button>
                   </div>
                </div>
                <div className="p-5">
                    {renderSectionEditor(section, idx)}
                </div>
             </div>
           ))}
           {sections.length === 0 && (
               <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                   <p className="mb-2 font-medium">This page is empty.</p>
                   <p className="text-sm">Click a section type on the left to start building.</p>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};