import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import "../styles/orderSuccess.css";

function Orders() {
  const { orders } = useContext(OrderContext);
  const navigate = useNavigate();

  if (!orders.length) {
    return (
      <div className="orders-page">
        <div className="orders-inner">
          <div className="orders-empty">
            <div className="orders-empty-icon">📦</div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-inner">

        <div className="orders-header">
          <h2>📦 Your Orders</h2>
        </div>

        <div className="orders-section-label">
          {orders.length} {orders.length === 1 ? "order" : "orders"} found
        </div>

        {orders.map((order) => (
          <div
            key={order._id}
            className="order-card"
            onClick={() => navigate(`/orders/${order._id}`)}
          >
            <div className="order-card-top">
              <span className="order-id">#{order._id}</span>
              <span className="status-badge">{order.status || "Processing"}</span>
            </div>

            <p className="order-date">
              📅 {new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </p>

            <p className="order-items-count">
              Items: <strong>{order.items.length}</strong>
              &nbsp;·&nbsp;
              Payment: <strong>{order.paymentMethod?.toUpperCase()}</strong>
            </p>

            <div className="order-card-bottom">
              <span className="order-total-label">Total Amount</span>
              <span className="order-total">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Orders;
