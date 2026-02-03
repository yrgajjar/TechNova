import React from 'react';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Layers, Users, Eye, Activity, Sparkles, Briefcase } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data } = useData();

  const stats = [
    { label: 'Total Services', value: data.services.length, icon: Layers, color: 'bg-blue-500' },
    { label: 'Custom Pages', value: data.pages.length, icon: FileText, color: 'bg-green-500' },
    { label: 'AI Apps', value: data.aiApps.length, icon: Sparkles, color: 'bg-purple-500' },
    { label: 'Job Applications', value: data.applications.length, icon: Briefcase, color: 'bg-orange-500' },
  ];

  const chartData = [
    { name: 'Mon', visits: 400 },
    { name: 'Tue', visits: 300 },
    { name: 'Wed', visits: 550 },
    { name: 'Thu', visits: 450 },
    { name: 'Fri', visits: 600 },
    { name: 'Sat', visits: 200 },
    { name: 'Sun', visits: 250 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome back to the content management system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Visitor Traffic (Demo)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="visits" fill="var(--color-brand-500)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-[26rem]">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
             <Activity className="h-5 w-5 mr-2 text-gray-400" /> Recent Activity
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
             {data.activityLogs && data.activityLogs.length > 0 ? (
                data.activityLogs.map(log => (
                   <div key={log.id} className="flex flex-col border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <span className="font-medium text-sm text-gray-900">{log.action}</span>
                      <span className="text-xs text-gray-500 truncate" title={log.details}>{log.details}</span>
                      <span className="text-[10px] text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</span>
                   </div>
                ))
             ) : (
                <p className="text-sm text-gray-400 italic text-center mt-10">No recent activity.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
