import React from 'react';
import { useData } from '../../context/DataContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const { data } = useData();
  const { contact } = data.content;

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Get In Touch</h1>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
                <div className="space-y-8">
                    <div className="flex items-start space-x-4">
                        <div className="bg-brand-100 p-3 rounded-lg">
                            <Mail className="h-6 w-6 text-brand-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email Us</p>
                            <p className="text-lg font-semibold text-gray-900">{contact.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="bg-brand-100 p-3 rounded-lg">
                            <Phone className="h-6 w-6 text-brand-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Call Us</p>
                            <p className="text-lg font-semibold text-gray-900">{contact.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="bg-brand-100 p-3 rounded-lg">
                            <MapPin className="h-6 w-6 text-brand-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Visit Us</p>
                            <p className="text-lg font-semibold text-gray-900">{contact.address}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form (Static) */}
            <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"></textarea>
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center px-8 py-4 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">
                        <Send className="h-5 w-5 mr-2" /> Send Message
                    </button>
                    <p className="text-xs text-gray-500 text-center">Note: This is a static demo form.</p>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};
