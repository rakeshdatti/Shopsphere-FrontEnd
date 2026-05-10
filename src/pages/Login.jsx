import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../services/authService";
import "../styles/login.css";

function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error on type
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await loginUser({ email: form.email, password: form.password });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flipkart-login-container">
      <div className="flipkart-login-card">

        {/* ── LEFT PANEL ── */}
        <div className="login-left">
          <div className="login-left-eyebrow">Welcome back</div>

          <h2>
            Sign in to<br />
            <span>ShopSphere</span>
          </h2>

          <p>
            Get access to your Orders,
            Wishlist and personalized
            Recommendations.
          </p>

          <div className="login-left-perks">
            <div className="perk-item">
              <div className="perk-icon">📦</div>
              Track your orders in real-time
            </div>
            <div className="perk-item">
              <div className="perk-icon">🔒</div>
              Secure & encrypted login
            </div>
            <div className="perk-item">
              <div className="perk-icon">⚡</div>
              Faster checkout experience
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="login-right">
          <div className="login-right-title">Sign In</div>
          <div className="login-right-sub">Enter your credentials to continue</div>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <p>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
          </div>
          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            className="flipkart-login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="login-divider">or</div>

          <Link to="/register" className="register-link-btn">
            Create New Account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
