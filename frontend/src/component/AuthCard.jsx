export default function AuthCard({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-blue-100/30 to-white relative overflow-hidden">
      {/* Curved transition element */}
      <div className="absolute hidden md:block left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      
      {/* Wave separator */}
      <div className="absolute hidden md:block left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-300/50 to-transparent"></div>

      {/* LEFT SIDE - Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-blue-200/40">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
              🛍️ ShopEase
            </h1>
            <p className="text-gray-600 mt-2 text-sm">{title}</p>
          </div>
          {children}
        </div>
      </div>

      {/* RIGHT SIDE - Illustration Section */}
      <div className="hidden md:flex flex-1 items-center justify-center relative">
        <div className="text-center p-8 relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-gray-800 drop-shadow-sm">
            Start Your Shopping Journey
          </h2>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto text-lg">
            Join thousands of happy customers discovering great products.
          </p>

          <div className="relative">
            <img
              src="/iluustrate.svg"
              alt="Shopping Illustration"
              className="w-4/5 mx-auto rounded-2xl shadow-lg transform hover:rotate-1 transition-transform duration-500"
            />
            {/* Decorative dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
          </div>
        </div>
        
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-l from-blue-200/10 via-transparent to-transparent"></div>
      </div>
    </div>
  );
}