import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Save, Trash2, Edit, Plus, X } from 'lucide-react';
import * as Icons from 'lucide-react';

export const ServiceManager: React.FC = () => {
  const { data, addService, updateService, deleteService } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', icon: 'Box' });
  const [showIconPicker, setShowIconPicker] = useState(false);

  const iconList = ['Server', 'Cloud', 'ShieldCheck', 'Briefcase', 'Code', 'Database', 'Smartphone', 'Globe', 'Cpu', 'Wifi'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateService({ id: editingId, ...form });
    } else {
      addService({ id: Date.now().toString(), ...form });
    }
    setForm({ title: '', description: '', icon: 'Box' });
    setEditingId(null);
  };

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    setForm({ title: service.title, description: service.description, icon: service.icon });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Manage Services</h2>
      
      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Title</label>
              <input 
                required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Icon</label>
              <button 
                type="button" 
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 flex items-center justify-between text-left"
              >
                <span className="flex items-center gap-2">
                    {/* Render selected icon dynamically */}
                    {React.createElement((Icons as any)[form.icon] || Icons.Box, { className: "h-4 w-4" })}
                    {form.icon}
                </span>
                <span className="text-xs text-gray-500">Change</span>
              </button>
              
              {showIconPicker && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border rounded-md p-2 grid grid-cols-5 gap-2">
                    {iconList.map(iconName => (
                        <button
                            key={iconName}
                            type="button"
                            onClick={() => { setForm({...form, icon: iconName}); setShowIconPicker(false); }}
                            className={`p-2 rounded hover:bg-gray-100 flex justify-center ${form.icon === iconName ? 'bg-brand-50 text-brand-600' : ''}`}
                            title={iconName}
                        >
                            {React.createElement((Icons as any)[iconName] || Icons.Box, { className: "h-5 w-5" })}
                        </button>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                required
                rows={3}
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
          </div>
          <div className="flex space-x-2">
             <button type="submit" className="flex items-center bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
                <Plus className="h-4 w-4 mr-2" /> {editingId ? 'Update Service' : 'Add Service'}
             </button>
             {editingId && (
                 <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', icon: 'Box' }); }} className="flex items-center text-gray-600 px-4 py-2 hover:bg-gray-100 rounded-lg">
                    <X className="h-4 w-4 mr-1" /> Cancel
                 </button>
             )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col group relative">
                <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(service)} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => { if(window.confirm('Delete service?')) deleteService(service.id) }} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mb-4 text-brand-600">
                    {React.createElement((Icons as any)[service.icon] || Icons.Box, { className: "h-8 w-8" })}
                </div>
                <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm flex-grow">{service.description}</p>
            </div>
        ))}
      </div>
    </div>
  );
};
