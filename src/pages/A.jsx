import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { cartContext } from "../context/CartContext";
import { OrderContext } from "../context/OrderContext";
import API from "../services/api";
import "../styles/payment.css";

// Load Stripe once outside component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_STYLE = {
  style: {
    base: {
      color: "#f0f0ff",
      fontFamily: "Sora, sans-serif",
      fontSize: "15px",
      "::placeholder": { color: "#8888aa" },
      iconColor: "#6c63ff",
    },
    invalid: { color: "#ff6584", iconColor: "#ff6584" },
  },
};

// ── Inner form (must be inside <Elements>) ────────────────
function CheckoutForm({ total, shippingAddress }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { placeOrder } = useContext(OrderContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  async function handlePay(e) {
    e.preventDefault();
    setError("");

    // ── COD ──
    if (paymentMethod === "cod") {
      try {
        setLoading(true);
        await placeOrder({ shippingAddress, paymentMethod: "COD" });
        navigate("/order-success", { state: { success: true, paymentMethod: "COD" } });
      } catch {
        setError("Failed to place order. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // ── Card via Stripe ──
    if (!stripe || !elements) return;

    try {
      setLoading(true);

      // 1. Get client secret from backend
      const { data } = await API.post("/payments/create-payment-intent", { amount: total });

      // 2. Confirm payment with Stripe
      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: elements.getElement(CardElement) } }
      );

      if (stripeErr) {
        setError(stripeErr.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3. Save order to your DB
        await placeOrder({
          shippingAddress,
          paymentMethod: "Card",
          stripePaymentId: paymentIntent.id,
        });
        navigate("/order-success", { state: { success: true, paymentMethod: "Card" } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="payment-form" onSubmit={handlePay}>

      {/* Method cards */}
      <div className="payment-methods">
        {[
          { id: "card", icon: "💳", title: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
          { id: "cod",  icon: "💵", title: "Cash on Delivery",    sub: "Pay when order arrives" },
        ].map(({ id, icon, title, sub }) => (
          <div
            key={id}
            className={`payment-method-card ${paymentMethod === id ? "selected" : ""}`}
            onClick={() => setPaymentMethod(id)}
          >
            <span className="pm-icon">{icon}</span>
            <div className="pm-text">
              <div className="pm-title">{title}</div>
              <div className="pm-sub">{sub}</div>
            </div>
            <div className="pm-radio">
              <div className={`radio-dot ${paymentMethod === id ? "active" : ""}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Stripe card element */}
      {paymentMethod === "card" && (
        <div className="card-input-wrap">
          <label className="card-label">Card Details</label>
          <div className="card-element-box">
            <CardElement options={CARD_STYLE} />
          </div>
          <p className="card-test-hint">
            🧪 Test card: <strong>4242 4242 4242 4242</strong> · Any future date · Any CVC
          </p>
        </div>
      )}

      {error && (
        <div className="payment-error"><span>⚠️</span> {error}</div>
      )}

      <button className="pay-btn" type="submit" disabled={loading || !stripe}>
        {loading
          ? "Processing..."
          : paymentMethod === "cod"
          ? `Place Order · ₹${total.toFixed(2)}`
          : `Pay ₹${total.toFixed(2)}`}
      </button>

    </form>
  );
}

// ── Wrapper ───────────────────────────────────────────────
function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useContext(cartContext);

  const shippingAddress = location.state?.shippingAddress;
  if (!shippingAddress) { navigate("/checkout"); return null; }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax      = +(subtotal * 0.18).toFixed(2);
  const total    = +(subtotal + tax).toFixed(2);

  return (
    <div className="payment-page">
      <div className="payment-wrapper">

        {/* Step indicator */}
        <div className="step-indicator">
          <div className="step done">✓ Cart</div>
          <div className="step-line done" />
          <div className="step done">✓ Address</div>
          <div className="step-line done" />
          <div className="step active">Payment</div>
        </div>

        <div className="payment-grid">

          {/* LEFT */}
          <div className="payment-left">
            <h2 className="payment-title">Choose Payment</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm total={total} shippingAddress={shippingAddress} />
            </Elements>
          </div>

          {/* RIGHT — order summary */}
          <div className="payment-right">
            <div className="summary-card">
              <div className="summary-label">Order Summary</div>
              <div className="summary-items">
                {cart.map((item, i) => (
                  <div key={i} className="summary-item">
                    <img src={item.image} alt={item.title} className="summary-img" />
                    <div className="summary-item-info">
                      <div className="summary-item-title">{item.title}</div>
                      <div className="summary-item-qty">Qty: {item.quantity}</div>
                    </div>
                    <div className="summary-item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toFixed(2)}</span></div>
                <div className="summary-row"><span>Delivery</span><span style={{color:"var(--accent3)"}}>Free</span></div>
                <div className="summary-row grand"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Payment;