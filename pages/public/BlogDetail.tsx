import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ArrowRight } from 'lucide-react';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useData();
  const post = data.blogPosts?.find(p => p.slug === slug && p.isPublished);

  if (!post) return <Navigate to="/blog" replace />;

  // Find related posts if any
  const relatedPosts = post.relatedPostIds 
      ? data.blogPosts?.filter(p => post.relatedPostIds?.includes(p.id) && p.isPublished)
      : [];

  // Date Formatting: OCTOBER 16, 2024
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
  }).toUpperCase();

  return (
    <div className="bg-white min-h-screen">
       <div className="container mx-auto px-4 py-12 max-w-4xl">
          
          {/* Header */}
          <div className="mb-8">
             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
             </h1>
             <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                {formattedDate}
             </p>
          </div>

          {/* Hero Image */}
          {post.coverImage && (
             <div className="mb-8">
                 <img src={post.coverImage} alt={post.title} className="w-full h-auto object-cover max-h-[600px] rounded-lg shadow-sm" />
                 {post.imageCaption && (
                     <p className="text-xs text-gray-500 mt-2 font-light">{post.imageCaption}</p>
                 )}
             </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-900 mb-8"></div>

          {/* Authors Section */}
          <div className="mb-8">
              <h3 className="text-xl font-normal text-gray-900 mb-6">Authors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {post.authors && post.authors.length > 0 ? (
                      post.authors.map((author, idx) => (
                          <div key={idx} className="flex items-start space-x-4">
                              <img 
                                src={author.avatar || 'https://via.placeholder.com/60'} 
                                alt={author.name} 
                                className="w-14 h-14 rounded-full object-cover bg-gray-100 flex-shrink-0"
                              />
                              <div>
                                  <div className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-1">
                                      {author.name}
                                  </div>
                                  <div className="text-sm text-gray-600 leading-snug">
                                      {author.role}
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      // Fallback for posts without detailed authors structure
                      <div className="flex items-center space-x-3">
                           <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                               {post.author.charAt(0)}
                           </div>
                           <div>
                               <div className="font-bold text-sm uppercase text-gray-900">{post.author}</div>
                               <div className="text-sm text-gray-500">Contributor</div>
                           </div>
                      </div>
                  )}
              </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-10"></div>

          {/* Content */}
          <div className="prose prose-lg prose-headings:font-bold prose-p:text-gray-800 prose-img:rounded-xl max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags */}
          {post.tags && (
             <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                   {post.tags.split(',').map((tag, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">#{tag.trim()}</span>
                   ))}
                </div>
             </div>
          )}

          {/* Related Posts Section */}
          {relatedPosts && relatedPosts.length > 0 && (
             <div className="mt-16 pt-12 border-t-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Read Also</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {relatedPosts.map(rel => (
                      <Link key={rel.id} to={`/blog/${rel.slug}`} className="group block">
                         {rel.coverImage && (
                            <div className="mb-4 overflow-hidden rounded-xl h-48">
                               <img src={rel.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={rel.title} />
                            </div>
                         )}
                         <h4 className="font-bold text-lg text-gray-900 group-hover:text-brand-600 transition leading-tight mb-2">
                            {rel.title}
                         </h4>
                         <p className="text-sm text-gray-500 line-clamp-2">{rel.excerpt}</p>
                         <div className="mt-3 flex items-center text-brand-600 text-sm font-bold">
                            Read Article <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                         </div>
                      </Link>
                   ))}
                </div>
             </div>
          )}
       </div>
    </div>
  );
};