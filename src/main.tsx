import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './providers/AuthProvider'
import './index.css'
import App from './App.tsx'

// Add error boundary for debugging
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error })
}

window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason)
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('Root element not found!')
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>,
    )
  } catch (error) {
    console.error('Failed to render app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; color: white; background: #1a1a1a; font-family: monospace;">
        <h1>Error loading app</h1>
        <pre>${error instanceof Error ? error.message : String(error)}</pre>
      </div>
    `
  }
}
