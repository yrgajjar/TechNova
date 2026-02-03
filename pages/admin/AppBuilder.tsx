import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AIApp, AIAppInput } from '../../types';
import { Trash2, Plus, Save } from 'lucide-react';

export const AppBuilder: React.FC = () => {
  const { data, addAIApp, updateAIApp, deleteAIApp } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialApp: AIApp = {
    id: '',
    name: '',
    slug: '',
    description: '',
    inputs: [],
    promptTemplate: '',
    outputType: 'text',
    actionLabel: 'Generate'
  };

  const [form, setForm] = useState<AIApp>(initialApp);

  const editApp = (app: AIApp) => {
    setEditingId(app.id);
    setForm(app);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialApp);
  };

  const saveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAIApp(form);
    } else {
      addAIApp({ ...form, id: Date.now().toString() });
    }
    resetForm();
  };

  // Inputs Management
  const addInput = () => {
    const newInput: AIAppInput = { id: Date.now().toString(), label: 'New Input', key: 'input_' + Date.now(), type: 'text' };
    setForm({ ...form, inputs: [...form.inputs, newInput] });
  };

  const updateInput = (idx: number, field: keyof AIAppInput, value: string) => {
    const newInputs = [...form.inputs];
    (newInputs[idx] as any)[field] = value;
    setForm({ ...form, inputs: newInputs });
  };

  const removeInput = (idx: number) => {
    const newInputs = form.inputs.filter((_, i) => i !== idx);
    setForm({ ...form, inputs: newInputs });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit AI App' : 'Create AI App'}</h2>
        <form onSubmit={saveApp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">App Name</label>
              <input required className="w-full border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Slug</label>
              <input required className="w-full border p-2 rounded bg-gray-50" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea className="w-full border p-2 rounded" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          
          {/* Inputs Builder */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold">User Inputs</label>
              <button type="button" onClick={addInput} className="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded">+ Add Field</button>
            </div>
            <div className="space-y-2 bg-gray-50 p-3 rounded">
               {form.inputs.map((input, idx) => (
                 <div key={input.id} className="flex gap-2 items-center">
                    <input className="w-1/3 text-sm p-1 border rounded" placeholder="Label" value={input.label} onChange={e => updateInput(idx, 'label', e.target.value)} />
                    <input className="w-1/3 text-sm p-1 border rounded" placeholder="Var Key" value={input.key} onChange={e => updateInput(idx, 'key', e.target.value)} />
                    <select className="text-sm p-1 border rounded" value={input.type} onChange={e => updateInput(idx, 'type', e.target.value)}>
                      <option value="text">Text</option>
                      <option value="textarea">Long Text</option>
                      <option value="number">Number</option>
                      <option value="select">Dropdown</option>
                    </select>
                    <button type="button" onClick={() => removeInput(idx)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                 </div>
               ))}
               {form.inputs.length === 0 && <p className="text-xs text-gray-400 text-center">No inputs defined.</p>}
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">Prompt Template</label>
             <p className="text-xs text-gray-500 mb-2">Use {'{{key}}'} to insert user inputs.</p>
             <textarea className="w-full border p-2 rounded h-24 font-mono text-sm" value={form.promptTemplate} onChange={e => setForm({...form, promptTemplate: e.target.value})} />
          </div>

          <div className="flex gap-2">
             <button type="submit" className="flex-1 bg-brand-600 text-white py-2 rounded font-bold hover:bg-brand-700">Save App</button>
             {editingId && <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Cancel</button>}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Existing Apps</h2>
        {data.aiApps.map(app => (
          <div key={app.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
            <div>
               <h3 className="font-bold">{app.name}</h3>
               <p className="text-xs text-gray-500">/app/{app.slug}</p>
            </div>
            <div className="flex gap-2">
               <button onClick={() => editApp(app)} className="text-blue-600 hover:underline text-sm">Edit</button>
               <button type="button" onClick={() => { if(window.confirm('Delete?')) deleteAIApp(app.id) }} className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};