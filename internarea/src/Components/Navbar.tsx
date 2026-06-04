import React, { use, useEffect, useRef, useState } from "react";
import logo from "../Assets/logo.png";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import { ChevronDown, ChevronUp, Search, Menu, X, Globe } from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser, selectIsLoading } from "@/Feature/Userslice";
import { useTranslation } from "react-i18next";
import axios from "axios";
import API_BASE_URL from "@/config/api";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const user = useSelector(selectuser);
  const isLoading = useSelector(selectIsLoading);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showFrenchOtp, setShowFrenchOtp] = useState(false);
  const [frenchOtp, setFrenchOtp] = useState("");
  const [verifyingFrench, setVerifyingFrench] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
    { code: "pt", name: "Portuguese" },
    { code: "zh", name: "Chinese" },
    { code: "fr", name: "French" },
  ];

  const handlelogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("logged in successfully");
    } catch (error) {
      console.error("signInWithPopup error:", error);
      toast.error("login failed");
    }
  };
  
  const handlelogout = () => {
    signOut(auth);
  };

  const handleLanguageChange = async (langCode: string) => {
    setShowLangMenu(false);
    if (langCode === 'fr') {
      if (!user) {
        toast.error("You must be logged in to switch to French.");
        return;
      }
      try {
        toast.info("Requesting French activation OTP...");
        await axios.post(`${API_BASE_URL}/language/request-french`, { uid: user.uid });
        setShowFrenchOtp(true);
      } catch (err) {
        toast.error("Failed to request OTP.");
      }
    } else {
      i18n.changeLanguage(langCode);
    }
  };

  const verifyFrenchOtp = async () => {
    if (!frenchOtp) return toast.error("Please enter the OTP.");
    if (!user) return;
    setVerifyingFrench(true);
    try {
      await axios.post(`${API_BASE_URL}/language/verify-french`, { uid: user.uid, otpCode: frenchOtp });
      i18n.changeLanguage('fr');
      toast.success("French activated successfully!");
      setShowFrenchOtp(false);
      setFrenchOtp("");
    } catch (err) {
      toast.error("Invalid or expired OTP.");
    } finally {
      setVerifyingFrench(false);
    }
  };

  return (
    <div className="relative z-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="text-xl font-bold text-blue-600">
                <img src={"/logo.png"} alt="" className="h-16" />
              </a>
            </div>
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Link href={"/internship"}>
                  <span>{t('navbar.internships')}</span>
                </Link>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Link href={"/job"}>
                  <span>{t('navbar.jobs')}</span>
                </Link>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Link href={"/community"}>
                  <span>{t('navbar.community')}</span>
                </Link>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Link href={"/subscriptions"}>
                  <span>{t('navbar.subscriptions')}</span>
                </Link>
              </button>
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="ml-2 bg-transparent focus:outline-none text-sm w-48"
                />
              </div>
            </div>

            {/* Auth Buttons & Lang Selector (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              
              <div className="relative">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <Globe size={20} />
                  <span className="uppercase">{i18n.language}</span>
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 border">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${i18n.language === lang.code ? 'bg-gray-100 font-bold' : ''}`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : user ? (
                <div className="relative flex items-center space-x-4">
                  <Link href={"/profile"}>
                    <img src={user.photo} alt="" className="w-8 h-8 rounded-full" />
                  </Link>
                  <button
                    className="text-gray-700 hover:text-blue-600"
                    onClick={handlelogout}
                  >
                    {t('navbar.logout')}
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={handlelogin}
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                  >
                    {t('navbar.login')}
                  </button>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* French OTP Modal */}
      {showFrenchOtp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('navbar.verify_french') || "Verify French"}</h2>
            <p className="text-gray-600 mb-6">Enter the OTP sent to your email to activate the French language.</p>
            <label htmlFor="frenchOtp" className="sr-only">French OTP Code</label>
            <input 
              id="frenchOtp"
              name="frenchOtp"
              autoComplete="one-time-code"
              type="text" 
              placeholder="6-digit OTP" 
              className="border-2 border-gray-300 w-full p-3 rounded text-center text-xl tracking-widest focus:border-blue-500 outline-none mb-6"
              value={frenchOtp}
              onChange={e => setFrenchOtp(e.target.value)}
              maxLength={6}
            />
            <div className="flex space-x-4">
              <button onClick={verifyFrenchOtp} disabled={verifyingFrench} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
                {verifyingFrench ? "Verifying..." : "Verify"}
              </button>
              <button onClick={() => setShowFrenchOtp(false)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
