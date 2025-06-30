const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-icon">$</div>
          <h1 className="logo-text">Budget Smart</h1>
        </div>
        <div className="loading-spinner"></div>
        <p className="loading-text">Initializing your financial dashboard...</p>
      </div>
    </div>
  )
}

export default LoadingScreen
