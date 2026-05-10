import React, { lazy, Suspense } from "react";
import NavBar from "./components/NavBar"
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ProductDetails from "./pages/ProductDetails";
// import Home from "./pages/Home";
// import Cart from "./pages/Cart";
// import Login from "./pages/Login";
// import Checkout from "./pages/Checkout";
// import OrderSucess from "./pages/orderSuccess";
// import Orders from "./pages/Orders";
// import Register from "./pages/Register";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import Payment from "./pages/Payment";
// import OrderDetails from "./pages/OrderDetails";
// import VerifyOTP from "./pages/Verify-OTP";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import ChatBot from "./components/chatBot";
import ProtectedRoute from "./routes/ProtectedRoute";

const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSucess = lazy(() => import("./pages/OrderSuccess"));
const Orders = lazy(() => import("./pages/Orders"));
const Register = lazy(() => import("./pages/Register"));
// const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute"));
const Payment = lazy(() => import("./pages/Payment"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const VerifyOTP = lazy(() => import("./pages/Verify-OTP"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ChatBot = lazy(() => import("./components/chatBot"));
function App() {
  return (
    <BrowserRouter>
      <NavBar/>
        <Suspense fallback={<div className="spinner">Loading...</div>}>
         <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/verify-otp" element={<VerifyOTP/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/products/:id" element={<ProductDetails />}/>
          <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
          <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
          <Route path="/order-sucess" element={<OrderSucess/>}/>
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>}/>
          <Route path="/order-success" element={<ProtectedRoute><OrderSucess /></ProtectedRoute>}/>
          <Route path="/orders/:orderId"element={ <ProtectedRoute><OrderDetails /></ProtectedRoute>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/chatbot" element={<ChatBot />} />
         </Routes>
         </Suspense>
    </BrowserRouter>
  )
}

export default App
