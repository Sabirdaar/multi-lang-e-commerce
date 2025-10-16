import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SocialProviders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log("🔄 Starting Google Sign-In...");
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log("✅ Google Sign-In Successful:", user);
      
      // Wait a moment for AuthContext to detect the change, then redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);
      setLoading(false);
      
      let errorMessage = "Google sign-in failed. Please try again.";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Sign-in popup was blocked. Please allow popups for this site.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for Google sign-in.";
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`flex items-center justify-center w-full max-w-sm gap-3 bg-white border border-gray-200 text-gray-700 py-2 rounded-md shadow-sm hover:shadow-md hover:bg-gray-50 transition-all ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
        ) : (
          <FcGoogle size={22} />
        )}
        <span className="text-sm font-medium">
          {loading ? "Signing in..." : "Continue with Google"}
        </span>
      </button>
    </div>
  );
}