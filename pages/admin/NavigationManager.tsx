import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { HeaderConfig, FooterConfig, NavItem, FooterColumn, FooterLink } from '../../types';
import { Save, Plus, Trash2, MoveUp, MoveDown, LayoutTemplate, PanelTop, ChevronRight, CornerDownRight, Settings } from 'lucide-react';

export const NavigationManager: React.FC = () => {
  const { data, updateHeader, updateFooter } = useData();
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  
  // Local state for forms
  const [headerForm, setHeaderForm] = useState<HeaderConfig>(data.header);
  const [footerForm, setFooterForm] = useState<FooterConfig>(data.footer);

  // --- HEADER HANDLERS ---
  const saveHeader = () => {
    updateHeader(headerForm);
    alert('Header configuration saved!');
  };

  const addMenuItem = () => {
    const newItem: NavItem = {
      id: Date.now().toString(),
      label: 'New Menu',
      path: '/',
      isExternal: false,
      isOpenInNewTab: false,
      isEnabled: true,
      children: []
    };
    setHeaderForm({ ...headerForm, items: [...headerForm.items, newItem] });
  };

  // Generic Recursive Update
  const updateItemRecursive = (items: NavItem[], id: string, updates: Partial<NavItem>): NavItem[] => {
      return items.map(item => {
          if (item.id === id) {
              return { ...item, ...updates };
          }
          if (item.children) {
              return { ...item, children: updateItemRecursive(item.children, id, updates) };
          }
          return item;
      });
  };

  // Add Child
  const addChildItem = (parentId: string) => {
      const newItem: NavItem = {
          id: Date.now().toString(),
          label: 'New Link',
          path: '/',
          isEnabled: true,
          children: []
      };
      
      const addRecursive = (items: NavItem[]): NavItem[] => {
          return items.map(item => {
              if (item.id === parentId) {
                  return { ...item, children: [...(item.children || []), newItem] };
              }
              if (item.children) {
                  return { ...item, children: addRecursive(item.children) };
              }
              return item;
          });
      };
      
      setHeaderForm({ ...headerForm, items: addRecursive(headerForm.items) });
  };

  const removeItem = (id: string) => {
      const removeRecursive = (items: NavItem[]): NavItem[] => {
          return items.filter(item => item.id !== id).map(item => ({
              ...item,
              children: item.children ? removeRecursive(item.children) : []
          }));
      };
      setHeaderForm({ ...headerForm, items: removeRecursive(headerForm.items) });
  };

  const handleUpdate = (id: string, updates: Partial<NavItem>) => {
      setHeaderForm({ ...headerForm, items: updateItemRecursive(headerForm.items, id, updates) });
  };

  const moveItem = (index: number, dir: number, parentId: string | null) => {
      // Helper to move item in array
      const moveInArray = (arr: NavItem[]) => {
          const newArr = [...arr];
          if (index + dir < 0 || index + dir >= newArr.length) return newArr;
          const temp = newArr[index];
          newArr[index] = newArr[index + dir];
          newArr[index + dir] = temp;
          return newArr;
      };

      if (!parentId) {
          setHeaderForm({ ...headerForm, items: moveInArray(headerForm.items) });
      } else {
          const updateChildrenMove = (items: NavItem[]): NavItem[] => {
              return items.map(item => {
                  if (item.id === parentId && item.children) {
                      return { ...item, children: moveInArray(item.children) };
                  }
                  if (item.children) {
                      return { ...item, children: updateChildrenMove(item.children) };
                  }
                  return item;
              });
          };
          setHeaderForm({ ...headerForm, items: updateChildrenMove(headerForm.items) });
      }
  };

  // --- FOOTER HANDLERS ---
  const saveFooter = () => {
    updateFooter(footerForm);
    alert('Footer configuration saved!');
  };

  const addFooterColumn = () => {
    const newCol: FooterColumn = {
      id: Date.now().toString(),
      title: 'New Column',
      type: 'text',
      content: 'Column content...'
    };
    setFooterForm({ ...footerForm, columns: [...footerForm.columns, newCol] });
  };

  const updateFooterColumn = (idx: number, updates: Partial<FooterColumn>) => {
    const newCols = [...footerForm.columns];
    newCols[idx] = { ...newCols[idx], ...updates };
    setFooterForm({ ...footerForm, columns: newCols });
  };

  const removeFooterColumn = (idx: number) => {
    setFooterForm({ ...footerForm, columns: footerForm.columns.filter((_, i) => i !== idx) });
  };

  const addFooterLink = (colIdx: number) => {
    const col = footerForm.columns[colIdx];
    const newLink: FooterLink = { label: 'Link', url: '#' };
    const newLinks = [...(col.links || []), newLink];
    updateFooterColumn(colIdx, { links: newLinks });
  };

  const updateFooterLink = (colIdx: number, linkIdx: number, field: keyof FooterLink, val: string) => {
    const col = footerForm.columns[colIdx];
    const newLinks = [...(col.links || [])];
    newLinks[linkIdx] = { ...newLinks[linkIdx], [field]: val };
    updateFooterColumn(colIdx, { links: newLinks });
  };

  const removeFooterLink = (colIdx: number, linkIdx: number) => {
    const col = footerForm.columns[colIdx];
    const newLinks = col.links?.filter((_, i) => i !== linkIdx);
    updateFooterColumn(colIdx, { links: newLinks });
  };

  // Recursive Item Component
  const NavItemEditor: React.FC<{ item: NavItem, depth: number, index: number, parentId: string | null }> = ({ item, depth, index, parentId }) => {
      const isMegaMenuParent = item.isMegaMenu && depth === 0;
      const isMegaColumn = depth === 1 && parentId && headerForm.items.find(i => i.id === parentId)?.isMegaMenu;

      return (
          <div className="mb-2">
              <div className={`flex gap-2 items-center p-3 rounded border ${depth === 0 ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200 ml-6'}`}>
                  <div className="flex flex-col gap-1">
                      <button onClick={() => moveItem(index, -1, parentId)} className="text-gray-400 hover:text-gray-700 p-0.5"><MoveUp className="h-3 w-3" /></button>
                      <button onClick={() => moveItem(index, 1, parentId)} className="text-gray-400 hover:text-gray-700 p-0.5"><MoveDown className="h-3 w-3" /></button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                      <div className="md:col-span-3">
                          <label className="text-[10px] uppercase font-bold text-gray-400 block">{isMegaColumn ? 'Column Title' : 'Label'}</label>
                          <input className="border p-1.5 rounded text-sm w-full font-medium" value={item.label} onChange={e => handleUpdate(item.id, { label: e.target.value })} />
                      </div>
                      
                      {!isMegaColumn && (
                          <div className="md:col-span-4">
                              <label className="text-[10px] uppercase font-bold text-gray-400 block">Path</label>
                              <input className="border p-1.5 rounded text-sm w-full font-mono" value={item.path || ''} onChange={e => handleUpdate(item.id, { path: e.target.value })} placeholder={item.children?.length ? 'Optional' : 'Required'} />
                          </div>
                      )}

                      {depth === 0 && (
                          <div className="md:col-span-2 flex items-center">
                              <label className={`flex items-center space-x-1 cursor-pointer p-1.5 rounded ${item.isMegaMenu ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}>
                                  <input type="checkbox" checked={item.isMegaMenu || false} onChange={e => handleUpdate(item.id, { isMegaMenu: e.target.checked })} />
                                  <span className="text-xs font-bold">Mega Menu</span>
                              </label>
                          </div>
                      )}

                      <div className={`md:col-span-3 flex justify-end items-center gap-2 ${isMegaColumn ? 'md:col-start-10' : ''}`}>
                          <label className="flex items-center text-xs"><input type="checkbox" className="mr-1" checked={item.isEnabled} onChange={e => handleUpdate(item.id, { isEnabled: e.target.checked })} /> On</label>
                          <button onClick={() => removeItem(item.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                      </div>
                  </div>
              </div>

              {/* Recursive Children */}
              <div className="border-l-2 border-gray-100 ml-6 pl-2 mt-2">
                  {item.children?.map((child, idx) => (
                      <NavItemEditor key={child.id} item={child} depth={depth + 1} index={idx} parentId={item.id} />
                  ))}
                  
                  {(depth < 2) && ( // Limit nesting to 3 levels (0, 1, 2)
                      <button onClick={() => addChildItem(item.id)} className="ml-6 text-xs text-brand-600 font-bold flex items-center hover:underline mt-2">
                          <Plus className="h-3 w-3 mr-1" /> 
                          {isMegaMenuParent ? 'Add Mega Menu Column' : (isMegaColumn ? 'Add Link to Column' : 'Add Sub Item')}
                      </button>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-gray-900">Navigation & Footer</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="flex border-b">
            <button onClick={() => setActiveTab('header')} className={`flex-1 py-4 font-bold flex items-center justify-center ${activeTab === 'header' ? 'text-brand-600 bg-brand-50 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'}`}>
               <PanelTop className="h-5 w-5 mr-2" /> Header Menu
            </button>
            <button onClick={() => setActiveTab('footer')} className={`flex-1 py-4 font-bold flex items-center justify-center ${activeTab === 'footer' ? 'text-brand-600 bg-brand-50 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'}`}>
               <LayoutTemplate className="h-5 w-5 mr-2" /> Footer Layout
            </button>
         </div>

         <div className="p-6">
            {/* --- HEADER EDITOR --- */}
            {activeTab === 'header' && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div>
                       <label className="block text-sm font-bold mb-1">Logo Text</label>
                       <input className="w-full border p-2 rounded" value={headerForm.logoText} onChange={e => setHeaderForm({...headerForm, logoText: e.target.value})} />
                    </div>
                    <div>
                       <label className="block text-sm font-bold mb-1">Logo Image URL</label>
                       <input className="w-full border p-2 rounded" placeholder="https://..." value={headerForm.logoUrl} onChange={e => setHeaderForm({...headerForm, logoUrl: e.target.value})} />
                    </div>
                    <div className="flex gap-4">
                       <div className="flex-1">
                          <label className="block text-sm font-bold mb-1">Background</label>
                          <div className="flex gap-2">
                             <input type="color" className="h-10 w-10 p-0 border rounded overflow-hidden" value={headerForm.backgroundColor} onChange={e => setHeaderForm({...headerForm, backgroundColor: e.target.value})} />
                             <input className="flex-1 border p-2 rounded" value={headerForm.backgroundColor} onChange={e => setHeaderForm({...headerForm, backgroundColor: e.target.value})} />
                          </div>
                       </div>
                       <div className="flex-1">
                          <label className="block text-sm font-bold mb-1">Text Color</label>
                          <div className="flex gap-2">
                             <input type="color" className="h-10 w-10 p-0 border rounded overflow-hidden" value={headerForm.textColor} onChange={e => setHeaderForm({...headerForm, textColor: e.target.value})} />
                             <input className="flex-1 border p-2 rounded" value={headerForm.textColor} onChange={e => setHeaderForm({...headerForm, textColor: e.target.value})} />
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-4">
                       <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={headerForm.isSticky} onChange={e => setHeaderForm({...headerForm, isSticky: e.target.checked})} className="rounded text-brand-600" />
                          <span className="text-sm font-medium">Sticky Header</span>
                       </label>
                       <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={headerForm.showMobileMenu} onChange={e => setHeaderForm({...headerForm, showMobileMenu: e.target.checked})} className="rounded text-brand-600" />
                          <span className="text-sm font-medium">Enable Mobile Menu</span>
                       </label>
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-lg">Menu Structure</h3>
                       <button onClick={addMenuItem} className="text-sm bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-100 font-bold flex items-center">
                          <Plus className="h-4 w-4 mr-1" /> Add Top Level Menu
                       </button>
                    </div>
                    <div className="space-y-4">
                       {headerForm.items.map((item, idx) => (
                          <NavItemEditor key={item.id} item={item} depth={0} index={idx} parentId={null} />
                       ))}
                       {headerForm.items.length === 0 && <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-xl">No menu items. Add one above.</div>}
                    </div>
                 </div>

                 <div className="flex justify-end pt-4 border-t">
                    <button onClick={saveHeader} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 flex items-center">
                       <Save className="h-4 w-4 mr-2" /> Save Header Changes
                    </button>
                 </div>
              </div>
            )}

            {/* --- FOOTER EDITOR --- */}
            {activeTab === 'footer' && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-1">Background Color</label>
                        <div className="flex gap-2">
                            <input type="color" className="h-10 w-10 p-0 border rounded overflow-hidden" value={footerForm.backgroundColor} onChange={e => setFooterForm({...footerForm, backgroundColor: e.target.value})} />
                            <input className="flex-1 border p-2 rounded" value={footerForm.backgroundColor} onChange={e => setFooterForm({...footerForm, backgroundColor: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-1">Text Color</label>
                        <div className="flex gap-2">
                            <input type="color" className="h-10 w-10 p-0 border rounded overflow-hidden" value={footerForm.textColor} onChange={e => setFooterForm({...footerForm, textColor: e.target.value})} />
                            <input className="flex-1 border p-2 rounded" value={footerForm.textColor} onChange={e => setFooterForm({...footerForm, textColor: e.target.value})} />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold mb-1">Copyright Text</label>
                       <input className="w-full border p-2 rounded" value={footerForm.copyrightText} onChange={e => setFooterForm({...footerForm, copyrightText: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                       <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={footerForm.showYear} onChange={e => setFooterForm({...footerForm, showYear: e.target.checked})} className="rounded text-brand-600" />
                          <span className="text-sm font-medium">Auto-append Current Year</span>
                       </label>
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-lg">Footer Columns (Max 4 recommended)</h3>
                       <button onClick={addFooterColumn} className="text-sm bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-100 font-bold flex items-center">
                          <Plus className="h-4 w-4 mr-1" /> Add Column
                       </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {footerForm.columns.map((col, idx) => (
                          <div key={col.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                             <div className="flex justify-between items-start mb-3">
                                <div className="space-y-2 flex-1 mr-4">
                                   <input className="w-full border p-1 rounded font-bold text-sm" placeholder="Column Title" value={col.title} onChange={e => updateFooterColumn(idx, { title: e.target.value })} />
                                   <select className="w-full border p-1 rounded text-xs" value={col.type} onChange={e => updateFooterColumn(idx, { type: e.target.value as any })}>
                                      <option value="text">Text / About</option>
                                      <option value="links">Link List</option>
                                      <option value="contact">Contact Details</option>
                                      <option value="social">Social Icons</option>
                                   </select>
                                </div>
                                <button onClick={() => removeFooterColumn(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                             </div>

                             {col.type === 'text' && (
                                <textarea className="w-full border p-2 rounded text-xs h-20" placeholder="Content text..." value={col.content || ''} onChange={e => updateFooterColumn(idx, { content: e.target.value })} />
                             )}

                             {(col.type === 'links' || col.type === 'social') && (
                                <div className="space-y-2">
                                   {col.links?.map((link, lIdx) => (
                                      <div key={lIdx} className="flex gap-1">
                                         <input className="flex-1 border p-1 rounded text-xs" placeholder={col.type === 'social' ? 'Platform (e.g. Twitter)' : 'Label'} value={link.label} onChange={e => updateFooterLink(idx, lIdx, 'label', e.target.value)} />
                                         <input className="flex-1 border p-1 rounded text-xs" placeholder="URL" value={link.url} onChange={e => updateFooterLink(idx, lIdx, 'url', e.target.value)} />
                                         <button onClick={() => removeFooterLink(idx, lIdx)} className="text-red-400"><Trash2 className="h-3 w-3" /></button>
                                      </div>
                                   ))}
                                   <button onClick={() => addFooterLink(idx)} className="text-xs text-brand-600 hover:underline">+ Add Link</button>
                                </div>
                             )}
                             
                             {col.type === 'contact' && (
                                <p className="text-xs text-gray-500 italic p-2 border border-dashed rounded bg-white">
                                   Automatically displays contact info from Settings.
                                </p>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex justify-end pt-4 border-t">
                    <button onClick={saveFooter} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 flex items-center">
                       <Save className="h-4 w-4 mr-2" /> Save Footer Changes
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};