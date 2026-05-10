import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import "./styles/theme.css"
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ThemeProvider>
    <AuthProvider>
    <CartProvider>
      <OrderProvider>
          <App />
      </OrderProvider>
    </CartProvider> 
    </AuthProvider>
   </ThemeProvider>
  // </StrictMode>,
)
