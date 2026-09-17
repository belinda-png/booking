import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.css'
// import { GoogleAuthProvider } from 'firebase/auth'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
    <GoogleAuthProvider>
      
    </GoogleAuthProvider>
)