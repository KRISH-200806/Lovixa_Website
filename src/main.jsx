import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './components/Context/CartContext.jsx'
import { ToastContainer, toast } from 'react-toastify';
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
     <CartProvider>
    <App />
    <ToastContainer />
    </CartProvider>
  </StrictMode>,
)
