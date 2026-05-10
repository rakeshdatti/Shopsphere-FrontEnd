import { useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext";
import "../styles/orderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { orders } = useContext(OrderContext);
  const { success } = location.state || {};

  const latestOrder = useMemo(() => {
    if (!orders.length) return null;
    return [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
  }, [orders]);

  const handlePrint = () => {
      document.title = `Invoice_${latestOrder._id?.slice(-8).toUpperCase()}`;
      window.scrollTo(0, 0);
      setTimeout(() => window.print(), 200);
  };

  if (!success) {
    return (
      <div className="order-success-container">
        <div className="success-card">
          <div className="success-icon" style={{
            background: "linear-gradient(135deg, #ff6584, #ff4d6d)",
            boxShadow: "0 8px 32px rgba(255,101,132,0.35)"
          }}>✕</div>
          <h2 className="success-title">Order Failed</h2>
          <p className="success-message">
            Something went wrong while placing your order.<br />
            Please try again.
          </p>
          <div className="success-btns">
            <button className="continue-btn" onClick={() => navigate("/checkout")}>
              🔄 Try Again
            </button>
            <button className="invoice-btn" onClick={() => navigate("/")}>
              🏠 Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!latestOrder) return null;

  const deliveryDate = new Date(latestOrder.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="order-success-container">
      <div className="success-card">

        <div className="success-icon">✔</div>

        <h2 className="success-title">Order Placed Successfully!</h2>

        <p className="success-message">
          📧 Order details have been sent to<br />
          <strong>{user?.email}</strong>
        </p>

        <div className="order-summary-box">
          <p>
            <span>Order ID</span>
            <strong>#{latestOrder._id?.slice(-8).toUpperCase()}</strong>
          </p>
          <p>
            <span>Payment Method</span>
            <strong>{latestOrder.paymentMethod?.toUpperCase()}</strong>
          </p>
          <p>
            <span>Total Amount</span>
            <strong>₹{latestOrder.total?.toFixed(2)}</strong>
          </p>
          <p>
            <span>Estimated Delivery</span>
            <strong>{deliveryDate.toDateString()}</strong>
          </p>
          <p>
            <span>Items Ordered</span>
            <strong>{latestOrder.items?.length}</strong>
          </p>
        </div>

        <div className="success-btns">
          <button className="continue-btn" onClick={() => navigate("/")}>
            🛍️ Continue Shopping
          </button>
          <button className="invoice-btn" onClick={ handlePrint}>
            🧾 Download Invoice
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;
