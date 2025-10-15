import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthCard from "../component/AuthCard";

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
  
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate("/dashboard");
    }
    
    setLoading(false);
  };

  return (
    <AuthCard title="Create Your ShopEase Account 🛍️">
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-2 rounded-md text-white font-semibold transition-all ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center text-sm mt-6 text-gray-600">
        Already have an account?{" "}
        <Link 
          to="/login" 
          className="text-blue-600 font-medium hover:underline hover:text-blue-700"
        >
          Log In
        </Link>
      </p>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </AuthCard>
  );
};

export default Signup;