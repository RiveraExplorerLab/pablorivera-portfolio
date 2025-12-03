import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './providers/AuthProvider'
import './index.css'
import App from './App.tsx'

// Console easter egg for fellow developers 👀
console.log(
  '%c👋 Hey, you found the console!',
  'font-size: 16px; font-weight: bold; color: #f0b429;'
)
console.log(
  '%cIf you\'re poking around, you\'re my kind of person.',
  'font-size: 12px; color: #9d99a9;'
)
console.log(
  '%c🔧 Built with React, TypeScript, Vite, Tailwind, Firebase',
  'font-size: 11px; color: #9d99a9;'
)
console.log(
  '%c📫 Want to chat? hello@pablorivera.dev',
  'font-size: 11px; color: #9d99a9;'
)
console.log(
  '%c\n' +
  '  ██████╗  █████╗ ██████╗ ██╗      ██████╗ \n' +
  '  ██╔══██╗██╔══██╗██╔══██╗██║     ██╔═══██╗\n' +
  '  ██████╔╝███████║██████╔╝██║     ██║   ██║\n' +
  '  ██╔═══╝ ██╔══██║██╔══██╗██║     ██║   ██║\n' +
  '  ██║     ██║  ██║██████╔╝███████╗╚██████╔╝\n' +
  '  ╚═╝     ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ \n',
  'font-family: monospace; color: #f0b429; font-size: 10px;'
)

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
