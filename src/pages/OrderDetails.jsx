import { useParams, useNavigate } from "react-router-dom";
import { useContext, useMemo } from "react";
import { OrderContext } from "../context/OrderContext";
import "../styles/orderDetails.css";

// Tracking stages
const STAGES = ["Order Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

function getStageIndex(status = "Processing") {
  const map = {
    "Processing": 1,
    "Confirmed": 2,
    "Shipped": 3,
    "Out for Delivery": 4,
    "Delivered": 5,
  };
  return map[status] ?? 1;
}

function getStatusClass(status = "Processing") {
  if (status === "Delivered") return "status-delivered";
  if (status === "Cancelled") return "status-cancelled";
  return "status-processing";
}

function OrderDetails() {
  const { orderId } = useParams();
  const { orders } = useContext(OrderContext);
  const navigate = useNavigate();

  const order = useMemo(() => {
    return orders.find(o => o._id === orderId);  // ✅ use _id not id
  }, [orders, orderId]);

  if (!order) {
    return (
      <div className="order-not-found">
        <div style={{ fontSize: "3rem", opacity: 0.4 }}>📦</div>
        <h3 style={{ color: "var(--text)", fontWeight: 700 }}>Order Not Found</h3>
        <p>This order doesn't exist or may have been removed.</p>
        <button
          onClick={() => navigate("/orders")}
          style={{
            marginTop: 12, padding: "10px 24px", borderRadius: 10,
            background: "var(--accent)", border: "none", color: "white",
            fontFamily: "Sora, sans-serif", fontWeight: 700, cursor: "pointer"
          }}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  const stageIndex = getStageIndex(order.status);
  const progressWidth = `${((stageIndex - 1) / (STAGES.length - 1)) * 100}%`;

  const tax = +(order.total * 0.18 / 1.18).toFixed(2); // extract tax from total
  const subtotal = +(order.total - tax).toFixed(2);

  // Shorten order ID for display: last 8 chars uppercase
  const shortId = order._id?.slice(-8).toUpperCase();

  return (
    <div className="order-details-container">
      <div className="order-details-inner">

        {/* ── BACK ── */}
        <button className="back-btn" onClick={() => navigate("/orders")}>
          ← Back to Orders
        </button>

        {/* ── HEADER ── */}
        <div className="order-details-header">
          <div>
            <h2>Order #{shortId}</h2>
            <p>Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric", month: "long", day: "numeric"
            })}</p>
          </div>
          <span className={`status-badge ${getStatusClass(order.status)}`}>
            {order.status || "Processing"}
          </span>
        </div>

        {/* ── TRACKING ── */}
        <div className="od-card" style={{ marginBottom: 16 }}>
          <div className="od-label">Order Tracking</div>
          <div className="tracking-steps">
            <div className="tracking-progress" style={{ width: progressWidth }} />
            {STAGES.map((stage, i) => (
              <div
                key={stage}
                className={`track-step ${i < stageIndex ? "done" : i === stageIndex ? "active" : ""}`}
              >
                <div className="track-dot">
                  {i < stageIndex ? "✓" : i + 1}
                </div>
                <span className="track-label">{stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ORDER INFO ── */}
        <div className="od-card">
          <div className="od-label">Order Information</div>
          <div className="info-grid">
            <div className="info-item">
              <span className="i-label">Order ID</span>
              <span className="i-value mono">#{shortId}</span>
            </div>
            <div className="info-item">
              <span className="i-label">Order Date</span>
              <span className="i-value">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </span>
            </div>
            <div className="info-item">
              <span className="i-label">Payment Method</span>
              <span className="i-value">{order.paymentMethod?.toUpperCase() || "COD"}</span>
            </div>
            <div className="info-item">
              <span className="i-label">Estimated Delivery</span>
              <span className="i-value">{deliveryDate.toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric"
              })}</span>
            </div>
          </div>
        </div>

        {/* ── SHIPPING ADDRESS ── */}
        {order.shippingAddress && (
          <div className="od-card">
            <div className="od-label">Delivery Address</div>
            <div className="address-box">
              <div className="address-pin">📍</div>
              <div className="address-text">
                <div className="a-name">{order.shippingAddress.name}</div>
                <div className="a-detail">
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ITEMS ── */}
        <div className="od-card">
          <div className="od-label">{order.items.length} Items Ordered</div>
          <div className="order-items-list">
            {order.items.map((item, i) => (
              <div key={item.productId || i} className="order-item-row">
                {item.image
                  ? <img src={item.image} alt={item.title} className="order-item-img" />
                  : <div className="order-item-img-placeholder">🛍️</div>
                }
                <div className="order-item-info">
                  <div className="order-item-title">{item.title}</div>
                  <div className="order-item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="order-item-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="od-totals">
            <div className="od-total-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="od-total-row">
              <span>Delivery</span>
              <span style={{ color: "var(--accent3)", fontFamily: "Sora, sans-serif" }}>Free</span>
            </div>
            <div className="od-total-row">
              <span>GST (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="od-total-row grand">
              <span>Total Paid</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderDetails;
