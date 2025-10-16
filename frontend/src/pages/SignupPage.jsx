import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthCard from "../component/AuthCard";
import SocialProviders from "../component/SocialProviders";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Clear form and errors when component mounts
  useEffect(() => {
    clearError();
    setLocalError("");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (localError) setLocalError("");
    if (error) clearError();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setLocalError("");
    clearError();

    // Validation
    if (!formData.firstName || !formData.lastName) {
      setLocalError("First name and last name are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords don't match!");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    console.log('🔄 Starting signup process...', userData);
    
    try {
      const result = await register(userData);
      console.log('📝 Signup result:', result);
      
      if (result && result.success) {
        console.log('✅ Signup successful, navigating to dashboard');
        // Clear form on success
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/dashboard");
      } else {
        console.log('❌ Signup failed:', result?.error);
        setLocalError(result?.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('💥 Unexpected error during signup:', error);
      setLocalError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Combine both local and context errors
  const displayError = localError || error;

  return (
    <AuthCard title="Create Your ShopEase Account 🛍️">
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              autoComplete="given-name"
            />
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              autoComplete="family-name"
            />
          </div>
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
            autoComplete="email"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10"
            required
            minLength="6"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
            autoComplete="new-password"
          />
        </div>

        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 animate-pulse">
            <div className="flex items-center justify-center text-red-600 text-sm">
              <span className="mr-2">⚠️</span>
              {displayError}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-2 rounded-md text-white font-semibold transition-all ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-105"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Account...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <span className="mr-2">🚀</span>
              Create Account
            </span>
          )}
        </button>
      </form>

      <p className="text-center text-sm mt-6 text-gray-600">
        Already have an account?{" "}
        <Link 
          to="/login" 
          className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition-colors"
          onClick={clearError}
        >
          Log In
        </Link>
      </p>

      <div className="text-center text-sm text-gray-500 mt-6 mb-2">or continue with</div>

      <SocialProviders />

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </AuthCard>
  );
};

export default Signup;