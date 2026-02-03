import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Search, Filter, Globe } from 'lucide-react';

export const Careers: React.FC = () => {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const activeJobs = data.jobs.filter(j => j.isActive);
  
  // Get unique departments for filter dropdown
  const departments = ['All', ...Array.from(new Set(activeJobs.map(j => j.department)))];
  const types = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];

  const filteredJobs = activeJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = filterDept === 'All' || job.department === filterDept;
      const matchesType = filterType === 'All' || job.type === filterType;
      return matchesSearch && matchesDept && matchesType;
  });

  return (
    <div className="bg-white min-h-screen">
       <div className="bg-slate-900 py-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-900 opacity-20"></div>
          <div className="relative z-10 container mx-auto px-4">
             <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Join Our Mission</h1>
             <p className="text-xl text-gray-300 max-w-2xl mx-auto">We are building the next generation of technology. Find your place in the future.</p>
          </div>
       </div>

       <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 -mt-20 relative z-20 mb-12 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search for job title or location..." 
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="flex w-full md:w-auto gap-4">
                  <div className="relative flex-1 md:w-48">
                      <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <select 
                        className="w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none appearance-none bg-white"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                      >
                          {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                  </div>
                  <div className="relative flex-1 md:w-48">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <select 
                        className="w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none appearance-none bg-white"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                          {types.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                  </div>
              </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid gap-6">
               {filteredJobs.map(job => (
                 <Link key={job.id} to={`/careers/${job.slug}`} className="block bg-white border border-gray-200 p-8 rounded-xl hover:shadow-xl hover:border-brand-200 transition-all group relative overflow-hidden">
                    {job.isRemote && (
                        <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                            Remote Available
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                       <div className="mb-4 md:mb-0">
                          <span className="text-xs font-bold text-brand-600 uppercase tracking-wide mb-1 block">{job.department}</span>
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand-600 transition mb-3">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                             <span className="flex items-center bg-gray-50 px-2 py-1 rounded"><MapPin className="h-3 w-3 mr-1" /> {job.location}</span>
                             <span className="flex items-center bg-gray-50 px-2 py-1 rounded"><Briefcase className="h-3 w-3 mr-1" /> {job.type}</span>
                             <span className="flex items-center bg-gray-50 px-2 py-1 rounded"><Clock className="h-3 w-3 mr-1" /> {job.experience}</span>
                             {job.salaryRange && <span className="flex items-center font-medium text-green-600 bg-green-50 px-2 py-1 rounded">{job.salaryRange}</span>}
                          </div>
                       </div>
                       <span className="inline-flex items-center justify-center bg-brand-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-200">
                          View Role
                       </span>
                    </div>
                 </Link>
               ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
               <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-gray-900 mb-2">No matching positions</h3>
               <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
               <button onClick={() => {setSearchTerm(''); setFilterDept('All'); setFilterType('All');}} className="mt-4 text-brand-600 font-bold hover:underline">Clear Filters</button>
            </div>
          )}
       </div>
    </div>
  );
};