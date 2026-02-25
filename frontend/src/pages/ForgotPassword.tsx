import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      if (response.data.success) {
        setResetEmailSent(true);
        setResetMessage(
          "Password reset email sent. Please check your inbox and follow the link to reset your password."
        );
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } catch (err) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || "Failed to send reset email");
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 space-y-8 bg-white rounded-2xl shadow-md"
        >
          {/* Logo and Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Forgot Password
            </h2>
            <p className="mt-2 text-gray-600">
              Enter your email to receive a password reset link
            </p>
          </div>

          {resetEmailSent ? (
            <div className="space-y-6">
              <div className="p-4 text-center bg-green-50 rounded-xl">
                <div className="flex justify-center mb-4">
                  <div className="flex justify-center items-center w-12 h-12 bg-green-100 rounded-full">
                    <FaEnvelope className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-green-800">
                  Email Sent!
                </h3>
                <p className="mt-2 text-green-700">{resetMessage}</p>
              </div>
              <Link
                to="/sign-in"
                className="flex items-center justify-center gap-2 text-[#1cd35c] hover:text-[#19b850] transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 text-center text-red-500 bg-red-50 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <FaEnvelope className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border-2 border-gray-100 shadow rounded-xl focus:outline-none focus:border-[#1cd35c] transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#1cd35c] text-white rounded-xl hover:bg-[#19b850] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1cd35c]"
              >
                {isLoading ? (
                  <motion.div
                    className="flex justify-center items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  </motion.div>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/sign-in"
                  className="text-sm text-[#1cd35c] hover:text-[#19b850] transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
