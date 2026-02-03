import React from 'react';
import { useData } from '../../context/DataContext';

export const About: React.FC = () => {
  const { data } = useData();
  const { title, content, mission } = data.content.about;

  return (
    <div className="bg-white">
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">{title}</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Driving innovation through technology since 2020.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-blue mx-auto">
                <p className="text-xl leading-relaxed text-gray-700 mb-12">
                    {content}
                </p>
                
                <div className="bg-brand-50 border-l-4 border-brand-500 p-8 rounded-r-lg my-12">
                    <h3 className="text-2xl font-bold text-brand-900 mb-4">Our Mission</h3>
                    <p className="text-xl text-brand-800 italic">"{mission}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                   <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">Innovation</h4>
                        <p className="text-gray-600">We constantly explore new technologies to keep our clients ahead of the curve.</p>
                   </div>
                   <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">Integrity</h4>
                        <p className="text-gray-600">We build trust through transparent communication and honest practices.</p>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
