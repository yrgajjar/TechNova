import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { SectionRenderer } from '../../components/SectionRenderer';

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useData();
  
  const page = data.pages.find(p => p.slug === slug && p.isPublished);

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* If page has sections, render them. If legacy (from previous version), fallback */}
      {page.sections && page.sections.length > 0 ? (
        page.sections.map(section => (
          <SectionRenderer key={section.id} section={section} />
        ))
      ) : (
        // Fallback for old data or empty sections
        <div className="container mx-auto px-4 py-16">
           <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
           {/* Fallback content render */}
           <div className="prose lg:prose-xl text-gray-700">
               {(page as any).content} 
           </div>
        </div>
      )}
    </div>
  );
};
