import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw, Database, Lock, Globe, Palette, ToggleLeft, Save, Upload, Download, Image as ImageIcon, Users, Trash2, Plus } from 'lucide-react';
import { GlobalSettings, User } from '../../types';

export const Settings: React.FC = () => {
  const { data, updateSettings, updateFooter, resetData, importData, exportData, addUser, deleteUser } = useData();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'theme' | 'users' | 'data'>('general');

  // Form States
  const [settingsForm, setSettingsForm] = useState<GlobalSettings>(data.settings);
  const [copyrightText, setCopyrightText] = useState(data.footer.copyrightText);
  const [msg, setMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // User Form
  const [newUser, setNewUser] = useState<Partial<User>>({ username: '', password: '', email: '', role: 'employee' });

  const showToast = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleSettingsSave = () => {
    updateSettings(settingsForm);
    // Also save copyright since it's on this tab
    const newFooter = { ...data.footer, copyrightText };
    updateFooter(newFooter);
    showToast('Global settings updated successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importData(event.target?.result as string);
      if (success) showToast('Data imported successfully!');
      else alert('Invalid JSON file.');
    };
    reader.readAsText(file);
  };

  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      if(newUser.username && newUser.password) {
          addUser({
              id: Date.now().toString(),
              username: newUser.username,
              password: newUser.password,
              email: newUser.email || '',
              role: newUser.role as 'admin' | 'employee',
              isAuthenticated: false
          });
          setNewUser({ username: '', password: '', email: '', role: 'employee' });
          showToast('User added successfully!');
      }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
         {msg && <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">{msg}</div>}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'general', label: 'General & Features', icon: Globe },
          { id: 'theme', label: 'Appearance', icon: Palette },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'data', label: 'Data Management', icon: Database },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* GENERAL TAB */}
      {activeTab === 'general' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
           <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Site Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Site Name</label>
                    <input className="w-full border p-2 rounded" value={settingsForm.siteName} onChange={e => setSettingsForm({...settingsForm, siteName: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                    <input className="w-full border p-2 rounded" value={settingsForm.contactEmail} onChange={e => setSettingsForm({...settingsForm, contactEmail: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Logo URL</label>
                    <div className="flex gap-2">
                       <input className="w-full border p-2 rounded" placeholder="https://..." value={settingsForm.logoUrl || ''} onChange={e => setSettingsForm({...settingsForm, logoUrl: e.target.value})} />
                       {settingsForm.logoUrl && <img src={settingsForm.logoUrl} className="h-10 w-10 object-contain border p-1 rounded" alt="logo" />}
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Favicon URL</label>
                    <div className="flex gap-2">
                        <input className="w-full border p-2 rounded" placeholder="https://..." value={settingsForm.faviconUrl || ''} onChange={e => setSettingsForm({...settingsForm, faviconUrl: e.target.value})} />
                        {settingsForm.faviconUrl && <img src={settingsForm.faviconUrl} className="h-10 w-10 object-contain border p-1 rounded" alt="favicon" />}
                    </div>
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Site Description (SEO)</label>
                    <textarea className="w-full border p-2 rounded" rows={2} value={settingsForm.siteDescription} onChange={e => setSettingsForm({...settingsForm, siteDescription: e.target.value})} />
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Footer Copyright Text</label>
                    <input className="w-full border p-2 rounded" value={copyrightText} onChange={e => setCopyrightText(e.target.value)} />
                    <p className="text-xs text-gray-500 mt-1">Can also be edited in Menu & Footer manager.</p>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Feature Toggles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {Object.entries(settingsForm.features).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                       <span className="capitalize font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                       <button 
                          onClick={() => setSettingsForm({...settingsForm, features: {...settingsForm.features, [key]: !val}})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${val ? 'bg-brand-600' : 'bg-gray-300'}`}
                       >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${val ? 'translate-x-6' : 'translate-x-1'}`} />
                       </button>
                    </div>
                 ))}
              </div>
              <p className="text-xs text-gray-500">Note: Disabling features like 'Careers' or 'Blog' will automatically hide them from the site navigation.</p>
           </div>
           
           <div className="flex justify-end">
              <button onClick={handleSettingsSave} className="flex items-center bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700">
                 <Save className="h-4 w-4 mr-2" /> Save Changes
              </button>
           </div>
        </div>
      )}

      {/* THEME TAB */}
      {activeTab === 'theme' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
           <h3 className="text-lg font-bold border-b pb-2">Theme & Typography</h3>
           
           <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Primary Font Family</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins'].map(font => (
                    <button
                        key={font}
                        onClick={() => {
                            const newSettings = {...settingsForm, font: font as any};
                            setSettingsForm(newSettings);
                            updateSettings(newSettings);
                        }}
                        className={`p-3 border rounded-lg text-left transition-colors font-medium ${
                            settingsForm.font === font ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 hover:border-brand-300'
                        }`}
                        style={{ fontFamily: font }}
                    >
                        {font}
                    </button>
                 ))}
              </div>
           </div>

           <div className="pt-4 border-t">
               <label className="block text-sm font-bold text-gray-700 mb-3">Color Scheme</label>
               
               <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Custom Primary Color</label>
                  <div className="flex gap-2 items-center">
                      <input 
                         type="color" 
                         className="h-10 w-10 border p-0 rounded cursor-pointer" 
                         value={settingsForm.themeColor} 
                         onChange={(e) => {
                             const newSettings = {...settingsForm, themeColor: e.target.value};
                             setSettingsForm(newSettings);
                             updateSettings(newSettings);
                         }}
                      />
                      <input 
                         type="text" 
                         className="border p-2 rounded w-32 uppercase font-mono"
                         value={settingsForm.themeColor} 
                         onChange={(e) => {
                             const newSettings = {...settingsForm, themeColor: e.target.value};
                             setSettingsForm(newSettings);
                             updateSettings(newSettings);
                         }}
                      />
                  </div>
               </div>

               <p className="text-xs text-gray-500 mb-3">Or choose a preset:</p>
               <div className="flex gap-4 flex-wrap">
                  {[
                      {name: 'blue', val: '#2563eb'}, 
                      {name: 'indigo', val: '#4f46e5'}, 
                      {name: 'purple', val: '#9333ea'}, 
                      {name: 'emerald', val: '#059669'}, 
                      {name: 'rose', val: '#e11d48'}
                  ].map(color => (
                     <button
                        key={color.name}
                        onClick={() => {
                            const newSettings = {...settingsForm, themeColor: color.val};
                            setSettingsForm(newSettings);
                            updateSettings(newSettings); // Apply instantly for preview
                        }}
                        className={`h-12 w-12 rounded-full border-4 flex items-center justify-center transition-transform hover:scale-105 ${
                            settingsForm.themeColor === color.val ? 'border-gray-900' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.val }}
                        title={color.name}
                     >
                     </button>
                  ))}
               </div>
               
           </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
           <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Add New User</h3>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                      <label className="block text-sm font-medium mb-1">Username</label>
                      <input required className="w-full border p-2 rounded" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input required type="text" className="w-full border p-2 rounded" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1">Email (For Application Tracking)</label>
                      <input type="email" className="w-full border p-2 rounded" placeholder="employee@company.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <select className="w-full border p-2 rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}>
                          <option value="employee">Employee / Candidate</option>
                          <option value="admin">Admin</option>
                      </select>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded font-bold hover:bg-brand-700 flex items-center">
                          <Plus className="h-4 w-4 mr-1" /> Add User
                      </button>
                  </div>
              </form>
           </div>

           <div className="space-y-4">
               <h3 className="text-lg font-bold">Existing Users</h3>
               <div className="border rounded-lg overflow-hidden">
                   <table className="w-full text-left text-sm">
                       <thead className="bg-gray-100 border-b">
                           <tr>
                               <th className="p-3">Username</th>
                               <th className="p-3">Role</th>
                               <th className="p-3">Email</th>
                               <th className="p-3 text-right">Action</th>
                           </tr>
                       </thead>
                       <tbody>
                           {data.users?.map(u => (
                               <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                                   <td className="p-3 font-medium">{u.username}</td>
                                   <td className="p-3 capitalize">
                                       <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                           {u.role}
                                       </span>
                                   </td>
                                   <td className="p-3 text-gray-500">{u.email || '-'}</td>
                                   <td className="p-3 text-right">
                                       {u.id !== currentUser?.id && u.username !== 'admin' && (
                                            <button onClick={() => { if(window.confirm('Delete user?')) deleteUser(u.id) }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                       )}
                                       {u.username === 'admin' && <span className="text-xs text-gray-400 italic">System</span>}
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
        </div>
      )}

      {/* DATA TAB */}
      {activeTab === 'data' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h3 className="text-lg font-bold flex items-center text-blue-600"><Download className="h-5 w-5 mr-2" /> Backup</h3>
                 <p className="text-sm text-gray-500">Download a full JSON backup of your pages, services, apps, and settings.</p>
                 <button onClick={exportData} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium">
                    Export Data (JSON)
                 </button>
              </div>

              <div className="space-y-4">
                 <h3 className="text-lg font-bold flex items-center text-green-600"><Upload className="h-5 w-5 mr-2" /> Restore</h3>
                 <p className="text-sm text-gray-500">Upload a previously exported JSON file to restore your site.</p>
                 <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
                 <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium">
                    Import Data
                 </button>
              </div>
           </div>

           <div className="border-t pt-8">
              <h3 className="text-lg font-bold text-red-600 flex items-center mb-4"><Database className="h-5 w-5 mr-2" /> Danger Zone</h3>
              <div className="bg-red-50 p-4 rounded-lg flex items-center justify-between">
                 <div>
                    <p className="font-bold text-red-800">Factory Reset</p>
                    <p className="text-sm text-red-600">This will wipe all LocalStorage data and return to defaults.</p>
                 </div>
                 <button onClick={() => { if(window.confirm('Are you absolutely sure? This cannot be undone.')) resetData() }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Reset System
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};