import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
interface LoginPopupProps {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ setAuth }) => {
  const [mode, setMode] = useState<"doctor" | "guest">("doctor");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "https://di5esbfx1i.execute-api.ap-south-1.amazonaws.com/api";

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("user_id", res.data.user_id);

        setAuth(true);
        navigate("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !phone) {
      setError("Please enter both email and phone number");
      return;
    }

    // Store guest details locally (no API call)
    localStorage.setItem("auth", "true");
    localStorage.setItem("username", email+phone);

    setAuth(true);
    navigate("/dashboard_guest");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
    <Navbar isLoginPage={true}/>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          {mode === "doctor" ? "Doctor Login" : "Patient Login"}
        </h2>

        {/* Mode Switch */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setMode("doctor")}
            className={`px-4 py-2 rounded-l-lg border transition-all ${
              mode === "doctor" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Doctor
          </button>
          <button
            onClick={() => setMode("guest")}
            className={`px-4 py-2 rounded-r-lg border transition-all ${
              mode === "guest" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Patient
          </button>
        </div>

        {/* Doctor Login Form */}
        {mode === "doctor" && (
          <form onSubmit={handleDoctorLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
              required
            />
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* Patient Login Form */}
        {mode === "guest" && (
          <form onSubmit={handleGuestLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Continue as Guest
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPopup;