import { Component, type ErrorInfo, type ReactNode } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled app error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[#0B1221] flex items-center justify-center px-6">
          <section className="max-w-lg w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-white/70 mb-6">
              The page failed to render. Please refresh the page and try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#1cd35c] text-white rounded-xl font-medium hover:bg-[#19b850] transition-colors"
            >
              Reload
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;

