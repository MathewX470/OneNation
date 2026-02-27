import React, { useState } from "react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wide">
            OneNation Portal
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Unified Public Governance Platform
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-white/10 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-md text-sm font-medium transition ${
              isLogin
                ? "bg-white text-slate-900"
                : "text-gray-300"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-md text-sm font-medium transition ${
              !isLogin
                ? "bg-white text-slate-900"
                : "text-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {isLogin ? (
          <form className="space-y-5">

            <div>
              <label className="block text-sm mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Password / OTP
              </label>
              <input
                type="password"
                placeholder="Enter password or OTP"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-semibold"
            >
              Login
            </button>

          </form>
        ) : (
          /* REGISTER FORM */
          <form className="space-y-5">

            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center text-xs text-gray-300">
              <input type="checkbox" className="mr-2" />
              I agree to the Terms & Privacy Policy
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-semibold"
            >
              Register
            </button>

          </form>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-6">
          © 2026 OneNation Digital Governance
        </div>

      </div>
    </div>
  );
}

export default Login;