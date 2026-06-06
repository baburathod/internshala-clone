import Footer from "@/Components/Fotter";
import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store/store";
import { Provider, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";
import { login, logout, setLoading } from "@/Feature/Userslice";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import API_BASE_URL from "@/config/api";
import "@/config/i18n"; // Import i18n configuration
import { ThemeProvider } from 'next-themes';

function AuthListener({ setShowOtpModal, setPendingAuthUser }: { setShowOtpModal: any, setPendingAuthUser: any }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authuser) => {
      if (authuser) {
        // Silently sync user to backend MongoDB
        try {
          await axios.post(`${API_BASE_URL}/api/users/sync`, {
            uid: authuser.uid,
            name: authuser.displayName,
            email: authuser.email,
            photo: authuser.photoURL,
          }).catch(err => console.error("Backend sync failed:", err));

          // Verify Login Constraints & Chrome OTP
          const verifyRes = await axios.post(`${API_BASE_URL}/api/auth/verify-login`, { uid: authuser.uid })
            .catch(err => err.response);

          if (verifyRes && verifyRes.status === 200) {
            // Direct Success (Not Chrome, Not Restricted)
            dispatch(login({
              uid: authuser.uid,
              photo: authuser.photoURL,
              name: authuser.displayName,
              email: authuser.email,
              phoneNumber: authuser.phoneNumber,
            }));
          } else if (verifyRes && verifyRes.status === 401 && verifyRes.data?.error === "OTP_REQUIRED") {
            // Chrome User -> OTP Required
            setPendingAuthUser(authuser);
            setShowOtpModal(true);
          } else if (verifyRes && verifyRes.status === 403) {
            // Mobile Time Restriction Failed
            toast.error(verifyRes.data?.error || "Login restricted from this device at this time.");
            await signOut(auth);
            dispatch(logout());
          } else {
            // Unknown Error or Network Error
            console.error("Failed to verify login, verifyRes:", verifyRes);
            if (!verifyRes) {
               toast.error("Network Error: Could not reach backend API.");
            } else {
               toast.error("Failed to verify login.");
            }
            await signOut(auth);
            dispatch(logout());
          }
        } catch (err) {
          console.error("Auth flow error:", err);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
      dispatch(setLoading(false));
    });
    return () => unsubscribe();
  }, [dispatch, setShowOtpModal, setPendingAuthUser]);
  
  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingAuthUser, setPendingAuthUser] = useState<any>(null);
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otpCode) return toast.error("Please enter the OTP");
    setVerifying(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, { uid: pendingAuthUser.uid, otpCode });
      
      // Verification successful, dispatch login
      store.dispatch(login({
        uid: pendingAuthUser.uid,
        photo: pendingAuthUser.photoURL,
        name: pendingAuthUser.displayName,
        email: pendingAuthUser.email,
        phoneNumber: pendingAuthUser.phoneNumber,
      }));
      
      toast.success("Login Verified!");
      setShowOtpModal(false);
      setPendingAuthUser(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleCancelOtp = async () => {
    await signOut(auth);
    store.dispatch(logout());
    setShowOtpModal(false);
    setPendingAuthUser(null);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Provider store={store}>
        <AuthListener setShowOtpModal={setShowOtpModal} setPendingAuthUser={setPendingAuthUser} />
        <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ToastContainer/>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chrome Security Check</h2>
            <p className="text-gray-600 mb-6">We've detected you're using Chrome. For security, we've sent an OTP to your email.</p>
            <label htmlFor="chromeOtp" className="sr-only">OTP Code</label>
            <input 
              id="chromeOtp"
              name="chromeOtp"
              autoComplete="one-time-code"
              type="text" 
              placeholder="Enter 6-digit OTP" 
              className="border-2 border-gray-300 w-full p-3 rounded text-center text-xl tracking-widest focus:border-blue-500 outline-none mb-6"
              value={otpCode}
              onChange={e => setOtpCode(e.target.value)}
              maxLength={6}
            />
            <div className="flex space-x-4">
              <button onClick={handleVerifyOtp} disabled={verifying} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
                {verifying ? "Verifying..." : "Verify"}
              </button>
              <button onClick={handleCancelOtp} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Provider>
    </ThemeProvider>
  );
}
