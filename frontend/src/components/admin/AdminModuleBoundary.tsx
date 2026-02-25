import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface AdminModuleBoundaryProps {
  children: ReactNode;
}

interface AdminModuleBoundaryState {
  hasError: boolean;
}

class AdminModuleBoundary extends Component<AdminModuleBoundaryProps, AdminModuleBoundaryState> {
  state: AdminModuleBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AdminModuleBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Admin module render error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="admin-module-frame p-6 md:p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-[#7f1d1d]">Module Failed To Render</h3>
              <p className="mt-1 text-sm text-[#991b1b]">
                An unexpected UI error occurred in this admin section. Retry the module.
              </p>
              <button
                type="button"
                onClick={this.handleRetry}
                className="mt-4 inline-flex items-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700"
              >
                Retry Module
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminModuleBoundary;
