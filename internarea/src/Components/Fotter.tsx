import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <FooterSection title="Internship by places" items={[{name:"New York", href:"/"}, {name:"Los Angeles", href:"/"}, {name:"Chicago", href:"/"}, {name:"San Francisco", href:"/"}, {name:"Miami", href:"/"}, {name:"Seattle", href:"/"}]} />
          <FooterSection title="Company" items={[{name:"About us", href:"/about"}, {name:"Careers", href:"/careers"}, {name:"Press", href:"/news"}, {name:"News", href:"/news"}, {name:"Media kit", href:"/media-kit"}, {name:"Contact", href:"/contact"}]} links />
          <FooterSection title="Resources" items={[{name:"Blog", href:"/blog"}, {name:"Newsletter", href:"/news"}, {name:"Events", href:"/events"}, {name:"Help center", href:"/help-center"}, {name:"Tutorials", href:"/help-center"}, {name:"Supports", href:"/contact"}]} links />
          <FooterSection title="Solutions" items={[{name:"Startups", href:"/startups"}, {name:"Enterprise", href:"/enterprise"}, {name:"Government", href:"/government"}, {name:"SaaS", href:"/saas"}, {name:"Marketplaces", href:"/ecommerce"}, {name:"Ecommerce", href:"/ecommerce"}]} links />
        </div>

        <hr className="my-10 border-gray-600" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <FooterSection title="About us" items={[{name:"Startups", href:"/startups"}, {name:"Enterprise", href:"/enterprise"}]} links />
          <FooterSection title="Team diary" items={[{name:"Blog", href:"/blog"}]} links />
          <FooterSection title="Legal" items={[{name:"Terms and conditions", href:"/terms"}, {name:"Privacy Policy", href:"/privacy-policy"}]} links />
          <FooterSection title="Sitemap" items={[{name:"Sitemap", href:"/"}]} links />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center">
          <p className="flex items-center gap-2 border border-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700">
            <i className="bi bi-google-play"></i> Get Android App
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Facebook className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
            <Twitter className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
            <Instagram className="w-6 h-6 hover:text-pink-400 cursor-pointer" />
          </div>
          <p className="mt-4 sm:mt-0 text-sm text-gray-400">© Copyright 2025. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, items, links }:any) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-300">{title}</h3>
      <div className="flex flex-col items-start mt-4 space-y-3">
        {items.map((item:any, index:any) =>
          links ? (
            <Link key={index} href={item.href || "/"} className="text-gray-400 hover:text-blue-400 hover:underline">
              {item.name}
            </Link>
          ) : (
            <p key={index} className="text-gray-400 hover:text-blue-400 hover:underline cursor-pointer">
              {item.name}
            </p>
          )
        )}
      </div>
    </div>
  );
}