import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SoundProvider } from './context/SoundContext';
import AppRoutes from './routes/AppRoutes';

// Global Error Boundary - prevents complete white screen on runtime React errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('React Error Boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a1628',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: '#ffd700', marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: '#94a3b8', marginBottom: 24, maxWidth: 480 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            style={{
              background: '#d4af37',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              padding: '12px 28px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Go Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <SoundProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </SoundProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
