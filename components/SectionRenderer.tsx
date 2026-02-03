import React, { useState } from 'react';
import { Section } from '../types';
import { ArrowRight, CheckCircle, HelpCircle, User, Star, Monitor, Server, Cloud, ShieldCheck, Cpu, Bot, Code, Database, Globe, Smartphone, Wifi, Box, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

// Helper to map icon names to Lucide components
const IconMap: any = {
  Monitor, Server, Cloud, ShieldCheck, Cpu, Bot, Code, Database, Globe, Smartphone, Wifi, Box
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition"
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="p-4 text-gray-600 border-t border-gray-100 leading-relaxed">
           {answer}
        </div>
      )}
    </div>
  );
};

export const SectionRenderer: React.FC<{ section: Section }> = ({ section }) => {
  const { type, content, settings } = section;
  const { data } = useData();

  const bgClass = settings?.backgroundColor ? `bg-[${settings.backgroundColor}]` : 'bg-white';
  const textClass = settings?.textColor ? `text-[${settings.textColor}]` : 'text-gray-900';

  switch (type) {
    case 'hero':
      return (
        <div className="relative bg-slate-900 text-white py-24 lg:py-32 overflow-hidden">
          {content.image && (
             <div className="absolute inset-0 z-0">
               <img src={content.image} alt="Hero" className="w-full h-full object-cover opacity-20" />
               <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
             </div>
          )}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">{content.title}</h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">{content.subtitle}</p>
                {content.linkText && (
                    <Link to={content.linkUrl || '/contact'} className="inline-flex items-center bg-brand-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-500 transition shadow-lg shadow-brand-900/20">
                    {content.linkText} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                )}
            </div>
          </div>
        </div>
      );

    case 'text':
      return (
        <div className={`py-16 ${bgClass} ${textClass}`}>
          <div className="container mx-auto px-4">
             <div className="prose prose-lg prose-brand max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: content.html }} />
          </div>
        </div>
      );

    case 'stats':
      return (
        <div className="py-12 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.items?.map((stat: any, idx: number) => (
                <div key={idx} className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
                  <div className="text-4xl font-extrabold text-brand-600 mb-2">{stat.value}</div>
                  <div className="text-gray-500 font-medium uppercase tracking-wide text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'services':
      return (
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
               {content.title && <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>}
               {content.subtitle && <p className="text-gray-600">{content.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.services.slice(0, content.limit || 8).map((service) => {
                 const Icon = IconMap[service.icon] || IconMap.Box;
                 return (
                    <div key={service.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
                        <div className="bg-brand-50 p-4 rounded-xl inline-block mb-6 group-hover:bg-brand-600 transition-colors">
                           <Icon className="h-8 w-8 text-brand-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>
                    </div>
                 );
              })}
            </div>
            <div className="text-center mt-12">
                <Link to="/services" className="text-brand-600 font-bold hover:underline">View All Services &rarr;</Link>
            </div>
          </div>
        </div>
      );

    case 'features':
      return (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            {content.title && <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{content.title}</h2>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-6 rounded-xl hover:bg-gray-50 transition">
                  <div className="flex-shrink-0">
                     <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
      
    case 'faq':
        return (
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    {content.title && <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{content.title}</h2>}
                    <div className="space-y-4">
                        {content.items?.map((item: any, idx: number) => (
                            <FAQItem key={idx} question={item.question} answer={item.answer} />
                        ))}
                    </div>
                </div>
            </div>
        );

    case 'process':
        return (
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    {content.title && <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">{content.title}</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>
                        
                        {content.items?.map((item: any, idx: number) => (
                            <div key={idx} className="text-center relative">
                                <div className="w-24 h-24 bg-white border-4 border-brand-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-brand-600 shadow-sm">
                                    {idx + 1}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-600 max-w-xs mx-auto">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

    case 'testimonials':
        return (
            <div className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    {content.title && <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{content.title}</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {content.items?.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
                                <div className="flex text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                                </div>
                                <p className="text-gray-700 mb-6 italic">"{item.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="bg-brand-100 p-2 rounded-full"><User className="h-4 w-4 text-brand-600" /></div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-900">{item.author}</div>
                                        <div className="text-xs text-gray-500">{item.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

    case 'cta':
      return (
        <div className="py-20 bg-brand-600 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.title}</h2>
            <p className="text-brand-100 mb-8 max-w-2xl mx-auto text-lg">{content.text}</p>
            <Link to={content.linkUrl || '/contact'} className="inline-block bg-white text-brand-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg">
              {content.linkText || 'Get Started'}
            </Link>
          </div>
        </div>
      );

    case 'contact':
        return (
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <h2 className="text-3xl font-bold mb-8">{content.title || 'Get In Touch'}</h2>
                    <p className="text-gray-600 mb-8">{content.text || 'We are here to help.'}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-left bg-gray-50 p-8 rounded-2xl">
                         <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</span>
                            <span className="text-gray-900 font-medium">{data.settings.contactEmail}</span>
                         </div>
                         <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Office</span>
                            <span className="text-gray-900 font-medium">{data.content.contact.address}</span>
                         </div>
                    </div>
                    <div className="mt-8">
                       <Link to="/contact" className="text-brand-600 font-bold hover:underline">Go to Contact Page &rarr;</Link>
                    </div>
                </div>
            </div>
        );

    case 'html':
        return (
            <div className="py-8 container mx-auto px-4" dangerouslySetInnerHTML={{ __html: content.html }} />
        );

    default:
      return null;
  }
};