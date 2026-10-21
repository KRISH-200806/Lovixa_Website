import React, { Component } from "react";
import PropTypes from "prop-types";
import { AlertTriangle, RefreshCw } from "lucide-react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-neutral-50" role="alert">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-neutral-600 max-w-md mb-6">
            We encountered an unexpected issue while rendering this section. Please refresh or try again shortly.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-lg font-medium shadow-brand/20 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default ErrorBoundary;
