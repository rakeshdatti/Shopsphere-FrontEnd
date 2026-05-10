import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartContext } from "../context/CartContext";
import "../styles/checkout.css";

function Checkout() {
  const { cart, totalPrice } = useContext(cartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", address: "", city: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePlaceOrder() {
    if (!form.name || !form.address || !form.city) {
      setError("Please fill in all fields to continue.");
      return;
    }
    navigate("/payment", { state: { shippingAddress: form } });
  }

  if (!cart.length) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "var(--bg)", fontFamily: "Sora, sans-serif", color: "#f0f0ff"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>🛒</div>
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  const tax = +(totalPrice * 0.18).toFixed(2);
  const grand = +(totalPrice + tax).toFixed(2);

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">

        {/* ── STEP INDICATOR ── */}
        <div className="checkout-steps">
          <div className="checkout-step done">
            <div className="checkout-step-dot">✓</div>
            <span>Cart</span>
          </div>
          <div className="checkout-step-line" />
          <div className="checkout-step active">
            <div className="checkout-step-dot">2</div>
            <span>Address</span>
          </div>
          <div className="checkout-step-line" />
          <div className="checkout-step">
            <div className="checkout-step-dot">3</div>
            <span>Payment</span>
          </div>
        </div>

        {/* ── LEFT — FORM ── */}
        <div className="checkout-form">
          <h2 className="checkout-title">Shipping Details</h2>
          <p className="checkout-subtitle">Where should we deliver your order?</p>

          <div className="checkout-section-label">Delivery address</div>

          {error && (
            <div className="checkout-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street address, apartment, etc."
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter your city"
            />
          </div>

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Processing..." : "CONTINUE TO PAYMENT →"}
          </button>

          <div className="checkout-secure">
            <span>🔒</span>
            <span>Your information is safe & encrypted</span>
          </div>
        </div>

        {/* ── RIGHT — SUMMARY ── */}
        <div className="checkout-summary">
          <h4>Order Summary</h4>

          {/* Item list */}
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.productId} className="summary-item">
                <span className="summary-item-name">
                  {item.title} <span style={{ color: "#6c63ff" }}>×{item.quantity}</span>
                </span>
                <span className="summary-item-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal ({cart.length} items)</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span style={{ color: "#43e97b", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "0.78rem" }}>
              FREE
            </span>
          </div>

          <div className="summary-row">
            <span>GST (18%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{grand.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;
