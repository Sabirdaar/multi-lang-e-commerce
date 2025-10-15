// src/components/SocialProviders.jsx
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { FcGoogle } from "react-icons/fc";

export default function SocialProviders() {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("✅ Google Sign-In Successful:", user);
      // You can redirect or save user info here
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error.message);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center w-full max-w-sm gap-3 bg-white border border-gray-200 text-gray-700 py-2 rounded-md shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
      >
        <FcGoogle size={22} />
        <span className="text-sm font-medium">Continue with Google</span>
      </button>
    </div>
  );
}
