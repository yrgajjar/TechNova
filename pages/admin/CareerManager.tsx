import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Job, JobApplication } from '../../types';
import { Trash2, Edit, Plus, Eye, Download, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { getFile } from '../../services/db';
import { RichTextEditor } from '../../components/RichTextEditor';

export const CareerManager: React.FC = () => {
  const { data, addJob, updateJob, deleteJob, updateApplicationStatus, deleteApplication } = useData();
  const [tab, setTab] = useState<'jobs' | 'applications'>('jobs');
  
  // Job Form State
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);
  const [benefitsInput, setBenefitsInput] = useState('');

  const startEdit = (job?: Job) => {
      setEditingJob(job || {});
      setBenefitsInput(job?.benefits?.join(', ') || '');
  };

  const saveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    
    const jobData: Job = {
      id: editingJob.id || Date.now().toString(),
      title: editingJob.title || '',
      slug: editingJob.slug || '',
      department: editingJob.department || 'General',
      location: editingJob.location || '',
      isRemote: editingJob.isRemote || false,
      type: editingJob.type || 'Full-time',
      salaryRange: editingJob.salaryRange || '',
      experience: editingJob.experience || '',
      description: editingJob.description || '',
      requirements: [], // Handled inside description now via Rich Text
      benefits: benefitsInput.split(',').map(b => b.trim()).filter(b => b !== ''),
      isActive: editingJob.isActive !== undefined ? editingJob.isActive : true,
      postedDate: editingJob.postedDate || new Date().toISOString()
    };

    if (editingJob.id) updateJob(jobData);
    else addJob(jobData);
    setEditingJob(null);
  };

  const downloadResume = async (app: JobApplication) => {
    if (!app.resumeId) {
      alert('No resume file attached.');
      return;
    }
    try {
      const fileData = await getFile(app.resumeId);
      if (fileData) {
        const link = document.createElement('a');
        link.href = fileData.data;
        link.download = fileData.name || 'resume';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Resume file not found in database.');
      }
    } catch (e) {
      console.error(e);
      alert('Error retrieving file.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b">
         <button onClick={() => setTab('jobs')} className={`pb-2 px-4 ${tab === 'jobs' ? 'border-b-2 border-brand-600 font-bold text-brand-600' : 'text-gray-500'}`}>Jobs</button>
         <button onClick={() => setTab('applications')} className={`pb-2 px-4 ${tab === 'applications' ? 'border-b-2 border-brand-600 font-bold text-brand-600' : 'text-gray-500'}`}>Applications ({data.applications.length})</button>
      </div>

      {tab === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Job List */}
           <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-gray-700">All Positions</h3>
                 <button onClick={() => startEdit()} className="text-xs bg-brand-600 text-white px-2 py-1 rounded flex items-center"><Plus className="h-3 w-3 mr-1" /> New</button>
              </div>
              {data.jobs.map(job => (
                <div key={job.id} className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-brand-300 transition ${editingJob?.id === job.id ? 'ring-2 ring-brand-500' : ''}`} onClick={() => startEdit(job)}>
                   <div className="flex justify-between items-start">
                       <div>
                            <h3 className="font-bold text-gray-900">{job.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{job.department} • {job.location} {job.isRemote && '(Remote)'}</p>
                       </div>
                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {job.isActive ? 'Active' : 'Draft'}
                       </span>
                   </div>
                   <div className="mt-3 flex justify-end gap-2">
                     <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete job?')) deleteJob(job.id) }} className="text-red-600 p-1 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                   </div>
                </div>
              ))}
              {data.jobs.length === 0 && <p className="text-center text-gray-500 py-4">No jobs posted.</p>}
           </div>
           
           {/* Editor */}
           <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-gray-200 order-1 lg:order-2">
              <h3 className="font-bold text-xl mb-6 border-b pb-2">{editingJob ? (editingJob.id ? 'Edit Position' : 'Create New Position') : 'Select or Create a Job'}</h3>
              
              {editingJob ? (
                <form onSubmit={saveJob} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Job Title</label>
                            <input required className="w-full border p-2 rounded" value={editingJob.title || ''} onChange={e => setEditingJob({...editingJob, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                            <input required className="w-full border p-2 rounded" value={editingJob.slug || ''} onChange={e => setEditingJob({...editingJob, slug: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Department</label>
                            <select className="w-full border p-2 rounded" value={editingJob.department || 'Engineering'} onChange={e => setEditingJob({...editingJob, department: e.target.value})}>
                                <option>Engineering</option>
                                <option>Design</option>
                                <option>Product</option>
                                <option>Marketing</option>
                                <option>Sales</option>
                                <option>Operations</option>
                                <option>HR</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Job Type</label>
                            <select className="w-full border p-2 rounded" value={editingJob.type || 'Full-time'} onChange={e => setEditingJob({...editingJob, type: e.target.value as any})}>
                                <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input className="w-full border p-2 rounded" value={editingJob.location || ''} onChange={e => setEditingJob({...editingJob, location: e.target.value})} />
                        </div>
                        <div className="flex items-center pt-6">
                             <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" checked={editingJob.isRemote || false} onChange={e => setEditingJob({...editingJob, isRemote: e.target.checked})} className="rounded text-brand-600" />
                                <span className="font-medium text-sm">Remote Position</span>
                             </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Salary Range</label>
                            <input className="w-full border p-2 rounded" placeholder="e.g. $100k - $120k" value={editingJob.salaryRange || ''} onChange={e => setEditingJob({...editingJob, salaryRange: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Experience Level</label>
                            <input className="w-full border p-2 rounded" placeholder="e.g. 3+ Years" value={editingJob.experience || ''} onChange={e => setEditingJob({...editingJob, experience: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Benefits (Comma separated)</label>
                        <textarea className="w-full border p-2 rounded" rows={2} placeholder="Health Insurance, 401k, Remote Stipend..." value={benefitsInput} onChange={e => setBenefitsInput(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Job Description & Requirements</label>
                        <RichTextEditor 
                            value={editingJob.description || ''} 
                            onChange={(html) => setEditingJob({...editingJob, description: html})} 
                            className="h-64"
                        />
                    </div>

                    <div className="flex items-center gap-2 border-t pt-4">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={editingJob.isActive ?? true} onChange={e => setEditingJob({...editingJob, isActive: e.target.checked})} className="rounded text-brand-600" />
                            <span className="font-bold text-gray-800">Publish Job</span>
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" className="flex-1 bg-brand-600 text-white py-2 rounded font-bold hover:bg-brand-700">Save Position</button>
                        <button type="button" onClick={() => setEditingJob(null)} className="px-4 border rounded hover:bg-gray-50">Cancel</button>
                    </div>
                </form>
              ) : (
                  <div className="text-center py-20 text-gray-400">
                      <Plus className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>Select a job from the list or create a new one.</p>
                  </div>
              )}
           </div>
        </div>
      )}

      {tab === 'applications' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-700">Received Applications</h3>
              <div className="text-xs text-gray-500">Sorted by Date (Newest first)</div>
           </div>
           <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead className="bg-white border-b">
               <tr>
                 <th className="p-4">Candidate</th>
                 <th className="p-4">Position</th>
                 <th className="p-4">Applied</th>
                 <th className="p-4">Assets</th>
                 <th className="p-4">Status</th>
                 <th className="p-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody>
               {[...data.applications].sort((a,b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()).map(app => {
                 const job = data.jobs.find(j => j.id === app.jobId);
                 return (
                   <tr key={app.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{app.candidateName}</div>
                        <div className="text-gray-500 text-xs">{app.email}</div>
                        <div className="text-gray-500 text-xs">{app.phone}</div>
                      </td>
                      <td className="p-4">
                          <span className="font-medium text-gray-700">{job?.title || 'Unknown Job'}</span>
                          <div className="text-xs text-gray-400">{job?.department}</div>
                      </td>
                      <td className="p-4 text-gray-500">{new Date(app.appliedDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                            {app.resumeId ? (
                            <button onClick={() => downloadResume(app)} className="text-blue-600 flex items-center hover:underline text-xs">
                                <Download className="h-3 w-3 mr-1" /> Resume
                            </button>
                            ) : <span className="text-gray-400 text-xs">No Resume</span>}
                            {app.coverLetter && (
                                <span className="text-xs text-gray-500 cursor-help" title={app.coverLetter}>Has Cover Letter</span>
                            )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize 
                          ${app.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                          ${app.status === 'hired' ? 'bg-green-100 text-green-800' : ''}
                          ${app.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                          ${app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' : ''}
                        `}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                         <div className="flex justify-end gap-2">
                            <button onClick={() => updateApplicationStatus(app.id, 'reviewed')} title="Mark Reviewed" className="text-yellow-600 hover:bg-yellow-50 p-1 rounded"><Eye className="h-4 w-4" /></button>
                            <button onClick={() => updateApplicationStatus(app.id, 'hired')} title="Hire" className="text-green-600 hover:bg-green-50 p-1 rounded"><CheckCircle className="h-4 w-4" /></button>
                            <button onClick={() => updateApplicationStatus(app.id, 'rejected')} title="Reject" className="text-red-400 hover:bg-red-50 p-1 rounded"><XCircle className="h-4 w-4" /></button>
                            <button onClick={() => { if(window.confirm('Delete app?')) deleteApplication(app.id) }} title="Delete" className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
                         </div>
                      </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
           </div>
           {data.applications.length === 0 && <div className="p-12 text-center text-gray-500">No applications received yet.</div>}
        </div>
      )}
    </div>
  );
};