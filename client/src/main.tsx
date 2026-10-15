import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css' /* main.tsx --> globals.css --> variables.css */
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
