import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { FaWhatsapp, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { Link } from "react-router-dom";
import CertificationBadges from "./CertificationBadges";
import { devLog } from "../utils/logger";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const companyAddress = "1-1-17/C, Jawahar Nagar, Near RTC X road, Hyderabad, Telangana, India";
  const encodedAddress = encodeURIComponent(companyAddress);
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&z=16&output=embed`;

  useEffect(() => {
    if (shouldLoadMap) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" }
    );

    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldLoadMap]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    devLog("Subscribing email:", email);
    alert("Thank you for subscribing!");
    setEmail("");
  };

  // Define product links here or fetch from a shared source if preferred
  const productsList = [
    {
      label: "RoPA Management Application (RMA)",
      path: "/products",
    },
    {
      label: "Consent Management Application (CMA)",
      path: "/products",
    },
    { label: "Privacy by Design (PbD)", path: "/products" },
    { label: "DPIA Management (DM)", path: "/products" },
    { label: "TPRM Management (TM)", path: "/products" },
    { label: "Datavory Application", path: "/products" },
    { label: "Data Mapping", path: "/products" },
    { label: "DSR Management", path: "/products" },
    { label: "Data Breach Management", path: "/products" },
    {
      label: "ISO ISMS 27001 Assessments (ISO Management)",
      path: "/products",
    },
    {
      label: "ISO PIMS 27701 Assessments (ISO Management)",
      path: "/products",
    },
  ];

  const freeTools = [
    { label: "DPDP Readiness Self-Assessment", path: "/tools" },
    { label: "Sensitive Content & Data Compliance Scanner", path: "/tools" },
    { label: "Privacy & Data Operational Risk Register", path: "/tools" },
    { label: "Vendor Risk Intelligence Dashboard", path: "/tools" },
    { label: "Data Mapping Lite", path: "/tools" },
    { label: "Privacy Policy Health Check", path: "/tools" },
    { label: "Incident Readiness Checker", path: "/tools" },
    { label: "Accountability Clarity Tool", path: "/tools" },
    { label: "Cross-Border Transfer Awareness Tool", path: "/tools" },
  ];

  return (
    <footer className="bg-black backdrop-blur-xl border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1cd35c]/30 to-transparent"></div>
      <div className="px-4 py-16 mx-auto max-w-[85rem] sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Brand and Description */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="Proteccio"
                className="h-[60px] w-[220px] object-cover"
              />
            </div>
            <p className="mb-4 text-white/50 font-medium leading-relaxed">
              Making data privacy simple, transparent, and actionable for everyone. We help
              businesses protect what matters most, their customers' trust, through
              smart, stress free compliance automation.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/919121975512"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-xl text-[#1cd35c] hover:text-white transition-colors duration-300"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://www.linkedin.com/company/protecciodata"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-xl text-[#1cd35c] hover:text-white transition-colors duration-300"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/proteccio_data?igsh=dTZ4MWpkdXExa2Jr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-xl text-[#1cd35c] hover:text-white transition-colors duration-300"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.threads.net/@proteccio_data"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-xl text-[#1cd35c] hover:text-white transition-colors duration-300"
              >
                <FaThreads />
              </a>
            </div>
            <CertificationBadges />

            <div className="mt-6">
              <h4 className="text-white text-sm font-semibold mb-3">Stay Updated</h4>
              <p className="mb-3 text-xs text-white/40 leading-relaxed">
                Get product updates, privacy insights, and regulatory news.
              </p>
              <form onSubmit={handleSubscribe} className="relative max-w-[240px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#1cd35c]/50 transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#1cd35c] hover:bg-[#17a84b] text-black rounded-md transition-colors duration-300 flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Free Tools Section */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Free Tools
            </h3>
            <ul className="space-y-3">
              {freeTools.map((tool) => (
                <li key={tool.label}>
                  <Link
                    to={tool.path}
                    className="text-gray-400 hover:text-[#1cd35c] transition-colors duration-300"
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Section */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Products</h3>
            <ul className="space-y-3">
              {productsList.map((product) => (
                <li key={product.label}>
                  <Link
                    to={product.path}
                    className="text-gray-400 hover:text-[#1cd35c] transition-colors duration-300 block"
                  >
                    {product.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section - Moved to the end */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-400 hover:text-[#1cd35c] transition-colors duration-300">
                <Phone className="mr-3 w-5 h-5" />
                <a href="tel:+919121975512">+91 91219 75512</a>
              </div>
              <div className="flex items-center text-gray-400 hover:text-[#1cd35c] transition-colors duration-300">
                <Mail className="mr-3 w-5 h-5" />
                <a href="mailto:hello@protecciodata.com">
                  hello@protecciodata.com
                </a>
              </div>
              <div className="flex items-start text-gray-400 hover:text-[#1cd35c] transition-colors duration-300">
                <MapPin className="mt-1 mr-3 w-5 h-5 shrink-0" />
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  1-1-17/C, Jawahar Nagar,
                  <br />
                  Near RTC X road,
                  <br />
                  Hyderabad, Telangana,
                  <br />
                  India
                </a>
              </div>

              <div ref={mapContainerRef} className="pt-1">
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-[#1cd35c]/40 transition-colors duration-300"
                  aria-label="Open office location in Google Maps"
                >
                  <div className="relative h-52 w-full">
                    {shouldLoadMap ? (
                      <iframe
                        title="Proteccio office location map"
                        src={mapsEmbedUrl}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="h-full w-full pointer-events-none"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-white/[0.04] to-black flex items-center justify-center text-white/60 text-sm">
                        Loading map preview...
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 rounded-md bg-black/70 border border-white/15 px-2.5 py-1 text-xs font-medium text-white/90">
                      Open in Google Maps
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 mt-8 border-t border-gray-800">
          <div className="flex flex-col justify-between items-center space-y-4 md:flex-row md:space-y-0">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
              <Link
                to="/rights-management"
                className="hover:text-[#1cd35c] transition-colors text-gray-400 duration-200 text-sm"
              >
                Rights Management
              </Link>
              <Link
                to="/manage-communication"
                className="hover:text-[#1cd35c] transition-colors text-gray-400 duration-200 text-sm"
              >
                Communication Preferences
              </Link>
              <Link
                to="/cookies-policy"
                className="hover:text-[#1cd35c] transition-colors text-gray-400 duration-200 text-sm"
              >
                Cookie Preferences
              </Link>
            </div>
            <p className="text-gray-400 text-sm font-medium">
              &copy; 2026 Proteccio Data. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 md:justify-end">
              <Link
                to="/privacy-notice"
                className="hover:text-[#1cd35c] transition-colors text-gray-400 duration-200 text-sm"
              >
                Privacy Notice
              </Link>
              <Link
                to="/cookie-notice"
                className="hover:text-[#1cd35c] transition-colors text-gray-400 duration-200 text-sm"
              >
                Cookie Notice
              </Link>
              <Link
                to="/partners"
                className="hover:text-[#1cd35c] transition-colors text-gray-400 duration-200 text-sm"
              >
                Partners
              </Link>
              <Link
                to="/compliance-information"
                className="hover:text-[#1cd35c] transition-colors text-gray-400 duration-200 text-sm"
              >
                Compliance Information
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
