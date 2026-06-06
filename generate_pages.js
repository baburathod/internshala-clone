const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'internarea', 'src', 'pages');

const pages = [
  { folder: 'about', title: 'About Us', hero: 'Empowering the Next Generation of Professionals', sections: ['Company Mission', 'Our Vision', 'Why Intern Area Exists', 'Platform Statistics', 'Meet the Team', 'Student Success Stories'] },
  { folder: 'careers', title: 'Careers at Intern Area', hero: 'Join Our Mission to Transform Hiring', sections: ['Open Positions', 'Benefits & Perks', 'Hiring Process', 'Work Culture', 'Apply Now'] },
  { folder: 'contact', title: 'Contact Us', hero: 'We are Here to Help', sections: ['Get in Touch', 'Support Email: support@internarea.com', 'Business Inquiries: business@internarea.com', 'Office Location', 'Frequently Asked Questions'] },
  { folder: 'blog', title: 'Intern Area Blog', hero: 'Insights, Tips, and Industry News', sections: ['Featured Articles', 'Categories', 'Latest Posts', 'Search functionality coming soon'] },
  { folder: 'news', title: 'In the News', hero: 'Company Announcements & Updates', sections: ['Press Releases', 'Product Updates', 'Platform Milestones', 'Media Coverage'] },
  { folder: 'media-kit', title: 'Media Kit', hero: 'Brand Resources & Guidelines', sections: ['Brand Description', 'Download Logos', 'Brand Guidelines', 'Press Contacts'] },
  { folder: 'help-center', title: 'Help Center', hero: 'How Can We Help You Today?', sections: ['Search for answers', 'Account Support', 'Payment Support', 'Community Support', 'Browse FAQ Categories'] },
  { folder: 'events', title: 'Events & Workshops', hero: 'Join Our Upcoming Events', sections: ['Upcoming Career Fairs', 'Live Webinars', 'Skill Workshops', 'Past Events Archive'] },
  { folder: 'startups', title: 'For Startups', hero: 'Scale Your Team with Top Talent', sections: ['Startup Hiring Solutions', 'Why Choose Us', 'Pricing Plans for Startups', 'Success Stories'] },
  { folder: 'enterprise', title: 'For Enterprise', hero: 'Enterprise-Grade Recruitment Solutions', sections: ['Bulk Hiring Capabilities', 'Dedicated Account Support', 'Advanced Analytics', 'Contact Sales'] },
  { folder: 'government', title: 'For Government', hero: 'Public Sector Hiring Solutions', sections: ['Internship Programs', 'Compliance & Security', 'Partner with Us'] },
  { folder: 'saas', title: 'SaaS Integrations', hero: 'Seamless ATS Integrations', sections: ['Connect Your Tools', 'Supported ATS Platforms', 'Automation Features', 'API Documentation'] },
  { folder: 'ecommerce', title: 'Retail & Ecommerce Hiring', hero: 'Find Retail Talent Fast', sections: ['Warehouse Hiring', 'Retail Store Staffing', 'Seasonal Recruitment Solutions'] },
  { folder: 'privacy-policy', title: 'Privacy Policy', hero: 'Your Privacy is Important', sections: ['Data Collection Practices', 'Cookie Policy', 'Your User Rights', 'Data Retention', 'Security Measures'] },
  { folder: 'terms', title: 'Terms & Conditions', hero: 'Platform Terms of Service', sections: ['User Obligations', 'Platform Rules', 'Subscription Terms', 'Refund Policy', 'Legal Disclaimers'] }
];

pages.forEach(page => {
  const dirPath = path.join(pagesDir, page.folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const sectionsHtml = page.sections.map(sec => `
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">${sec}</h2>
          <p className="text-gray-600 leading-relaxed">
            Detailed information about ${sec.toLowerCase()} will be displayed here. We are continuously updating our platform to provide the best experience for our users.
          </p>
        </div>`).join('');

  const fileContent = `import React from 'react';
import Head from 'next/head';
import { ArrowRight } from 'lucide-react';

const ${page.folder.replace(/-/g, '')}Page = () => {
  return (
    <>
      <Head>
        <title>${page.title} | Intern Area</title>
        <meta name="description" content="${page.hero}" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              ${page.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-blue-100 max-w-3xl mx-auto">
              ${page.hero}
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            ${sectionsHtml}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-blue-50 rounded-2xl p-8 md:p-12 text-center border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
            <p className="text-lg text-gray-600 mb-8">Join thousands of students and companies on Intern Area.</p>
            <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Explore Platform <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ${page.folder.replace(/-/g, '')}Page;
`;

  fs.writeFileSync(path.join(dirPath, 'index.tsx'), fileContent);
  console.log(`Generated ${page.folder}/index.tsx`);
});

// Generate Sitemap Page separately
const sitemapDir = path.join(pagesDir, 'sitemap');
if (!fs.existsSync(sitemapDir)) fs.mkdirSync(sitemapDir, { recursive: true });

const sitemapContent = `import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SitemapPage = () => {
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/job' },
    { name: 'Internships', path: '/internship' },
    { name: 'Community', path: '/community' },
    { name: 'Subscriptions', path: '/subscriptions' },
    { name: 'Dashboard', path: '/userapplication' },
    { name: 'Profile', path: '/profile' },
    { name: 'Blog', path: '/blog' },
    { name: 'Help Center', path: '/help-center' },
    { name: 'Contact', path: '/contact' },
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms' },
  ];

  return (
    <>
      <Head>
        <title>Sitemap | Intern Area</title>
        <meta name="description" content="Sitemap for Intern Area" />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b">Site Map</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {routes.map((route, i) => (
              <Link key={i} href={route.path} className="text-lg text-blue-600 hover:text-blue-800 hover:underline flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {route.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SitemapPage;
`;

fs.writeFileSync(path.join(sitemapDir, 'index.tsx'), sitemapContent);
console.log('Generated sitemap/index.tsx');
