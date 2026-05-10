import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/verify-otp.css";

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  // 6 individual digit boxes
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  function handleDigitChange(index, value) {
    // only allow single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError("");

    // auto-focus next box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    // backspace moves to previous box
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    pasted.split("").forEach((char, i) => { newDigits[i] = char; });
    setDigits(newDigits);
    // focus last filled box
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify() {
    const otp = digits.join("");
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await API.post("/auth/verify-otp", { email, otp });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setError(e.response?.data?.message || "Invalid OTP. Please try again.");
      // shake effect — reset digits on wrong OTP
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await API.post("/auth/resend-otp", { email });
      setError("");
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (e) {
      setError("Failed to resend OTP. Please try again.");
    }
  }

  return (
    <div className="otp-page">
      <div className="otp-card">

        {/* Icon */}
        <div className="otp-icon">
          {success ? "✅" : "📧"}
        </div>

        {success ? (
          <>
            <h2 className="otp-title">Verified!</h2>
            <p className="otp-sub">Your email has been verified. Redirecting to login...</p>
            <div className="otp-success-bar">
              <div className="otp-success-fill" />
            </div>
          </>
        ) : (
          <>
            <h2 className="otp-title">Verify your email</h2>
            <p className="otp-sub">
              We've sent a 6-digit code to<br />
              <strong>{email}</strong>
            </p>

            {/* 6 digit boxes */}
            <div className="otp-boxes" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  className={`otp-box ${digit ? "filled" : ""}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {error && (
              <div className="otp-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              className="otp-btn"
              onClick={handleVerify}
              disabled={loading || digits.join("").length < 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="otp-resend">
              Didn't receive the code?{" "}
              <button className="resend-btn" onClick={handleResend}>
                Resend OTP
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default VerifyOTP;
