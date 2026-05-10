import { Link } from "react-router-dom";
import "../styles/home.css";
import "../styles/productDetails.css";
import { useContext } from "react";
import { cartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"

function ProductCard({ product }) {
  console.log("product:", product)
  const {cart,addToCart}=useContext(cartContext)
  const {user}=useContext(AuthContext)
  const navigate=useNavigate();
  
  const isInCart=cart.some(item => item.productId?.toString() === product.id.toString())
  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img
          src={product.image}
          className="card-img-top"
          alt={product.title}
        />
      </div>

      <div className="card-body">
        <h6 className="card-title">
          {product.title}
        </h6>

        <p className="price">
          ₹{parseFloat(product.price).toFixed(2)}
        </p>
          <div className="product-buttons">
            <Link
                to={`/products/${product.id}`}
                className="view-btn mt-auto"
                >
                View Details
            </Link>
             {isInCart ? (
                    <button
                        className="go-cart-btn"
                        onClick={() => navigate("/cart")}
                    >
                        Go To Cart
                    </button>
                    ) : (
                    <button
                        className="add-cart-btn"
                        onClick={() => {
                            if (!user) {
                                navigate("/login");
                            } else {
                                addToCart(product);
                            }
                        }}
                    >
                        Add To Cart
                    </button>
                    )}  
              </div>
          
      </div>
    </div>
  );
}

export default ProductCard;