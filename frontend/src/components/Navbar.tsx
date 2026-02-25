import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Lock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelector from "./LanguageSelector";

// Disable cache during development
// This can be done in your server configuration or by using a service worker with cache control

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [suppressHoverOpen, setSuppressHoverOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeDropdownOnScroll = () => {
      if (!activeDropdown) return;
      setActiveDropdown(null);
      setSuppressHoverOpen(true);
    };

    window.addEventListener("scroll", closeDropdownOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", closeDropdownOnScroll);
  }, [activeDropdown]);

  useEffect(() => {
    setActiveDropdown(null);
    setIsOpen(false);
  }, [location.pathname, location.search, location.hash]);

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (pathOrEvent?: string | React.MouseEvent) => {
    const path = typeof pathOrEvent === 'string' ? pathOrEvent : undefined;
    if (!path || location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    setSuppressHoverOpen(true);
    setActiveDropdown(null);
    setIsOpen(false);
  };

  const desktopNavItemClass =
    "nav-clean flex items-center text-sm font-semibold text-white hover:text-white/85 transition-colors duration-200";

  const NavLink = ({ to, label, external = false }: { to: string; label: string; external?: boolean }) => {
    const active = isActive(to);

    const content = (
      <span className="relative py-2">
        {label}
        {active && (
          <motion.div
            layoutId="nav-active"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#1cd35c] rounded-full shadow-[0_0_8px_rgba(28,211,92,0.8)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </span>
    );

    if (external) {
      return (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={`${desktopNavItemClass} ${active ? "text-white" : ""}`}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        to={to}
        onClick={() => handleNavClick(to)}
        className={`${desktopNavItemClass} ${active ? "text-white" : ""}`}
      >
        {content}
      </Link>
    );
  };

  const dropdownMenus = {
    solutions: [
      {
        title: "Privacy Regulations",
        desc: "Privacy regulations we support",
        path: "/solutions#global-regulations",
      },
      {
        title: "Sector governance",
        desc: "Industry specific governance and risk expertise",
        path: "/solutions#industry-compliance",
      },
      {
        title: "international standards",
        desc: "Can this support certifications and audits?",
        path: "/solutions#management-systems",
      },
    ],
    products: [
      {
        title: "Know",
        desc: "Understand where personal data exists and how it flows.",
        path: "/products?category=know",
      },
      {
        title: "Document",
        desc: "Create a single source of truth for processing activities.",
        path: "/products?category=document",
      },
      {
        title: "Assess",
        desc: "Identify and manage privacy and compliance risk early.",
        path: "/products?category=assess",
      },
      {
        title: "Control",
        desc: "Operationalize privacy across workflows and teams.",
        path: "/products?category=control",
      },
      {
        title: "Prove",
        desc: "Demonstrate compliance with confidence.",
        path: "/products?category=prove",
      },
    ],
    resources: [
      {
        label: "About Us",
        path: "/about",
        status: "available",
      },
      {
        label: "Careers",
        path: "/careers",
        status: "available",
      },
      {
        label: "Case Study",
        path: "/case-studies",
        status: "available",
      },
      {
        label: "FAQ",
        path: "/faq",
        status: "available",
      },
      {
        label: "Free Tools",
        path: "/tools",
        external: false,
        status: "available",
      },
      {
        label: "Glossary of Terms",
        path: "/glossary",
        status: "available",
      },
      {
        label: "Industries",
        path: "/industries",
        status: "available",
      },
      {
        label: "Insights",
        path: "/insights",
        status: "available",
      },
      {
        label: "Events",
        path: "/events",
        status: "available",
      },
    ],
  };

  return (
    <div className="relative">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 
          ${isScrolled
            ? "bg-black/80 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
          }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Proteccio Data"
                  className="h-auto w-[220px] object-contain"
                />
              </Link>
            </div>


            {/* Desktop Navigation */}
            <div
              className="hidden items-center space-x-10 md:flex"
              onMouseLeave={() => {
                setActiveDropdown(null);
                setSuppressHoverOpen(false);
              }}
            >
              {/* Solutions Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => {
                  if (!suppressHoverOpen) setActiveDropdown("solutions");
                }}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "solutions" ? null : "solutions"
                    )
                  }
                  className={desktopNavItemClass}
                >
                  Solutions
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <AnimatePresence>
                  {activeDropdown === "solutions" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      onClickCapture={() => setActiveDropdown(null)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute left-0 z-50 mt-2 w-[400px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden p-4"
                    >
                      <div className="space-y-2">
                        {dropdownMenus.solutions.map((item, idx) => (
                          <div key={idx}>
                            {/* Note: using standard a tag or Link with hash requires handling if on same page */}
                            {/* Since we are using React Router, we can use Link or a custom handler that scrolls */}
                            <a
                              href={item.path}
                              className="block p-4 rounded-lg hover:bg-white/5 group/card transition-colors relative border border-transparent hover:border-white/5"
                              onClick={() => {
                                // Simple hash navigation handoff
                                setActiveDropdown(null);
                                // If we are already on solutions page, we might need to force scroll
                                // But standardized 'href' with hash usually works in browsers
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="text-white font-bold text-sm mb-1 group-hover/card:text-[#1cd35c] transition-colors">
                                    {item.title}
                                  </h4>
                                  <p className="text-white/50 text-xs leading-relaxed">
                                    {item.desc}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[#1cd35c] opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300 transform mt-1" />
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Products Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => {
                  if (!suppressHoverOpen) setActiveDropdown("products");
                }}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "products" ? null : "products"
                    )
                  }
                  className={desktopNavItemClass}
                >
                  Products
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <AnimatePresence>
                  {activeDropdown === "products" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      onClickCapture={() => setActiveDropdown(null)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute left-0 z-50 mt-2 w-[400px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold px-4 mb-2">The Privacy Journey</p>
                        {dropdownMenus.products.map((item, idx) => (
                          <div key={idx}>
                            <a
                              href={item.path}
                              className="block p-4 rounded-lg hover:bg-white/5 group/card transition-colors relative border border-transparent hover:border-white/5"
                              onClick={() => {
                                setActiveDropdown(null);
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="text-white font-bold text-sm mb-1 group-hover/card:text-[#1cd35c] transition-colors">
                                    {item.title}
                                  </h4>
                                  <p className="text-white/50 text-xs leading-relaxed">
                                    {item.desc}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[#1cd35c] opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300 transform mt-1" />
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resources Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => {
                  if (!suppressHoverOpen) setActiveDropdown("resources");
                }}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "resources" ? null : "resources"
                    )
                  }
                  className={desktopNavItemClass}
                >
                  Resources
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <AnimatePresence>
                  {activeDropdown === "resources" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      onClickCapture={() => setActiveDropdown(null)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute left-0 z-50 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl"
                    >
                      <ul className="py-2">
                        {dropdownMenus.resources.map((item, idx) => (
                          <li key={idx}>
                            {item.external ? (
                              <a
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-[#1cd35c] transition-colors duration-200"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <span>{item.label}</span>
                                {item.status === "coming_soon" && (
                                  <span className="text-[10px] text-[#1cd35c] bg-[#1cd35c]/10 border border-[#1cd35c]/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold uppercase tracking-tighter">
                                    <Lock className="w-2.5 h-2.5" /> Soon
                                  </span>
                                )}
                              </a>
                            ) : (
                              <Link
                                to={item.path}
                                className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-[#1cd35c] transition-colors duration-200"
                                onClick={() => {
                                  handleNavClick(item.path);
                                }}
                              >
                                <span>{item.label}</span>
                                {item.status === "coming_soon" && (
                                  <span className="text-[10px] text-[#1cd35c] bg-[#1cd35c]/10 border border-[#1cd35c]/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold uppercase tracking-tighter">
                                    <Lock className="w-2.5 h-2.5" /> Soon
                                  </span>
                                )}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              <NavLink to="/contact" label="Contact" />
              <NavLink to="/partners" label="Partners with us" />

              <div className="flex items-center space-x-4 ml-auto">
                <Link
                  to="/sign-in"
                  onClick={() => handleNavClick("/sign-in")}
                  className="fx-btn px-5 py-2.5 text-sm font-medium text-[#1cd35c] hover:text-white border-2 border-[#1cd35c] hover:bg-[#1cd35c] rounded-full transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/book-demo"
                  onClick={() => handleNavClick("/book-demo")}
                  className="fx-btn px-5 py-2.5 text-sm font-medium rounded-full text-white bg-[#1cd35c] hover:bg-[#19b850] transition-all duration-300"
                >
                  Book a Free Demo
                </Link>
                <LanguageSelector />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full text-white/90 hover:text-[#1cd35c] hover:bg-white/5 transition-colors duration-200"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu with improved styling */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/95 backdrop-blur-xl border-t border-white/10 md:hidden"
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                <div className="px-3 py-2">
                  <span className="block text-base font-medium text-gray-300 mb-2">Solutions</span>
                  <div className="pl-4 space-y-2 border-l border-white/10 ml-2">
                    {dropdownMenus.solutions.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className="block py-2 text-sm text-gray-400 hover:text-[#1cd35c] transition-colors"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="px-3 py-2">
                  <span className="block text-base font-medium text-gray-300 mb-2">Products</span>
                  <div className="pl-4 space-y-2 border-l border-white/10 ml-2">
                    {dropdownMenus.products.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className="block py-2 text-sm text-gray-400 hover:text-[#1cd35c] transition-colors"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>

                <Link
                  to="/resources"
                  onClick={() => handleNavClick()}
                  className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-white/5 hover:text-white"
                >
                  Resources
                </Link>
                <Link
                  to="/industries"
                  onClick={() => handleNavClick()}
                  className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-white/5 hover:text-white"
                >
                  Industries
                </Link>
                <Link
                  to="/case-studies"
                  onClick={() => handleNavClick()}
                  className="block px-3 py-2 text-base font-medium text-white/90 rounded-md hover:bg-white/5"
                >
                  Case Study
                </Link>
                <Link
                  to="/glossary"
                  onClick={() => handleNavClick()}
                  className="block px-3 py-2 text-base font-medium text-white/90 rounded-md hover:bg-white/5"
                >
                  Glossary of Terms
                </Link>
                <Link
                  to="/about"
                  onClick={() => handleNavClick()}
                  className="block px-3 py-2 text-base font-medium text-white/90 rounded-md hover:bg-white/5"
                >
                  About Us
                </Link>
                <Link
                  to="/partners"
                  onClick={() => handleNavClick()}
                  className="block px-3 py-2 text-base font-medium text-white/90 rounded-md hover:bg-white/5"
                >
                  Partners with us
                </Link>


                <LanguageSelector mobile />

                <Link
                  to="/sign-in"
                  onClick={() => handleNavClick()}
                  className="fx-btn block w-full text-center px-4 py-3 mt-4 text-base font-medium text-[#1cd35c] border-2 border-[#1cd35c] rounded-full hover:bg-[#1cd35c] hover:text-white transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/book-demo"
                  onClick={() => handleNavClick()}
                  className="fx-btn block w-full text-center px-4 py-3 text-base font-medium text-white bg-[#1cd35c] rounded-full hover:bg-[#19b850] transition-colors duration-300"
                >
                  Book a Free Demo
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav >
    </div >
  );
};

export default Navbar;
