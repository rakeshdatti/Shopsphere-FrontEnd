import useProduct from "../hooks/useProduct";
import { useContext } from "react";
import { cartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/productDetails.css";

function ProductDetails() {
  const { cart, addToCart } = useContext(cartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { Product, loading, error } = useProduct();

  if (loading) {
    return (
      <div className="product-loading">
        <span>Loading product details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-error">
        <span style={{ color: "var(--accent2)" }}>⚠️ {error}</span>
      </div>
    );
  }

  const isInCart = cart.some(
    item => item.productId?.toString() === Product?.id?.toString()
  );

  // Generate star rating display
  const rating = Product?.rating?.rate || 4.2;
  const ratingCount = Product?.rating?.count || 120;
  const fullStars = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < fullStars ? "⭐" : "☆"
  );

  return (
    <div className="product-details-container">
      <div className="product-details-wrapper">

        {/* ── LEFT — IMAGE ── */}
        <div className="product-image-section">
          <img src={Product?.image} alt={Product?.title} />
        </div>

        {/* ── RIGHT — INFO ── */}
        <div className="product-info-section">

          {/* Category tag */}
          {Product?.category && (
            <div className="product-category-tag">
              🏷️ {Product.category}
            </div>
          )}

          {/* Title */}
          <h1 className="product-title">{Product?.title}</h1>

          {/* Rating */}
          <div className="product-rating">
            <div className="stars">{stars.join(" ")}</div>
            <span className="rating-count">
              {rating} ({ratingCount} reviews)
            </span>
          </div>

          {/* Price */}
          <p className="product-price">₹{Product?.price}</p>
          <p className="product-price-note">✅ Inclusive of all taxes · Free delivery</p>

          <hr className="product-divider" />

          {/* Description */}
          <p className="product-description">{Product?.description}</p>

          {/* Stock */}
          <div className="product-stock">
            <div className="stock-dot" />
            In Stock · Ready to ship
          </div>

          {/* Features */}
          <div className="product-features">
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              Free Delivery
            </div>
            <div className="feature-item">
              <span className="feature-icon">↩️</span>
              7-Day Returns
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              Secure Payment
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              1 Year Warranty
            </div>
          </div>

          {/* Buttons */}
          <div className="product-buttons">
            {isInCart ? (
              <button
                className="go-cart-btn"
                onClick={() => navigate("/cart")}
              >
                ✓ Go To Cart
              </button>
            ) : (
              <button
                className="add-cart-btn"
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                  } else {
                    addToCart(Product);
                  }
                }}
              >
                🛒 Add To Cart
              </button>
            )}

            <button
              className="buy-now-btn"
              onClick={() => {
                if (!user) {
                  navigate("/login");
                } else {
                  addToCart(Product);
                  navigate("/checkout");
                }
              }}
            >
              ⚡ Buy Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
