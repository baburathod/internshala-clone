import React, { use, useEffect, useRef, useState } from "react";
import logo from "../Assets/logo.png";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import { ChevronDown, ChevronUp, Search, Menu, X, Globe, Bell, MessageSquare, Moon, Sun } from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import { useTheme } from "next-themes";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showFrenchOtp, setShowFrenchOtp] = useState(false);
  const [frenchOtp, setFrenchOtp] = useState("");
  const [verifyingFrench, setVerifyingFrench] = useState(false);
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications/${user.uid}`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const markNotificationAsRead = async (id: string, link: string) => {
    try {
      await axios.put(`${API_BASE_URL}/api/notifications/${id}/read`);
      fetchNotifications();
      if (link) window.location.href = link;
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/notifications/mark-all-read/${user.uid}`);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

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
      // onAuthStateChanged in _app.tsx will handle the backend sync automatically
    } catch (error: any) {
      console.error("signInWithPopup error:", error);
      if (error.code === 'auth/popup-blocked') {
        toast.error("Popup blocked! Please allow popups for this site.");
      } else {
        toast.error(error.message || "Login failed");
      }
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
        await axios.post(`${API_BASE_URL}/api/language/request-french`, { uid: user.uid });
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
      await axios.post(`${API_BASE_URL}/api/language/verify-french`, { uid: user.uid, otpCode: frenchOtp });
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
            <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
              <Link href={"/internship"} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 whitespace-nowrap cursor-pointer">
                <span>{t('navbar.internships')}</span>
              </Link>
              <Link href={"/job"} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 whitespace-nowrap cursor-pointer">
                <span>{t('navbar.jobs')}</span>
              </Link>
              <Link href={"/community"} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 whitespace-nowrap cursor-pointer">
                <span>{t('navbar.community')}</span>
              </Link>
              <Link href={"/subscriptions"} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 whitespace-nowrap cursor-pointer">
                <span>{t('navbar.subscriptions')}</span>
              </Link>
              <Link href={"/resume-builder"} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 whitespace-nowrap cursor-pointer">
                <span>Resume Builder</span>
              </Link>
              <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 flex-shrink-0">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="ml-2 bg-transparent focus:outline-none text-sm w-32 xl:w-48"
                />
              </div>
            </div>

            {/* Auth Buttons & Lang Selector (Desktop) */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              
              <div className="relative">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 whitespace-nowrap"
                >
                  <Globe size={20} />
                  <span className="uppercase">{i18n.language}</span>
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 border z-50">
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
                <div className="relative flex items-center space-x-3 lg:space-x-5 flex-shrink-0">
                  
                  {/* Theme Toggle */}
                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-gray-600 hover:text-blue-600 focus:outline-none"
                    aria-label="Toggle Theme"
                  >
                    {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                  </button>

                  {/* Messages Icon */}
                  <Link href="/messages" className="text-gray-600 hover:text-blue-600 focus:outline-none relative" aria-label="Messages">
                    <MessageSquare size={24} />
                  </Link>

                  {/* Notification Bell */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="text-gray-600 hover:text-blue-600 focus:outline-none relative"
                      aria-label="Notifications"
                    >
                      <Bell size={24} />
                      {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {notifications.filter(n => !n.isRead).length}
                        </span>
                      )}
                    </button>
                    
                    {showNotifications && (
                      <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border overflow-hidden z-50">
                        <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                          <h3 className="font-bold text-gray-800">Notifications</h3>
                          <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline">
                            Mark all read
                          </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                          ) : (
                            notifications.map(notif => (
                              <div 
                                key={notif._id} 
                                onClick={() => markNotificationAsRead(notif._id, notif.link)}
                                className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                              >
                                <div className="flex space-x-3">
                                  {notif.relatedUser?.photo && (
                                    <img src={notif.relatedUser.photo} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                                  )}
                                  <div>
                                    <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                      {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {new Date(notif.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link href={"/security"} className="text-gray-700 hover:text-blue-600 font-medium transition whitespace-nowrap">
                    Security
                  </Link>
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                      className="flex items-center focus:outline-none flex-shrink-0"
                    >
                      <img src={user.photo} alt="" className="w-8 h-8 rounded-full ring-2 ring-transparent hover:ring-blue-500 transition" />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border z-50">
                        <Link 
                          href={"/profile"} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-medium"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handlelogout();
                          }}
                        >
                          {t('navbar.logout')}
                        </button>
                      </div>
                    )}
                  </div>
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link href={"/internship"} className="block text-gray-700 hover:text-blue-600 py-2">
              {t('navbar.internships')}
            </Link>
            <Link href={"/job"} className="block text-gray-700 hover:text-blue-600 py-2">
              {t('navbar.jobs')}
            </Link>
            <Link href={"/community"} className="block text-gray-700 hover:text-blue-600 py-2">
              {t('navbar.community')}
            </Link>
            <Link href={"/subscriptions"} className="block text-gray-700 hover:text-blue-600 py-2">
              {t('navbar.subscriptions')}
            </Link>
            <Link href={"/resume-builder"} className="block text-gray-700 hover:text-blue-600 py-2">
              Resume Builder
            </Link>
            
            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <button
                  className="w-full text-left text-gray-700 hover:text-blue-600 py-2"
                  onClick={handlelogout}
                >
                  {t('navbar.logout')}
                </button>
              ) : (
                <button
                  onClick={handlelogin}
                  className="w-full text-center bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 mt-2"
                >
                  {t('navbar.login')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
