import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import axios from "axios";
import { devLog } from "../utils/logger";

interface User {
  id: number;
  email: string;
  is_admin: boolean;
  [key: string]: unknown; // For any additional user properties
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_STORAGE_KEY = "token";
const MOCK_ADMIN_EMAIL = import.meta.env.VITE_DEMO_ADMIN_EMAIL || "admin@proteccio.com";
const MOCK_ADMIN_PASSWORD = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || "admin123";
const MOCK_ADMIN_TOKEN = import.meta.env.VITE_DEMO_ADMIN_TOKEN || "mock-admin-token-12345";
const ENABLE_MOCK_AUTH = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_AUTH === "true";
const TOKEN_PATTERN = /^[A-Za-z0-9\-._~+/]+=*$/;
const SERVER_URL = import.meta.env.VITE_SERVER_URL?.trim();
const LOCAL_API_URL = "http://localhost:5000";

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

const resolveApiBaseUrl = () => {
  if (SERVER_URL) return normalizeBaseUrl(SERVER_URL);
  if (import.meta.env.DEV) return LOCAL_API_URL;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return LOCAL_API_URL;
    }
  }

  // Keep same-origin requests for hosted deployments that proxy /api.
  return undefined;
};

const normalizeToken = (value: string | null) => {
  if (!value) return null;
  return TOKEN_PATTERN.test(value) ? value : null;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    normalizeToken(localStorage.getItem(TOKEN_STORAGE_KEY))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up axios defaults
  axios.defaults.baseURL = resolveApiBaseUrl();

  // Set token in axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  // Load user on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // --- MOCK USER LOAD (For Local Development) ---
      if (ENABLE_MOCK_AUTH && token === MOCK_ADMIN_TOKEN) {
        devLog("Restoring Mock Admin Session");
        const mockUser: User = {
          id: 999,
          email: MOCK_ADMIN_EMAIL,
          is_admin: true,
          name: "System Administrator"
        };
        setUser(mockUser);
        setLoading(false);
        return;
      }
      // ----------------------------------------------

      try {
        const res = await axios.get("/api/auth/profile");
        if (res.data.success) {
          // Ensure is_admin is converted to a boolean
          const userData = {
            ...res.data.user,
            is_admin: Boolean(res.data.user.is_admin),
          };
          devLog("User loaded. User data:", userData);
          setUser(userData);
        } else {
          setToken(null);
        }
      } catch (err) {
        devLog("Error loading user:", err);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.data.success) {
        // Ensure is_admin is converted to a boolean
        const userData = {
          ...res.data.user,
          is_admin: Boolean(res.data.user.is_admin),
        };
        devLog("Login successful. User data:", userData);
        setUser(userData);
        const normalizedToken = normalizeToken(res.data.token);
        if (!normalizedToken) {
          setError("Invalid authentication token received");
          setUser(null);
          setToken(null);
          return false;
        }
        setToken(normalizedToken);
        return true;
      }
      return false;
    } catch (err) {
      if (ENABLE_MOCK_AUTH && email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
        devLog("Using Mock Admin Login Fallback");
        const mockUser: User = {
          id: 999,
          email: MOCK_ADMIN_EMAIL,
          is_admin: true,
          name: "System Administrator"
        };
        setUser(mockUser);
        setToken(MOCK_ADMIN_TOKEN);
        localStorage.setItem(TOKEN_STORAGE_KEY, MOCK_ADMIN_TOKEN);
        return true;
      }
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || "Login failed");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    devLog("Checking admin status. User:", user);
    devLog("is_admin value:", user?.is_admin);
    // Convert to boolean to handle numeric values (1/0) from MySQL
    return Boolean(user?.is_admin);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
