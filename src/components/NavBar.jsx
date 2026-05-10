import { useLocation,NavLink } from "react-router-dom";
import "../styles/navBar.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { cartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";


function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { totalItems } = useContext(cartContext);
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext)

  const isActive = (path) => location.pathname === path;

  return (
    <header className="flipkart-navbar">
      <div className="nav-container">

        <NavLink to="/" className="logo">ShopSphere</NavLink>

        <nav className="nav-links">
            <NavLink
              to="/"
              style={{ color: isActive("/") ? "var(--text)" : undefined }}
            >
              Products
            </NavLink>

          <NavLink
            to="/cart"
            className="cart-link"
            style={{ color: isActive("/cart") ? "var(--text)" : undefined }}
          >
            Cart
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </NavLink>

          <NavLink
            to="/orders"
            style={{ color: isActive("/orders") ? "var(--text)" : undefined }}
          >
            Orders
          </NavLink>
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div className="nav-auth-section">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <div className="avatar-circle">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="user-email">{user.email}</span>
              </div>

              <div className="dropdown-menu-custom">
                <NavLink to="/orders">📦 Orders</NavLink>
                <button onClick={logout}>🚪 Logout</button>
              </div>
            </div>
          ) : (
            <NavLink to="/login" className="nav-login-btn">
              Login
            </NavLink>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;
