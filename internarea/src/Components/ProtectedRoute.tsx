import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectuser, selectIsLoading } from "@/Feature/Userslice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import { MapPin } from "lucide-react";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector(selectuser);
  const isLoading = useSelector(selectIsLoading);
  const router = useRouter();

  const handleAuthRedirect = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Successfully authenticated. Welcome back!");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Authentication Required</h2>
          <p className="text-gray-600 mb-8 text-center leading-relaxed">
            Please login or register as a Candidate to apply for internships, save jobs, and access protected routes.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleAuthRedirect}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-bold shadow-md transition"
            >
              Login / Register
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 font-bold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
