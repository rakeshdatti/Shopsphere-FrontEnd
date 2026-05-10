import { useState } from "react";
import { forgotPassword as forgotPasswordAPI } from "../services/authService";
import "../styles/register.css";
import { Link } from "react-router-dom";
import { isValidEmail } from "../utils/passwordStrength";



function ForgotPassword(){
    const [email,setEmail]=useState("")
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const [sent,setSent]=useState(false)

    async function  handleSubmit(e) {
        e.preventDefault();

        setError("")

        if(!email){
            setError("Please enter your email address.")
            return;
        }

        if(!isValidEmail(email)){
            setError("Please enter a valid email address.")
            return;
        }

        try{
            setLoading(true)
            await forgotPasswordAPI(email)
            setSent(true)
        }catch(err){
            setError(err.response?.data?.message || "Failed to send reset link. Please try again.")
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-left">
                    <div className="register-left-eyebrow">Account Recover</div>
                    <h2>Forgot your<br/><span>Password?</span></h2>
                    <p>No worries - enter your email and we will send a secure reset link instantly.</p>
                    <div className="regiter-left-perks">
                        <div className="perk-item"><div className="perk-icon">🔒</div>Secure & encrypted reset link</div>
                         <div className="perk-item"><div className="perk-icon">⏱️</div>Expires in 1 hour</div>
                        <div className="perk-item"><div className="perk-icon">✉️</div>Check your inbox</div>
                    </div>
                </div>

                <div className="register-right">
                    <div className="register-right-title">Reset Password</div>
                        <div className="register=right-sub">
                            Enter the email linked to your ShopSphere account
                        </div>

                        {error && (
                            <div className="register-error">
                                {error}
                            </div>
                        )}
                        {sent ? 
                            (<div style={{textAlign:"center",padding: "1.5rem 0"}}>
                                <div style={{fontSize:"3rem",marginBottom: "1rem"}}>📬</div>
                                     <div className="register-right-title">Check your inbox</div>
                                     <div className="register-right-sub" style={{marginTop:"0.5rem"}}>
                                        If <strong> {email} </strong> is registered with us, you will receive a reset link.
                                        <br/> Don't forget to check your spam folder!
                                    </div>
                            </div>
                        )
                            :
                            (
                            // ── FORM ── /
                                <>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus/>  
                                    </div>
                                    
                                    <button className="register-btn" onClick={handleSubmit} disabled={loading}>
                                        { loading ? "Sending..." : "Send Reset Link" }
                                    </button>
                                </>
                            )
                        }
                        <div className="register-divider">OR</div>
                        <Link to="/login" className="login-link-btn">Back to Sign In</Link>

                </div>
            </div>
        </div>
        
    );

}

export default ForgotPassword;