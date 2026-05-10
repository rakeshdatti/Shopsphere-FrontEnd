import { useState } from "react";
import { resetPassword as resetPasswordAPI } from "../services/authService";
import "../styles/register.css";
import { getChecks,getStrength,REQUIREMENTS } from "../utils/passwordStrength";
import { useParams,useNavigate,Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword(){
    const {token}=useParams()
    const navigate=useNavigate()
    const [password,setPassword]=useState("")
    const [showPassword, setShowPassword]       = useState(false);
    const [showConfirm, setShowConfirm]         = useState(false);
    const [confirmPassword,setConfirmPassword]=useState("")
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const [success,setSuccess]=useState(false)

    const checks = password ? getChecks(password) : null;
    const strength = getStrength(password);
    const passwordsMatch= confirmPassword && password === confirmPassword;
    const passwordMismatch = confirmPassword && password !== confirmPassword;

    async function  handleSubmit(e) {
        e.preventDefault()
        setError("")

         if (!password || !confirmPassword) { setError("Please fill in both fields.");               return; }
        if (!checks.length)  { setError("Password must be at least 8 characters.");                  return; }
        if (!checks.letter)  { setError("Password must contain at least one letter.");               return; }
        if (!checks.number)  { setError("Password must contain at least one number.");               return; }
        if (!checks.special) { setError("Password must contain at least one special character."); return; }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try{
            setLoading(true)
            await resetPasswordAPI(token,password)
            setSuccess(true)
            setTimeout(()=> navigate("/login"),2500)
        } catch (err) {
            setError(err.response?.data?.message || "Link is invalid or has expired.");
        } finally {
            setLoading(false)
        }    
    }

    return (
        <div className="register-container">
        <div className="register-card">

            {/* ── LEFT PANEL ── */}
            <div className="register-left">
            <div className="register-left-eyebrow">Almost there</div>
            <h2>Set a new<br /><span>Password</span></h2>
            <p>Choose a strong password you haven't used before.</p>
            <div className="register-left-perks">
                <div className="perk-item"><div className="perk-icon">🔒</div>8+ characters</div>
                <div className="perk-item"><div className="perk-icon">🔢</div>Letters & numbers</div>
                <div className="perk-item"><div className="perk-icon">✨</div>Special character</div>
            </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="register-right">
            <div className="register-right-title">New Password</div>
            <div className="register-right-sub">Enter and confirm your new password</div>

            {error && (
                <div className="register-error"><span>⚠️</span> {error}</div>
            )}

            {success ? (
                /* ── Success state ── */
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                <div className="register-right-title" style={{ fontSize: "1.2rem" }}>
                    Password Reset!
                </div>
                <div className="register-right-sub" style={{ marginTop: "0.5rem" }}>
                    Your password has been updated successfully.
                    <br />Redirecting you to login...
                </div>
                </div>
            ) : (
                <>
                {/* New Password */}
                <div className="form-group">
                    <label>New Password</label>
                    <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 chars · letter · number · symbol"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        autoComplete="new-password"
                        autoFocus
                    />
                    <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    </div>

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
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter your new password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                        autoComplete="new-password"
                        style={{
                        borderColor: passwordsMatch    ? "rgba(67,233,123,0.6)"
                                    : passwordMismatch ? "rgba(255,101,132,0.6)" : undefined
                        }}
                    />
                    <span className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    </div>
                    {passwordsMatch    && <span className="match-msg match-ok">✓ Passwords match</span>}
                    {passwordMismatch && <span className="match-msg match-fail">✕ Passwords do not match</span>}
                </div>

                <button className="register-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
                </>
            )}

            <div className="register-divider">or</div>
            <Link to="/login" className="login-link-btn">Back to Sign In</Link>
            </div>

        </div>
        </div>
  );

}


export default ResetPassword;