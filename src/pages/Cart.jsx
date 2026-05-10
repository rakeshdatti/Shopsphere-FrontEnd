import { useContext } from "react";
import { cartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../styles/cart.css";

function Cart() {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity, totalItems, totalPrice } = useContext(cartContext);

    if (!cart.length) {
        return (
            <div className="cart-page">
                <div className="cart-empty">
                    <div className="cart-empty-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything yet.</p>
                    <Link to="/">Start Shopping</Link>
                </div>
            </div>
        );
    }

    const tax = +(totalPrice * 0.18).toFixed(2);
    const grand = +(totalPrice + tax).toFixed(2);

    return (
        <div className="cart-page">                      
            <div className="cart-wrapper">               


                <div>
                    <div className="cart-header">
                        <h2 style={{
                            borderBottom: '2px solid var(--accent)',
                            paddingBottom: '0.5rem',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            color: 'var(--text)'
                        }}>
                            Shopping Cart <span>({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                        </h2>
                    </div>

                    <div className="cart-card">
                        <div className="section-label">Your items</div>
                        <ul className="cart-list">
                            {cart.map((item) => (
                                <li className="cart-item" key={item.productId}>
                                    <div className="cart-left">
                                        <img src={item.image} alt={item.title} />
                                    </div>
                                    <div className="cart-middle">
                                        <h5 className="cart-title">{item.title}</h5>
                                        <p className="cart-price">₹{item.price} / unit</p>
                                        <div className="quantity-controls">
                                            <button onClick={() => decreaseQuantity(item.productId)}>−</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => increaseQuantity(item.productId)}>+</button>
                                        </div>
                                    </div>
                                    <div className="cart-right">
                                        <p className="item-total">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.productId)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

             
                <div className="price-summary-card">
                    <h4 className="summary-title">Price Details</h4>

                    <div className="summary-row">
                        <span>Price ({totalItems} items)</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="summary-row">
                        <span>Delivery Charges</span>
                        <span className="free-text">FREE</span>
                    </div>

                    <div className="summary-row">
                        <span>GST (18%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>

                    <hr className="summary-divider" />

                    <div className="summary-total">
                        <span>Total Amount</span>
                        <span>₹{grand.toFixed(2)}</span>
                    </div>

                    <p className="save-text">🚚 Free delivery on this order!</p>

                    <Link to="/checkout" className="checkout-link">
                        <button className="checkout-btn">
                            PROCEED TO CHECKOUT
                        </button>
                    </Link>

                    <Link to="/" className="continue-btn">
                        ← Continue Shopping
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Cart;