import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_placeholder";
console.log("Current Google Client ID:", GOOGLE_CLIENT_ID);
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.warn("WARNING: VITE_GOOGLE_CLIENT_ID is not set in environment variables!");
}

try {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root not found');

  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ErrorBoundary>
    </StrictMode>,
  )
} catch (e) {
  console.error('Error in main.tsx:', e);
}
