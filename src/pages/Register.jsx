import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser as registerUserAPI } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/register.css";
import { getChecks,getStrength,isValidEmail,REQUIREMENTS } from "../utils/passwordStrength";


function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const checks = getChecks(form.password);
    if (!checks.length)  { setError("Password must be at least 8 characters.");                  return; }
    if (!checks.letter)  { setError("Password must contain at least one letter.");               return; }
    if (!checks.number)  { setError("Password must contain at least one number.");               return; }
    if (!checks.special) { setError("Password must contain at least one special character."); return; }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await registerUserAPI({ name: form.name, email: form.email, password: form.password });
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const strength         = getStrength(form.password);
  const checks           = form.password ? getChecks(form.password) : null;
  const passwordsMatch   = form.confirmPassword && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  return (
    <div className="register-container">
      <div className="register-card">

        {/* ── LEFT PANEL ── */}
        <div className="register-left">
          <div className="register-left-eyebrow">Join us today</div>
          <h2>Create your<br /><span>ShopSphere</span><br />account</h2>
          <p>Start shopping smarter with personalized recommendations and easy order tracking.</p>
          <div className="register-left-perks">
            <div className="perk-item"><div className="perk-icon">🛍️</div>Thousands of products</div>
            <div className="perk-item"><div className="perk-icon">🚚</div>Free delivery on all orders</div>
            <div className="perk-item"><div className="perk-icon">↩️</div>Easy 7-day returns</div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="register-right">
          <div className="register-right-title">Create Account</div>
          <div className="register-right-sub">Fill in your details to get started</div>

          {error && <div className="register-error"><span>⚠️</span> {error}</div>}

          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" type="text" placeholder="Enter your full name"
              value={form.name} onChange={handleChange} autoComplete="name" />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="Enter your email"
              value={form.email} onChange={handleChange} autoComplete="email" />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 chars · letter · number · symbol"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Strength bar */}
            {strength && (
              <div className="strength-bar-wrap">
                <div className="strength-bar">
                  <div className="strength-fill"
                    style={{ width: strength.width, background: strength.color }} />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}

            {/* Requirements checklist */}
            {checks && (
              <div className="pwd-requirements">
                {REQUIREMENTS.map(({ key, label }) => (
                  <div key={key} className={`pwd-req ${checks[key] ? "req-pass" : "req-fail"}`}>
                    {checks[key] ? "✓" : "✕"} {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                style={{
                  borderColor: passwordsMatch ? "rgba(67,233,123,0.6)"
                    : passwordsMismatch ? "rgba(255,101,132,0.6)" : undefined
                }}
              />
              <span className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordsMatch    && <span className="match-msg match-ok">✓ Passwords match</span>}
            {passwordsMismatch && <span className="match-msg match-fail">✕ Passwords do not match</span>}
          </div>

          <button className="register-btn" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="register-divider">or</div>

          <Link to="/login" className="login-link-btn">
            Already have an account? Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
