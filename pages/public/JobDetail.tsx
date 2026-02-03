import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { MapPin, Clock, ArrowLeft, CheckCircle, Upload, DollarSign, Briefcase, Globe, Check } from 'lucide-react';
import { saveFile } from '../../services/db';

export const JobDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, addApplication } = useData();
  const job = data.jobs.find(j => j.slug === slug && j.isActive);

  const [form, setForm] = useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!job) return <Navigate to="/careers" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resumeId = file ? `${Date.now()}_${file.name}` : undefined;
      
      // Save file to IndexedDB if exists
      if (file && resumeId) {
        await saveFile(resumeId, file);
      }

      addApplication({
        id: Date.now().toString(),
        jobId: job.id,
        candidateName: form.name,
        email: form.email,
        phone: form.phone,
        coverLetter: form.coverLetter,
        resumeId,
        status: 'new',
        appliedDate: new Date().toISOString()
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit application. Please ensure file is not too large.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Received!</h2>
            <p className="text-gray-600 mb-6">Thanks for applying to <strong>{job.title}</strong>. We will review your info and get back to you soon.</p>
            <Link to="/careers" className="text-brand-600 font-bold hover:underline">Back to Careers</Link>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4 max-w-6xl">
              <Link to="/careers" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
              </Link>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                      <span className="bg-brand-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 inline-block">{job.department}</span>
                      <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
                      <div className="flex flex-wrap gap-6 text-slate-300 text-sm mt-4">
                          <span className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {job.location}</span>
                          <span className="flex items-center"><Briefcase className="h-4 w-4 mr-2" /> {job.type}</span>
                          {job.isRemote && <span className="flex items-center text-green-400"><Globe className="h-4 w-4 mr-2" /> Remote Available</span>}
                      </div>
                  </div>
                  <div className="mt-6 md:mt-0">
                      <a href="#apply" className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold shadow-lg transition inline-block">Apply Now</a>
                  </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-12">
               <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b">Role Description</h3>
                  {/* Render HTML content from Rich Text Editor */}
                  <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.description }} />
               </div>

               {job.benefits && job.benefits.length > 0 && (
                   <div>
                       <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b">Perks & Benefits</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {job.benefits.map((benefit, i) => (
                               <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                   <Check className="h-5 w-5 text-green-500 mr-3" />
                                   <span className="text-gray-700 font-medium">{benefit}</span>
                               </div>
                           ))}
                       </div>
                   </div>
               )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
               <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
                  <h3 className="font-bold text-lg mb-4">Job Overview</h3>
                  <div className="space-y-4">
                      {job.salaryRange && (
                          <div className="flex items-start">
                              <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                              <div>
                                  <span className="block text-xs font-bold text-gray-400 uppercase">Salary Range</span>
                                  <span className="font-semibold text-gray-900">{job.salaryRange}</span>
                              </div>
                          </div>
                      )}
                      <div className="flex items-start">
                          <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase">Experience</span>
                              <span className="font-semibold text-gray-900">{job.experience}</span>
                          </div>
                      </div>
                      <div className="flex items-start">
                          <Briefcase className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase">Department</span>
                              <span className="font-semibold text-gray-900">{job.department}</span>
                          </div>
                      </div>
                      <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                              <span className="block text-xs font-bold text-gray-400 uppercase">Location</span>
                              <span className="font-semibold text-gray-900">{job.location}</span>
                              {job.isRemote && <span className="text-xs text-green-600 block mt-1">Remote-friendly</span>}
                          </div>
                      </div>
                  </div>
               </div>

               <div id="apply" className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 ring-1 ring-gray-200">
                  <h3 className="text-xl font-bold mb-6">Apply for this role</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input required type="email" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Resume</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 relative transition bg-gray-50">
                           <input type="file" required accept=".pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                           <div className="flex flex-col items-center">
                               <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                                   <Upload className="h-5 w-5 text-brand-600" />
                               </div>
                               <p className="text-sm font-medium text-gray-900">{file ? file.name : 'Click to Upload Resume'}</p>
                               <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 5MB</p>
                           </div>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Cover Letter (Optional)</label>
                        <textarea className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" rows={3} value={form.coverLetter} onChange={e => setForm({...form, coverLetter: e.target.value})} />
                     </div>
                     <button disabled={loading} type="submit" className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-200">
                        {loading ? 'Sending Application...' : 'Submit Application'}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};