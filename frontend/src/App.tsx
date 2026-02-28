import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense, useRef } from "react";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import { LazyMotion, domAnimation } from "framer-motion";
import { devLog } from "./utils/logger";
import AppErrorBoundary from "./components/common/AppErrorBoundary";
import { applyLanguageToPage, getPreferredLanguage, languageEvents } from "./utils/i18nRuntime";

// Lazy load all page components for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const BookDemo = lazy(() => import("./pages/BookDemo"));
const SignIn = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Tools = lazy(() => import("./pages/Tools"));
const PrivacyMatters = lazy(() => import("./pages/PrivacyMatters"));
const Legal = lazy(() => import("./pages/Legal"));
const Industries = lazy(() => import("./pages/Industries"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Products = lazy(() => import("./pages/Products"));
const Resources = lazy(() => import("./pages/Resources"));
const Insights = lazy(() => import("./pages/Insights"));
const SolutionDetail = lazy(() => import("./pages/SolutionDetail"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ProductDddc = lazy(() => import("./pages/ProductDddc"));
const ProductDataMapping = lazy(() => import("./pages/ProductDataMapping"));
const ProductRopa = lazy(() => import("./pages/ProductRopa"));
const ProductApplicationPbd = lazy(() => import("./pages/ProductApplicationPbd"));
const ProductNewProjectDpia = lazy(() => import("./pages/ProductNewProjectDpia"));
const ProductTprm = lazy(() => import("./pages/ProductTprm"));
const ProductFreeTools = lazy(() => import("./pages/ProductFreeTools"));
const ProductConsentManagement = lazy(() => import("./pages/ProductConsentManagement"));
const ProductDsrRequest = lazy(() => import("./pages/ProductDsrRequest"));
const ProductDataBreach = lazy(() => import("./pages/ProductDataBreach"));
const ProductAuditEvidenceReadiness = lazy(() => import("./pages/ProductAuditEvidenceReadiness"));
const FAQ = lazy(() => import("./pages/FAQ"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const Glossary = lazy(() => import("./pages/Glossary"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PrivacyNotice = lazy(() => import("./pages/PrivacyNotice"));
const RightsManagement = lazy(() => import("./pages/RightsManagement"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy"));
const ManageCommunication = lazy(() => import("./pages/ManageCommunication"));
const CookieNotice = lazy(() => import("./pages/CookieNotice"));
const ComplianceInformation = lazy(() => import("./pages/ComplianceInformation"));
const Careers = lazy(() => import("./pages/Careers"));
const JobOpenings = lazy(() => import("./pages/JobOpenings"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Partners = lazy(() => import("./pages/Partners"));

// Keep these as regular imports (small components)
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";

const BASE_URL = "https://www.proteccio.com";

const routeSeoMap: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Proteccio | Next-Gen Data Privacy & Compliance Stack",
    description:
      "Proteccio provides an intelligent, automated privacy compliance stack for modern enterprises.",
  },
  "/about": {
    title: "About Us | Proteccio",
    description: "Learn about Proteccio's mission, team, and approach to privacy and compliance.",
  },
  "/services": {
    title: "Services | Proteccio",
    description: "Explore Proteccio services for privacy operations, assessments, and compliance delivery.",
  },
  "/contact": {
    title: "Contact | Proteccio",
    description: "Get in touch with Proteccio for demos, partnerships, and support.",
  },
  "/book-demo": {
    title: "Book a Free Demo | Proteccio",
    description: "Schedule a Proteccio demo to see our privacy and compliance platform in action.",
  },
  "/products": {
    title: "Products | Proteccio",
    description: "Discover Proteccio products across the privacy lifecycle: know, document, assess, control, and prove.",
  },
  "/products/data-discovery-classification-dd-dc": {
    title: "DD&DC | Proteccio",
    description: "Learn about Proteccio DD&DC to discover and classify sensitive data for better governance and compliance.",
  },
  "/products/data-mapping": {
    title: "Data Mapping | Proteccio",
    description: "Learn how Proteccio Data Mapping helps visualize data flows, storage locations, and transfer risks.",
  },
  "/products/records-of-processing-activities-ropa": {
    title: "RoPA | Proteccio",
    description:
      "Learn how Proteccio RoPA automates and centralizes processing activity records with dashboards and audit trails.",
  },
  "/products/privacy-by-design-for-applications-pbd": {
    title: "Application PbD | Proteccio",
    description:
      "Learn how Proteccio Application PbD embeds privacy-by-design controls across your software development lifecycle.",
  },
  "/products/new-project-dpia": {
    title: "New Project DPIA | Proteccio",
    description:
      "Learn how Proteccio New Project DPIA supports risk assessment, mitigation tracking, and exportable reports.",
  },
  "/products/third-party-risk-management-tprm": {
    title: "TPRM | Proteccio",
    description:
      "Learn how Proteccio TPRM centralizes third-party risk assessments, due diligence, and vendor compliance tracking.",
  },
  "/products/free-assessment-tools": {
    title: "Free Tools | Proteccio",
    description:
      "Explore Proteccio free privacy and security assessment tools for cookie scanning, gap analysis, and compliance reporting.",
  },
  "/products/consent-management": {
    title: "Consent Management | Proteccio",
    description:
      "Learn how Proteccio Consent Management helps capture, track, and audit user consent across processing workflows.",
  },
  "/products/dsr-request-management": {
    title: "DSR Request | Proteccio",
    description:
      "Learn how Proteccio DSR Request Management automates intake, tracking, and fulfillment of data subject rights requests.",
  },
  "/products/data-breach-management": {
    title: "Data Breach | Proteccio",
    description:
      "Learn how Proteccio Data Breach Management supports rapid detection, incident response, and regulatory reporting.",
  },
  "/products/audit-evidence-readiness": {
    title: "Audit & Evidence Readiness | Proteccio",
    description:
      "Learn how Proteccio helps teams centralize evidence and prepare audit-ready compliance packages with full traceability.",
  },
  "/solutions": {
    title: "Solutions | Proteccio",
    description: "Privacy and compliance solutions mapped to global regulations and industry needs.",
  },
  "/resources": {
    title: "Resources | Proteccio",
    description: "Access guides, case studies, events, and learning resources from Proteccio.",
  },
  "/insights": {
    title: "Insights | Proteccio",
    description: "Read privacy and compliance insights, trends, and expert commentary from Proteccio.",
  },
  "/tools": {
    title: "Free Tools | Proteccio",
    description: "Use Proteccio free tools for readiness checks, risk visibility, and privacy operations.",
  },
  "/careers": {
    title: "Careers | Proteccio",
    description: "Explore careers at Proteccio and join our team building trust-first privacy technology.",
  },
  "/job-openings": {
    title: "Job Openings | Proteccio Careers",
    description: "Browse current job openings at Proteccio and apply online.",
  },
  "/events": {
    title: "Events | Proteccio",
    description: "See upcoming Proteccio events, webinars, and industry sessions.",
  },
  "/faq": {
    title: "FAQ | Proteccio",
    description: "Find answers to frequently asked questions about Proteccio products and services.",
  },
  "/privacy-notice": {
    title: "Privacy Notice | Proteccio",
    description: "Read Proteccio's privacy notice and data handling commitments.",
  },
  "/cookies-policy": {
    title: "Cookies Policy | Proteccio",
    description: "Learn how Proteccio uses cookies and similar technologies.",
  },
};

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen bg-[#0B1221] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-[#1cd35c] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white/60 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

// Modify the RouteChangeTracker to handle HubSpot loading
function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const config =
      routeSeoMap[path] ||
      (path.startsWith("/job-openings/")
        ? {
          title: "Job Details | Proteccio Careers",
          description: "Review responsibilities and apply for this role at Proteccio.",
        }
        : path.startsWith("/events/")
          ? {
            title: "Event Details | Proteccio",
            description: "Explore event details, sessions, and participation information.",
          }
          : {
            title: "Proteccio | Privacy & Compliance",
            description: "Proteccio helps organizations manage privacy and compliance with confidence.",
          });

    document.title = config.title;
    upsertMeta("meta[name='description']", { name: "description", content: config.description });
    upsertMeta("meta[property='og:title']", { property: "og:title", content: config.title });
    upsertMeta("meta[property='og:description']", { property: "og:description", content: config.description });
    upsertMeta("meta[property='og:url']", { property: "og:url", content: `${BASE_URL}${path}` });
    upsertMeta("meta[property='og:type']", { property: "og:type", content: "website" });
    upsertMeta("meta[property='og:site_name']", { property: "og:site_name", content: "Proteccio" });
    upsertMeta("meta[name='twitter:title']", { name: "twitter:title", content: config.title });
    upsertMeta("meta[name='twitter:description']", { name: "twitter:description", content: config.description });
    upsertMeta("meta[name='twitter:card']", { name: "twitter:card", content: "summary_large_image" });
    upsertCanonical(`${BASE_URL}${path}`);

    // Send pageview to Google Analytics
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_title: config.title,
      });
    }
  }, [location]);

  useEffect(() => {
    const applySelectedLanguage = () => {
      void applyLanguageToPage(getPreferredLanguage());
    };

    applySelectedLanguage();
    window.addEventListener(languageEvents.eventName, applySelectedLanguage);
    return () => {
      window.removeEventListener(languageEvents.eventName, applySelectedLanguage);
    };
  }, [location.pathname]);

  return null;
}

// Update type definitions

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    HubSpotConversations?: {
      widget: {
        load: () => void;
        remove: () => void;
      };
    };
  }
}

function App() {
  const checkHubspotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // --- HubSpot Loading Logic ---

    // 2. Check if script already exists (e.g., from HMR or previous renders)
    const existingScript = document.getElementById("hs-script-loader");
    if (existingScript) {
      devLog("HubSpot script tag already exists.");
      // Optionally, you might want to check if window.HubSpotConversations exists too
      return; // Don't add it again
    }

    // 3. Create and append the script tag
    const script = document.createElement("script");
    script.src = "//js.hs-scripts.com/242436478.js";
    script.async = true;
    script.defer = true;
    script.id = "hs-script-loader";

    script.addEventListener("load", () => {
      devLog("HubSpot script file loaded, checking for API...");
      // Check periodically if the HubSpot API is available
      checkHubspotIntervalRef.current = setInterval(() => {
        if (window.HubSpotConversations) {
          devLog(
            "HubSpot API (window.HubSpotConversations) is available!"
          );
          if (checkHubspotIntervalRef.current) clearInterval(checkHubspotIntervalRef.current);
          // You could potentially call window.HubSpotConversations.widget.load() here
          // if loadImmediately was set to false in settings.
        }
      }, 500); // Check more frequently initially

      // Stop checking after a timeout
      setTimeout(() => {
        if (checkHubspotIntervalRef.current) clearInterval(checkHubspotIntervalRef.current);
        if (!window.HubSpotConversations) {
          console.error(
            "HubSpot API failed to become available after 10 seconds."
          );
        }
      }, 10000);
    });

    script.addEventListener("error", () => {
      console.error("Failed to load the HubSpot script file.");
      if (checkHubspotIntervalRef.current) clearInterval(checkHubspotIntervalRef.current); // Stop checking if script fails
    });

    document.body.appendChild(script);

    // 4. Cleanup function
    return () => {
      devLog(
        "App component unmounting - cleaning up HubSpot script (if desired)"
      );
      // Stop the interval checker if it's still running
      if (checkHubspotIntervalRef.current) clearInterval(checkHubspotIntervalRef.current);

      // Optional: Remove the widget UI if the App unmounts (rare)
      // window.HubSpotConversations?.widget?.remove();

      // Optional: Remove the script tag itself
      const scriptToRemove = document.getElementById("hs-script-loader");
      if (scriptToRemove) {
        // Check if parentNode exists before trying to remove
        if (scriptToRemove.parentNode) {
          scriptToRemove.parentNode.removeChild(scriptToRemove);
          devLog("Removed HubSpot script tag.");
        }
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <LazyMotion features={domAnimation}>
          <BrowserRouter>
            <ScrollToTop />
            <RouteChangeTracker />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="services" element={<Services />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="book-demo" element={<BookDemo />} />


                  <Route path="tools" element={<Tools />} />
                  <Route path="privacy-notice" element={<PrivacyNotice />} />
                  <Route path="privacy-matters" element={<PrivacyMatters />} />
                  <Route path="legal" element={<Legal />} />
                  <Route path="rights-management" element={<RightsManagement />} />
                  <Route path="cookies-policy" element={<CookiesPolicy />} />
                  <Route path="cookie-notice" element={<CookieNotice />} />
                  <Route path="compliance-information" element={<ComplianceInformation />} />
                  <Route path="manage-communication" element={<ManageCommunication />} />
                  <Route path="industries" element={<Industries />} />
                  <Route path="solutions" element={<Solutions />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/data-discovery-classification-dd-dc" element={<ProductDddc />} />
                  <Route path="products/data-mapping" element={<ProductDataMapping />} />
                  <Route path="products/records-of-processing-activities-ropa" element={<ProductRopa />} />
                  <Route path="products/privacy-by-design-for-applications-pbd" element={<ProductApplicationPbd />} />
                  <Route path="products/new-project-dpia" element={<ProductNewProjectDpia />} />
                  <Route path="products/third-party-risk-management-tprm" element={<ProductTprm />} />
                  <Route path="products/free-assessment-tools" element={<ProductFreeTools />} />
                  <Route path="products/consent-management" element={<ProductConsentManagement />} />
                  <Route path="products/dsr-request-management" element={<ProductDsrRequest />} />
                  <Route path="products/data-breach-management" element={<ProductDataBreach />} />
                  <Route path="products/audit-evidence-readiness" element={<ProductAuditEvidenceReadiness />} />
                  <Route path="resources" element={<Resources />} />
                  <Route path="insights" element={<Insights />} />
                  <Route path="solutions/:solutionId" element={<SolutionDetail />} />
                  <Route path="solution-detail" element={<SolutionDetail />} />
                  <Route path="product-detail" element={<ProductDetail />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="case-studies" element={<CaseStudies />} />
                  <Route path="case-studies/:id" element={<CaseStudyDetail />} />
                  <Route path="glossary" element={<Glossary />} />
                  <Route path="careers" element={<Careers />} />
                  <Route path="job-openings" element={<JobOpenings />} />
                  <Route path="job-openings/:jobId" element={<JobDetail />} />
                  <Route path="events" element={<Events />} />
                  <Route path="events/:id" element={<EventDetail />} />
                  <Route path="partners" element={<Partners />} />
                  <Route path="sign-in" element={<SignIn />} />
                </Route>
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:token" element={<ResetPassword />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Routes>
            </Suspense>
            <CookieConsent />
          </BrowserRouter>
        </LazyMotion>
      </AuthProvider>
    </AppErrorBoundary>
  );
}

export default App;
