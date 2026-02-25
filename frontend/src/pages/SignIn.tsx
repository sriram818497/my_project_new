import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);

      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error when user types
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setError("");
    setter(e.target.value);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-24">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#1cd35c]/5 backdrop-blur-sm"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 60 - 30],
              y: [0, Math.random() * 60 - 30],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Green Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1cd35c]/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1cd35c]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px]"
        >
          {/* Glass Card Container */}
          <motion.div
            className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 p-10"
            whileHover={{ boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.3)" }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#1cd35c] to-[#1cd35c] bg-clip-text text-transparent mb-3 leading-tight">
                Welcome back
              </h1>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 text-sm text-red-600 bg-red-50 rounded-2xl border-2 border-red-200"
                >
                  {error}
                </motion.div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-800 mb-2"
                >
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-[#1cd35c] group-focus-within:text-[#1cd35c] transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => handleInputChange(e, setEmail)}
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white/80 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent hover:border-[#1cd35c]/50 transition-all"
                    placeholder="Enter your mail"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-gray-800"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-[#1cd35c] hover:text-[#1cd35c] transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-[#1cd35c] group-focus-within:text-[#1cd35c] transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => handleInputChange(e, setPassword)}
                    className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl bg-white/80 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent hover:border-[#1cd35c]/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-[#1cd35c]" />
                    ) : (
                      <FaEye className="h-5 w-5 text-[#1cd35c]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 flex justify-center items-center py-5 px-6 border border-transparent rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-[#1cd35c] via-[#19b850] to-[#1cd35c] focus:outline-none focus:ring-4 focus:ring-[#1cd35c]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-[#1cd35c]/50 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#1cd35c] via-[#19b850] to-[#1cd35c] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                {isLoading ? (
                  <div className="flex items-center relative z-10">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <span className="relative z-10">Sign in</span>
                )}
              </motion.button>

              {/* Help/Contact Info */}
              <div className="text-center pt-3">
                <p className="text-sm text-gray-600">
                  If you don't have access, please contact us at{" "}
                  <a
                    href="mailto:hello@protecciodata.com"
                    className="font-bold text-[#1cd35c] hover:text-[#17a84b] transition-colors"
                  >
                    hello@protecciodata.com
                  </a>
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Branding with Enhanced Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-10"></div>

        {/* Floating Orbs with Enhanced Animations */}
        <motion.div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Outer Glow Ring */}
          <motion.div
            className="absolute w-[450px] h-[450px] rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(28, 211, 92, 0.15) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Outer Circle with Purple Tint */}
          <motion.div
            className="absolute w-[380px] h-[380px] rounded-full border-[3px] border-[#1cd35c]/20"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Middle Circle with Teal */}
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full border-[3px] border-[#1cd35c]/25"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.08, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Inner Glowing Core */}
          <motion.div
            className="absolute w-[220px] h-[220px] rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(28, 211, 92, 0.4) 0%, rgba(23, 168, 75, 0.25) 40%, transparent 70%)",
              boxShadow: "0 0 120px rgba(28, 211, 92, 0.6), 0 0 80px rgba(23, 168, 75, 0.4)",
            }}
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-16 text-center">
          {/* Logo */}


          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-6xl font-extrabold text-white mb-6 leading-tight max-w-lg drop-shadow-2xl"
          >
            Build Trust Through
            <br />
            <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">
              Data Privacy Compliance
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-white/90 max-w-lg leading-relaxed drop-shadow-lg font-medium"
          >
            Proteccio Data creates privacy software that helps businesses protect data and meet global compliance standards.
          </motion.p>



          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12 flex flex-wrap justify-center gap-3"
          >
            {["GDPR Compliant", "DPDPA Compliant", "ISO 27001 Certified", "ISO 27701 Certified"].map((badge, index) => (
              <motion.div
                key={badge}
                className="px-5 py-2.5 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full text-sm font-semibold text-white shadow-lg"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                {badge}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;


