const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'internarea', 'src', 'pages');

const pagesData = {
  'internships/new-york': { title: 'Internships in New York', desc: 'Find the best internships in NYC. From Wall Street to Broadway, kickstart your career.', items: ['Finance', 'Tech', 'Media'] },
  'internships/los-angeles': { title: 'Internships in Los Angeles', desc: 'Discover opportunities in LA. Entertainment, tech startups, and more.', items: ['Entertainment', 'Tech', 'Marketing'] },
  'internships/chicago': { title: 'Internships in Chicago', desc: 'Explore internships in the Windy City.', items: ['Business', 'Engineering', 'Sales'] },
  'internships/san-francisco': { title: 'Internships in San Francisco', desc: 'Silicon Valley tech internships and startup roles.', items: ['Software Engineering', 'Product Management', 'Design'] },
  'internships/miami': { title: 'Internships in Miami', desc: 'Sunny opportunities in hospitality, real estate, and tech.', items: ['Hospitality', 'Real Estate', 'Tech'] },
  'internships/seattle': { title: 'Internships in Seattle', desc: 'Join the cloud computing capital of the world.', items: ['Cloud Computing', 'Retail', 'Engineering'] },
  
  'about': { title: 'About Us', desc: 'Our mission is to equip every student with real-world skills.', section: 'Company Story, Leadership Team, Statistics.' },
  'careers': { title: 'Careers at Internshala Clone', desc: 'Join our team. We offer great benefits, remote work, and endless growth.', section: 'Open Positions: Software Engineer, Product Designer, Marketing Manager.' },
  'press': { title: 'Press & Media', desc: 'Awards, Press Releases, and Media Coverage.', section: 'Featured in TechCrunch, Forbes, and NYT.' },
  'news': { title: 'Company News', desc: 'Product Updates, Feature Launches, and Announcements.', section: 'Latest: Multi-language support launched globally!' },
  'media-kit': { title: 'Media Kit', desc: 'Brand guidelines, logos, typography, and colors.', section: 'Primary Color: Blue (#2563EB). Font: Inter.' },
  'contact': { title: 'Contact Us', desc: 'Get in touch with our business and support teams.', section: 'Email: support@example.com | Phone: 1-800-123-4567 | HQ: San Francisco, CA' },
  
  'blog': { title: 'Career Blog', desc: 'Resume Tips, Interview Guides, and Career Advice.', section: 'Trending: How to ace a Playwright automation interview.' },
  'newsletter': { title: 'Newsletter', desc: 'Subscribe for weekly alerts on internships and career updates.', section: 'Join 500,000+ students getting weekly job alerts.' },
  'events': { title: 'Events & Webinars', desc: 'Upcoming Career Fairs, Workshops, and Recruitment Drives.', section: 'Next Event: Virtual Tech Job Fair 2026.' },
  'help-center': { title: 'Help Center', desc: 'FAQs, Account Issues, Payments, and Community.', section: 'Search our knowledge base for instant answers.' },
  'tutorials': { title: 'Tutorials', desc: 'Step-by-step guides on Profile Creation, Resume Upload, and Applications.', section: 'Video Guide: How to upgrade your subscription plan.' },
  'support': { title: 'Customer Support', desc: 'Ticket System, Live Chat, and System Status.', section: 'All systems operational. Live chat available 9AM-5PM.' },
  
  'startups': { title: 'Hiring for Startups', desc: 'Find hungry talent to scale your startup.', section: 'Special Startup Pricing: Get 3 free job posts.' },
  'enterprise': { title: 'Enterprise Solutions', desc: 'Analytics, Dedicated Support, and Bulk Hiring.', section: 'Trusted by Fortune 500 companies.' },
  'government': { title: 'Government Recruitment', desc: 'Public Sector Hiring and Compliance Programs.', section: 'Secure, accessible, and compliant hiring.' },
  'saas': { title: 'SaaS Integrations', desc: 'ATS Integration, API Access, and Automation.', section: 'Connect our platform with Workday or Greenhouse.' },
  'marketplaces': { title: 'Marketplaces', desc: 'Partner programs for recruiters and service providers.', section: 'Expand your reach with our marketplace partners.' },
  'ecommerce': { title: 'Ecommerce Hiring', desc: 'Retail, Warehouse, and Seasonal Hiring.', section: 'Case Study: How Amazon hired 10,000 seasonal interns.' },
  
  'team-diary': { title: 'Team Diary', desc: 'Behind the scenes at our company. Employee stories and events.', section: 'Read about our annual company retreat in Bali.' },
  
  'terms': { title: 'Terms & Conditions', desc: 'User Rules, Employer Rules, and Liability Disclaimer.', section: 'Last updated: June 2026. By using this service you agree to our strict rules.' },
  'privacy-policy': { title: 'Privacy Policy', desc: 'Data Collection, Cookies, User Rights, and GDPR Compliance.', section: 'We protect your data. Read our cookie and retention policies.' },
  
  'sitemap': { title: 'Sitemap', desc: 'Complete directory of all platform pages.', section: '/jobs, /internships, /community, /profile, /subscriptions' },
  'android-app': { title: 'Get the Android App', desc: 'Download our app from the Play Store for on-the-go applications.', section: 'Features: Instant Notifications, 1-Click Apply. Scan QR Code to download.' }
};

Object.entries(pagesData).forEach(([route, data]) => {
  const isNested = route.includes('/');
  let dirPath = '';
  let filePath = '';
  
  if (isNested) {
    const parts = route.split('/');
    dirPath = path.join(baseDir, parts[0]);
    filePath = path.join(dirPath, `${parts[1]}.tsx`);
  } else {
    dirPath = path.join(baseDir, route);
    filePath = path.join(dirPath, 'index.tsx');
  }

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const content = `
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Head>
        <title>\${data.title} - Internshala Clone</title>
        <meta name="description" content="\${data.desc}" />
      </Head>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-4">\${data.title}</h1>
        <p className="text-xl max-w-2xl mx-auto">\${data.desc}</p>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto w-full px-4 py-4 text-sm text-gray-500">
        Home {'>'} Footer {'>'} <span className="font-semibold text-gray-800">\${data.title}</span>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-xl shadow p-8 text-gray-800 leading-relaxed">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Overview</h2>
          <p className="mb-8">\${data.desc}</p>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Details</h2>
          <p className="mb-6 font-medium text-lg">\${data.section ? data.section : 'Explore our offerings and opportunities below.'}</p>
          
          \${data.items ? \`
          <ul className="list-disc pl-5 space-y-2 mb-8">
            \${data.items.map(item => \`<li>\${item}</li>\`).join('')}
          </ul>
          \` : ''}

          <div className="mt-12 bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Need more help?</h3>
            <p className="text-gray-600">Our support team is available 24/7. Check out the Help Center or Contact Us directly.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16 text-center border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to start your journey?</h2>
        <Link href="/">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors cursor-pointer">
            Get Started Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
`;

  fs.writeFileSync(filePath, content);
  console.log('Created:', filePath);
});
