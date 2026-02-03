import React from 'react';
import { useData } from '../../context/DataContext';
import * as Icons from 'lucide-react';

export const Services: React.FC = () => {
  const { data } = useData();

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-10 w-10 text-brand-600" /> : <Icons.Box className="h-10 w-10 text-brand-600" />;
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600">
            Comprehensive technology solutions designed to scale with your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.services.map((service) => (
            <div key={service.id} className="flex flex-col bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-brand-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {renderIcon(service.icon)}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 flex-grow leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-slate-900 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need a custom solution?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">Our team of experts can design a tailored infrastructure plan specific to your operational requirements.</p>
            <a href="/contact" className="inline-block bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-lg transition">Contact Us</a>
        </div>
      </div>
    </div>
  );
};
