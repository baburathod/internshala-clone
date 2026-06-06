
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Head>
        <title>Newsletter - Internshala Clone</title>
        <meta name="description" content="Subscribe for weekly alerts on internships and career updates." />
      </Head>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Newsletter</h1>
        <p className="text-xl max-w-2xl mx-auto">Subscribe for weekly alerts on internships and career updates.</p>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto w-full px-4 py-4 text-sm text-gray-500">
        Home {'>'} Footer {'>'} <span className="font-semibold text-gray-800">Newsletter</span>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-xl shadow p-8 text-gray-800 leading-relaxed">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Overview</h2>
          <p className="mb-8">Subscribe for weekly alerts on internships and career updates.</p>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Details</h2>
          <p className="mb-6 font-medium text-lg">Join 500,000+ students getting weekly job alerts.</p>
          
          

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
