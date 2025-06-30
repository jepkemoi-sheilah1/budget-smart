import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import ErrorBoundary from "./components/ErrorBoundary"

// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals"

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log("Web Vital:", metric)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

// Hot Module Replacement for development
if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <NextApp />
        </ErrorBoundary>
      </React.StrictMode>,
    )
  })
}
