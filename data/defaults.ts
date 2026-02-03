import { AppData } from '../types';

export const DEFAULT_DATA: AppData = {
  settings: {
    siteName: 'TechNova',
    siteDescription: 'Leading IT Services & Consultancy',
    contactEmail: 'contact@technova.inc',
    themeColor: '#2563eb', // Default Blue hex
    font: 'Inter',
    features: {
      careers: true,
      aiApps: true,
      blog: true,
      maintenanceMode: false
    }
  },
  // Default Admin User
  users: [
    {
      id: 'admin_1',
      username: 'admin',
      password: 'password', // Simple auth for local storage demo
      role: 'admin',
      isAuthenticated: false
    }
  ],
  header: {
    logoUrl: '',
    logoText: 'TechNova',
    isSticky: true,
    showMobileMenu: true,
    backgroundColor: '#ffffff',
    textColor: '#111827',
    items: [
      { id: 'h1', label: 'Home', path: '/', isExternal: false, isOpenInNewTab: false, isEnabled: true },
      { 
        id: 'h2', label: 'Services', isEnabled: true, isMegaMenu: true, // Enabled Mega Menu
        path: '/services', 
        children: [
          { 
            id: 'h2_c1', label: 'Infrastructure', isEnabled: true, 
            children: [
                { id: 'h2_c1_l1', label: 'Cloud Migration', path: '/services', isEnabled: true },
                { id: 'h2_c1_l2', label: 'Server Management', path: '/services', isEnabled: true },
                { id: 'h2_c1_l3', label: 'Network Security', path: '/services', isEnabled: true },
            ] 
          },
          { 
            id: 'h2_c2', label: 'Development', isEnabled: true,
            children: [
                { id: 'h2_c2_l1', label: 'Web Applications', path: '/services', isEnabled: true },
                { id: 'h2_c2_l2', label: 'Mobile Apps', path: '/services', isEnabled: true },
                { id: 'h2_c2_l3', label: 'AI Solutions', path: '/services', isEnabled: true },
            ]
          },
          { 
            id: 'h2_c3', label: 'Consulting', isEnabled: true,
            children: [
                { id: 'h2_c3_l1', label: 'IT Strategy', path: '/services', isEnabled: true },
                { id: 'h2_c3_l2', label: 'Digital Transformation', path: '/services', isEnabled: true },
            ]
          }
        ]
      },
      { id: 'h_blog', label: 'Blog', path: '/blog', isExternal: false, isOpenInNewTab: false, isEnabled: true },
      { id: 'h_careers', label: 'Careers', path: '/careers', isExternal: false, isOpenInNewTab: false, isEnabled: true },
      { id: 'h3', label: 'About', path: '/about', isExternal: false, isOpenInNewTab: false, isEnabled: true },
      { id: 'h4', label: 'Contact', path: '/contact', isExternal: false, isOpenInNewTab: false, isEnabled: true }
    ]
  },
  footer: {
    backgroundColor: '#111827',
    textColor: '#d1d5db',
    copyrightText: 'TechNova IT Solutions. All rights reserved.',
    showYear: true,
    columns: [
      {
        id: 'c1',
        title: 'About Us',
        type: 'text',
        content: 'We provide cutting-edge IT solutions to help businesses scale securely and efficiently.'
      },
      {
        id: 'c2',
        title: 'Quick Links',
        type: 'links',
        links: [
          { label: 'Home', url: '/' },
          { label: 'About', url: '/about' },
          { label: 'Blog', url: '/blog' }
        ]
      },
      {
        id: 'c3',
        title: 'Services',
        type: 'links',
        links: [
          { label: 'Managed IT', url: '/services' },
          { label: 'Cloud Solutions', url: '/services' },
          { label: 'Cybersecurity', url: '/services' }
        ]
      },
      {
        id: 'c4',
        title: 'Contact',
        type: 'contact'
      }
    ]
  },
  services: [
    {
      id: '1',
      title: 'Managed IT Services',
      description: 'Proactive monitoring and maintenance of your IT infrastructure.',
      icon: 'Server'
    },
    {
      id: '2',
      title: 'Cloud Solutions',
      description: 'Scalable cloud migration and management services.',
      icon: 'Cloud'
    },
    {
      id: '3',
      title: 'Cybersecurity',
      description: 'Comprehensive security assessments and threat monitoring.',
      icon: 'ShieldCheck'
    },
    {
      id: '4',
      title: 'AI Integration',
      description: 'Deploy custom AI models to automate your business workflow.',
      icon: 'Bot'
    }
  ],
  pages: [
    {
      id: 'home',
      title: 'Home Page',
      slug: 'home',
      isPublished: true,
      isSystem: true,
      description: 'Welcome to TechNova',
      sections: [
        {
          id: 'h1',
          type: 'hero',
          content: {
            title: 'Enterprise-Grade IT Solutions',
            subtitle: 'We empower your organization with cutting-edge technology, secure cloud infrastructure, and 24/7 support.',
            linkText: 'Get Started',
            linkUrl: '/contact',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
          }
        },
        {
          id: 'stats1',
          type: 'stats',
          content: {
            items: [
              { label: 'Clients Served', value: '500+' },
              { label: 'Uptime Guaranteed', value: '99.9%' },
              { label: 'Experts', value: '50+' }
            ]
          }
        },
        {
          id: 's1',
          type: 'services',
          content: {
            title: 'Our Expertise',
            subtitle: 'Comprehensive technology solutions designed to scale.'
          }
        },
        {
          id: 'f1',
          type: 'features',
          content: {
            title: 'Why Choose Us?',
            items: [
              { title: '24/7 Support', description: 'Always on monitoring.' },
              { title: 'Certified Experts', description: 'Top tier professionals.' },
              { title: 'Secure by Design', description: 'Security first approach.' }
            ]
          }
        },
        {
          id: 'faq1',
          type: 'faq',
          content: {
            title: 'Frequently Asked Questions',
            items: [
              { question: 'Do you offer 24/7 support?', answer: 'Yes, our managed services include round-the-clock monitoring and support.' },
              { question: 'Can you migrate legacy systems?', answer: 'Absolutely. We specialize in modernizing legacy infrastructure to the cloud.' }
            ]
          }
        },
        {
          id: 'cta1',
          type: 'cta',
          content: {
            title: 'Ready to Transform Your IT?',
            text: 'Contact us today for a free consultation.',
            linkText: 'Contact Us',
            linkUrl: '/contact'
          }
        }
      ]
    },
    {
      id: 'p1',
      title: 'Our Methodology',
      slug: 'methodology',
      isPublished: true,
      description: 'How we deliver success.',
      sections: [
        {
          id: 's1',
          type: 'hero',
          content: {
            title: 'Agile & Secure',
            subtitle: 'Our proven methodology ensures your project succeeds.',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop'
          }
        },
        {
          id: 'process1',
          type: 'process',
          content: {
            title: 'Our Process',
            items: [
              { title: 'Discovery', description: 'We analyze your current infrastructure and needs.' },
              { title: 'Strategy', description: 'We build a comprehensive roadmap for success.' },
              { title: 'Execution', description: 'We deploy solutions with minimal downtime.' }
            ]
          }
        }
      ]
    }
  ],
  blogPosts: [
    {
      id: 'b1',
      title: 'Deep Tech Series Vol. 6: How Nature-Inspired Deep Tech is Shaping a Sustainable Future',
      slug: 'deep-tech-nature-inspired',
      excerpt: 'In a world where technological advancement is a constant, the most transformative innovations are often those that look back to nature for inspiration.',
      content: '<p class="text-lg font-serif italic mb-6">In a world where technological advancement is a constant, the most transformative innovations are often <strong>those that look back to nature for inspiration.</strong> For billions of years, nature has been refining solutions to the challenges of survival, offering a vast repository of wisdom that we are only beginning to tap into.</p><p>From the intricate design of <u>bird wings that inspired early aviation</u> pioneers to the <u>underwater adhesion of mussels</u> that led to the development of advanced waterproof adhesives, nature’s ingenuity has been the blueprint for many technological marvels.</p>',
      author: 'Weijing Ye',
      authors: [
        {
          name: 'Weijing Ye',
          role: 'Technology and Innovation Analyst, UNDP Global Centre Singapore',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'
        },
        {
          name: 'Benjamin C.K. Tee',
          role: 'Vice President (Ecosystem Building) NUS Enterprise',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
        },
        {
          name: 'Sofie Andal',
          role: 'Deep Tech Intern, UNDP Global Centre Singapore',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
        }
      ],
      date: '2024-10-16',
      isPublished: true,
      tags: 'Deep Tech, Sustainability',
      coverImage: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=2076&auto=format&fit=crop',
      imageCaption: 'This image was created by Author with the assistance of DALL-E 3'
    }
  ],
  blogSettings: {
    layout: 'grid',
    showSidebar: true,
    postsPerPage: 6,
    sidebarTitle: 'Explore'
  },
  aiApps: [
    {
      id: 'app1',
      name: 'Email Generator',
      slug: 'email-gen',
      description: 'Generate professional business emails instantly.',
      actionLabel: 'Generate Email',
      outputType: 'text',
      promptTemplate: 'Write a professional email about {{topic}} to {{recipient}} with a {{tone}} tone.',
      inputs: [
        { id: 'i1', label: 'Topic', key: 'topic', type: 'text', placeholder: 'Meeting request' },
        { id: 'i2', label: 'Recipient', key: 'recipient', type: 'text', placeholder: 'Client Name' },
        { id: 'i3', label: 'Tone', key: 'tone', type: 'select', options: 'Formal,Casual,Urgent' }
      ]
    }
  ],
  jobs: [
    {
      id: 'j1',
      title: 'Senior Frontend Developer',
      slug: 'frontend-dev',
      department: 'Engineering',
      location: 'San Francisco, CA',
      isRemote: true,
      type: 'Full-time',
      salaryRange: '$120,000 - $160,000',
      experience: '5+ Years',
      isActive: true,
      postedDate: new Date().toISOString(),
      description: '<p>We are looking for an expert in React and TypeScript to lead our frontend initiatives.</p><ul><li>Build pixel-perfect UIs</li><li>Optimize application performance</li><li>Mentor junior developers</li></ul>',
      requirements: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      benefits: ['Health Insurance', 'Unlimited PTO', 'Remote Work Stipend', '401k Matching']
    }
  ],
  applications: [],
  content: {
    about: {
      title: 'About TechNova',
      content: 'Founded in 2020, TechNova has rapidly grown into a leading provider of comprehensive IT services.',
      mission: 'To deliver reliable, secure, and scalable technology solutions.'
    },
    contact: {
      email: 'contact@technova.inc',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Park Blvd, Silicon Valley, CA'
    }
  },
  activityLogs: []
};