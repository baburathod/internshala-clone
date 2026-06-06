
import React from 'react';
import Head from 'next/head';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Fotter';

export default function newsletterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Newsletter | Intern Area - Real World Internships</title>
        <meta name="description" content="Weekly tips delivered to your inbox.. Find out more about our mission, hiring, and salaries." />
        <meta name="keywords" content="Newsletter, jobs, internships, careers, Intern Area" />
      </Head>

      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("Newsletter") || "Newsletter"}</h1>
            <p className="text-xl md:text-2xl font-light text-blue-100 max-w-3xl mx-auto">
              Weekly tips delivered to your inbox.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Business Purpose</h2>
              <p className="text-gray-700 text-lg mb-4">
                At Intern Area, our mission is to build the ultimate bridge between ambitious talent and industry-leading organizations. Weekly tips delivered to your inbox. We believe in creating transparent, scalable, and equitable hiring ecosystems.
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
                <p className="text-gray-600">Marketing specialists needed.</p>
              </div>
              <div className="mb-6">
                <p className="font-semibold text-gray-800">Compensation & Salary:</p>
                <p className="text-gray-600">$70k - $100k annually. Equity, health benefits, and 401(k) matching included.</p>
              </div>
              
              <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                Subscribe Now
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
                <p className="text-gray-600">Yes, we enforce strict transparency rules. The compensation listed ($70k - $100k annually.) is fully verified.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Dummy t function for translation compatibility if missing from scope
const t = (str: string) => str;
