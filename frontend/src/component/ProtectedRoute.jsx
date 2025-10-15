import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with message
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location,
          message: "Please log in to access the dashboard" 
        }} 
        replace 
      />
    );
  }

  // Optional: Check if email is verified
  if (currentUser && !currentUser.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Not Verified</h2>
          <p className="text-gray-600 mb-6">
            Please verify your email address to access the dashboard.
          </p>
          <button
            onClick={() => auth.currentUser.sendEmailVerification()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Resend Verification Email
          </button>
        </div>
      </div>
    );
  }

  return children;
}