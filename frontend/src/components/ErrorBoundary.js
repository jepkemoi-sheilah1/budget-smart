"use client"

import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })

    // Log error to console
    console.error("Error caught by boundary:", error, errorInfo)

    // You can also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>🚨 Something went wrong</h1>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Reload Page
          </button>

          {process.env.NODE_ENV === "development" && (
            <details style={{ marginTop: "20px", textAlign: "left" }}>
              <summary>Error Details (Development Only)</summary>
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  overflow: "auto",
                  maxHeight: "200px",
                }}
              >
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
