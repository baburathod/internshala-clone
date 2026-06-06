const fs = require('fs');
const path = require('path');

const pages = [
  // Company
  { slug: 'about', title: 'About Us', purpose: 'To connect millions of students with meaningful career opportunities.', hireInfo: 'We are expanding our team across 10 locations.', salaryInfo: 'Competitive base + equity.', cta: 'Join Us' },
  { slug: 'careers', title: 'Careers', purpose: 'Build the future of recruitment with us.', hireInfo: 'Openings in Engineering, Product, and Sales.', salaryInfo: 'Top tier compensation.', cta: 'View Open Roles' },
  { slug: 'press', title: 'Press & Media', purpose: 'Sharing our journey and milestones with the world.', hireInfo: 'Looking for PR managers.', salaryInfo: '$80k - $120k annually.', cta: 'Download Media Kit' },
  { slug: 'news', title: 'News', purpose: 'Stay updated with the latest from Intern Area.', hireInfo: 'Hiring content writers.', salaryInfo: 'Competitive rates.', cta: 'Subscribe to Newsletter' },
  { slug: 'media-kit', title: 'Media Kit', purpose: 'Brand assets and guidelines for Intern Area.', hireInfo: 'Brand designers wanted.', salaryInfo: '$90k - $130k annually.', cta: 'Download Logos' },
  { slug: 'contact', title: 'Contact Us', purpose: 'We are here to help you 24/7.', hireInfo: 'Customer Success agents wanted.', salaryInfo: '$60k - $80k annually.', cta: 'Get in Touch' },
  // Resources
  { slug: 'blog', title: 'Blog', purpose: 'Insights on careers, internships, and growth.', hireInfo: 'Editors and writers needed.', salaryInfo: 'Flexible pay.', cta: 'Read Latest Post' },
  { slug: 'newsletter', title: 'Newsletter', purpose: 'Weekly tips delivered to your inbox.', hireInfo: 'Marketing specialists needed.', salaryInfo: '$70k - $100k annually.', cta: 'Subscribe Now' },
  { slug: 'events', title: 'Events', purpose: 'Join our virtual and physical career fairs.', hireInfo: 'Event coordinators wanted.', salaryInfo: '$70k - $90k annually.', cta: 'View Schedule' },
  { slug: 'help-center', title: 'Help Center', purpose: 'Find answers to common questions quickly.', hireInfo: 'Support engineers wanted.', salaryInfo: '$80k - $110k annually.', cta: 'Browse FAQs' },
  { slug: 'tutorials', title: 'Tutorials', purpose: 'Learn how to maximize your chances of getting hired.', hireInfo: 'Instructional designers wanted.', salaryInfo: '$80k - $110k annually.', cta: 'Start Learning' },
  { slug: 'support', title: 'Support', purpose: 'Direct assistance from our dedicated team.', hireInfo: 'Technical support reps wanted.', salaryInfo: '$60k - $90k annually.', cta: 'Open a Ticket' },
  // Solutions
  { slug: 'startups', title: 'Startups', purpose: 'Affordable hiring solutions for early-stage companies.', hireInfo: 'Account executives wanted.', salaryInfo: '$100k+ OTE.', cta: 'Hire Interns' },
  { slug: 'enterprise', title: 'Enterprise', purpose: 'Scalable recruitment for large organizations.', hireInfo: 'Enterprise sales directors wanted.', salaryInfo: '$200k+ OTE.', cta: 'Contact Sales' },
  { slug: 'government', title: 'Government', purpose: 'Secure and compliant hiring for public sector.', hireInfo: 'Compliance officers wanted.', salaryInfo: '$120k - $150k annually.', cta: 'Learn More' },
  { slug: 'saas', title: 'SaaS', purpose: 'Integrate our hiring API into your software.', hireInfo: 'Integration engineers wanted.', salaryInfo: '$130k - $160k annually.', cta: 'View API Docs' },
  { slug: 'marketplaces', title: 'Marketplaces', purpose: 'Custom solutions for job boards and networks.', hireInfo: 'Business development managers wanted.', salaryInfo: '$110k - $140k annually.', cta: 'Partner with Us' },
  { slug: 'ecommerce', title: 'Ecommerce', purpose: 'Hire seasonal and full-time ecommerce staff.', hireInfo: 'Retail specialists wanted.', salaryInfo: '$80k - $100k annually.', cta: 'Start Hiring' },
  // Legal
  { slug: 'terms', title: 'Terms & Conditions', purpose: 'The rules governing the use of Intern Area.', hireInfo: 'Legal counsel wanted.', salaryInfo: '$150k - $200k annually.', cta: 'Accept Terms' },
  { slug: 'privacy-policy', title: 'Privacy Policy', purpose: 'How we protect and handle your personal data.', hireInfo: 'Data privacy officers wanted.', salaryInfo: '$140k - $180k annually.', cta: 'Review Policy' },
  { slug: 'sitemap', title: 'Sitemap', purpose: 'Navigate through all pages on Intern Area.', hireInfo: 'SEO specialists wanted.', salaryInfo: '$90k - $120k annually.', cta: 'Explore Site' },
  // Locations (in /internships/)
  { slug: 'internships/new-york', title: 'Internships in New York', purpose: 'Find top internships in the Big Apple.', hireInfo: 'Local recruiters wanted.', salaryInfo: '$100k - $130k annually.', cta: 'View NY Jobs' },
  { slug: 'internships/los-angeles', title: 'Internships in Los Angeles', purpose: 'Launch your career in LA.', hireInfo: 'Local recruiters wanted.', salaryInfo: '$100k - $130k annually.', cta: 'View LA Jobs' },
  { slug: 'internships/chicago', title: 'Internships in Chicago', purpose: 'Opportunities in the Windy City.', hireInfo: 'Local recruiters wanted.', salaryInfo: '$90k - $120k annually.', cta: 'View Chicago Jobs' },
  { slug: 'internships/houston', title: 'Internships in Houston', purpose: 'Energy and tech internships in Houston.', hireInfo: 'Local recruiters wanted.', salaryInfo: '$90k - $120k annually.', cta: 'View Houston Jobs' },
  { slug: 'internships/phoenix', title: 'Internships in Phoenix', purpose: 'Growing tech hub opportunities.', hireInfo: 'Local recruiters wanted.', salaryInfo: '$85k - $115k annually.', cta: 'View Phoenix Jobs' },
  { slug: 'internships/philadelphia', title: 'Internships in Philadelphia', purpose: 'Historical city, modern careers.', hireInfo: 'Local recruiters wanted.', salaryInfo: '$90k - $120k annually.', cta: 'View Philly Jobs' },
  { slug: 'internships/san-antonio', title: 'Internships in San Antonio', purpose: 'Start your career in Texas.', hireInfo: 'Local recruiters wanted.', salaryInfo: '$85k - $115k annually.', cta: 'View San Antonio Jobs' },
  { slug: 'internships/san-diego', title: 'Internships in San Diego', purpose: 'Tech and biotech opportunities.', hireInfo: 'Local recruiters wanted.', salaryInfo: '$95k - $125k annually.', cta: 'View San Diego Jobs' },
  { slug: 'internships/dallas', title: 'Internships in Dallas', purpose: 'Corporate and startup roles.', hireInfo: 'Local recruiters wanted.', salaryInfo: '$95k - $125k annually.', cta: 'View Dallas Jobs' },
  { slug: 'internships/san-jose', title: 'Internships in San Jose', purpose: 'Heart of Silicon Valley.', hireInfo: 'Local recruiters wanted.', salaryInfo: '$110k - $150k annually.', cta: 'View San Jose Jobs' },
];

const template = (page) => `
import React from 'react';
import Head from 'next/head';

export default function ${page.slug.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <div className="bg-gray-50 flex flex-col">
      <Head>
        <title>${page.title} | Intern Area - Real World Internships</title>
        <meta name="description" content="${page.purpose}. Find out more about our mission, hiring, and salaries." />
        <meta name="keywords" content="${page.title}, jobs, internships, careers, Intern Area" />
      </Head>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("${page.title}") || "${page.title}"}</h1>
            <p className="text-xl md:text-2xl font-light text-blue-100 max-w-3xl mx-auto">
              ${page.purpose}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Business Purpose</h2>
              <p className="text-gray-700 text-lg mb-4">
                At Intern Area, our mission is to build the ultimate bridge between ambitious talent and industry-leading organizations. ${page.purpose} We believe in creating transparent, scalable, and equitable hiring ecosystems.
              </p>
              
              <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-6">Career Resources</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 text-lg">
                <li>Comprehensive Resume Builder and ATS optimization tools.</li>
                <li>Direct community access to industry peers and mentors.</li>
                <li>Verified company reviews, stipends, and placement stats.</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Hiring Information</h3>
              <div className="mb-6">
                <p className="font-semibold text-gray-800">Current Openings:</p>
                <p className="text-gray-600">${page.hireInfo}</p>
              </div>
              <div className="mb-6">
                <p className="font-semibold text-gray-800">Compensation & Salary:</p>
                <p className="text-gray-600">${page.salaryInfo} Equity, health benefits, and 401(k) matching included.</p>
              </div>
              
              <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                ${page.cta}
              </button>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">How can I apply?</h4>
                <p className="text-gray-600">Simply create an account, complete your profile using our Resume Builder, and click apply on any active listing.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Are the salaries accurate?</h4>
                <p className="text-gray-600">Yes, we enforce strict transparency rules. The compensation listed (${page.salaryInfo}) is fully verified.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Dummy t function for translation compatibility if missing from scope
const t = (str: string) => str;
`;

pages.forEach(page => {
  const parts = page.slug.split('/');
  const dirPath = path.join(__dirname, 'internarea', 'src', 'pages', ...parts);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filePath = path.join(dirPath, 'index.tsx');
  fs.writeFileSync(filePath, template(page));
  console.log('Created: ', filePath);
});
