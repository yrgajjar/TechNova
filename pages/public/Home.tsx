import React from 'react';
import { useData } from '../../context/DataContext';
import { SectionRenderer } from '../../components/SectionRenderer';
import { Loader2 } from 'lucide-react';

export const Home: React.FC = () => {
  const { data } = useData();
  
  // Find the 'home' page configuration
  const homePage = data.pages.find(p => p.slug === 'home');

  if (!homePage) {
    return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-brand-600" />
                <p>Loading configuration...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white">
      {homePage.sections && homePage.sections.length > 0 ? (
        homePage.sections.map(section => (
          <SectionRenderer key={section.id} section={section} />
        ))
      ) : (
        <div className="py-20 text-center text-gray-500">
           <p>Home page has no sections configured. Go to Admin Panel to add content.</p>
        </div>
      )}
    </div>
  );
};
