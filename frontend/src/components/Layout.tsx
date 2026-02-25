import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import CookieModal from './CookieModal';
import Footer from './Footer';

const Layout = () => {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Noise Texture Overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay z-0"></div>

        {/* Floating Particles Background from SignIn */}
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

      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />

      {/* Global Cookie Preference Button */}
      <button
        aria-label="Open cookie preferences"
        className="fixed right-4 md:right-[25px] bottom-20 md:bottom-[90px] p-3 text-white bg-[#1cd35c] rounded-full shadow-lg hover:bg-[#19b850] focus:outline-none z-[9999]"
        onClick={() => setIsCookieModalOpen(true)}
      >
        <Cookie className="w-6 h-6" />
      </button>

      {isCookieModalOpen && (
        <CookieModal
          onClose={() => setIsCookieModalOpen(false)}
          onSave={() => setIsCookieModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
