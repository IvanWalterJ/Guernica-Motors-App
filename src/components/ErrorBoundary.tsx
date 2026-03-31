import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red", backgroundColor: "black", minHeight: "100vh", fontFamily: "monospace" }}>
          <h1 style={{ color: "red" }}>Algo salió mal en el renderizado.</h1>
          <p>{this.state.error?.toString()}</p>
          <pre style={{ color: "gray", marginTop: "20px", whiteSpace: "pre-wrap" }}>
            {this.state.errorInfo?.componentStack}
          </pre>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/admin/login';
            }}
            style={{ marginTop: "20px", padding: "10px", background: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Limpiar sesión y volver al Login
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
