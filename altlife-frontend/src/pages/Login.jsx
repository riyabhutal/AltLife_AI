import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import "./Login.css";
import { API_BASE, apiFetch } from "../api";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/register";

      const body = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      // ⭐ SAVE TOKEN CORRECTLY FOR HISTORY + OUTCOME + PROFILE
      if (data.access_token) {
        localStorage.setItem("altlife_token", data.access_token);
      }

      // ⭐ SAVE USER DATA
      if (data.user) {
        localStorage.setItem("altlife_user", JSON.stringify(data.user));
      }

      // Notify parent
      if (onLogin) {
        onLogin(data.access_token, data.user);
      }

      toast.success(isLogin ? "Logged In!" : "Account Created!");
      navigate("/profile");

    } catch (err) {
      toast.error(err.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card glass-card animate-scale">

          <div className="login-header">
            <div className="login-icon">
              <HiSparkles />
            </div>
            <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p>{isLogin ? "Sign in to explore your alternate futures"
                        : "Start your journey into alternate realities"}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            {/* USERNAME */}
            <div className="input-group">
              <label>Username</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="input-field with-icon"
                  required
                />
              </div>
            </div>

            {/* EMAIL WHEN REGISTERING */}
            {!isLogin && (
              <div className="input-group animate-fade-in">
                <label>Email</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="input-field with-icon"
                    required
                  />
                </div>
              </div>
            )}

            {/* PASSWORD */}
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field with-icon"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <span className="loading-spinner-small"></span>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"} <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* FOOTER SWITCH */}
          <div className="login-footer">
            <span>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
