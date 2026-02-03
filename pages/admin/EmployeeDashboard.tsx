import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Clock, CheckCircle, XCircle, FileText, User } from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { data } = useData();
  const { user } = useAuth();

  // Filter applications by user email
  const myApplications = data.applications.filter(app => app.email === user?.email);

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.username}</h1>
         <p className="text-gray-500">Track your job applications and status.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {/* Profile Card */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start space-x-4">
             <div className="bg-brand-100 p-4 rounded-full">
                 <User className="h-8 w-8 text-brand-600" />
             </div>
             <div>
                 <h3 className="font-bold text-lg">My Profile</h3>
                 <p className="text-gray-500 text-sm">Username: {user?.username}</p>
                 <p className="text-gray-500 text-sm">Linked Email: {user?.email || 'No email linked'}</p>
                 <p className="text-xs text-brand-600 mt-2 bg-brand-50 inline-block px-2 py-1 rounded">Role: Employee (Candidate)</p>
             </div>
         </div>

         {/* Applications List */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
               <h3 className="font-bold text-lg flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-gray-400" /> My Applications
               </h3>
            </div>
            
            {myApplications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                    {myApplications.map(app => {
                        const job = data.jobs.find(j => j.id === app.jobId);
                        
                        // Status Badge Logic
                        let statusColor = 'bg-gray-100 text-gray-600';
                        let StatusIcon = Clock;
                        if(app.status === 'reviewed') { statusColor = 'bg-yellow-100 text-yellow-700'; StatusIcon = FileText; }
                        if(app.status === 'hired') { statusColor = 'bg-green-100 text-green-700'; StatusIcon = CheckCircle; }
                        if(app.status === 'rejected') { statusColor = 'bg-red-100 text-red-700'; StatusIcon = XCircle; }

                        return (
                            <div key={app.id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900">{job?.title || 'Unknown Position'}</h4>
                                        <p className="text-sm text-gray-500">{job?.department} • {job?.location}</p>
                                        <p className="text-xs text-gray-400 mt-1">Applied on: {new Date(app.appliedDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`flex items-center px-4 py-2 rounded-full font-bold text-sm capitalize ${statusColor}`}>
                                            <StatusIcon className="h-4 w-4 mr-2" />
                                            {app.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="p-12 text-center text-gray-500">
                    <p>You haven't submitted any applications with email: <strong>{user?.email}</strong></p>
                    <p className="text-sm mt-2">Go to <a href="/#/careers" className="text-brand-600 underline">Careers Page</a> to apply.</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};