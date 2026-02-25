import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaCheck } from "react-icons/fa";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      if (response.data.success) {
        setIsSuccess(true);
      } else {
        setError(response.data.error || "Failed to reset password");
      }
    } catch (err) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || "Failed to reset password");
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-8 space-y-6 w-full max-w-md bg-white rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Invalid Token</h2>
            <p className="mt-2 text-gray-600">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <div className="flex justify-center">
            <Link
              to="/sign-in"
              className="px-4 py-2 text-white bg-[#1cd35c] rounded-lg hover:bg-[#19b850] transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 space-y-6 w-full max-w-md bg-white rounded-xl shadow-md"
      >
        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Password Reset Successful
            </h2>
            <p className="text-gray-600">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </p>
            <Link
              to="/sign-in"
              className="block w-full py-3 text-center text-white bg-[#1cd35c] rounded-xl hover:bg-[#19b850] transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Reset Your Password
              </h2>
              <p className="mt-2 text-gray-600">
                Please enter your new password below
              </p>
            </div>

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
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <FaLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border-2 border-gray-100 shadow rounded-xl focus:outline-none focus:border-[#1cd35c] transition-colors"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <FaLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border-2 border-gray-100 shadow rounded-xl focus:outline-none focus:border-[#1cd35c] transition-colors"
                    placeholder="Confirm new password"
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
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
