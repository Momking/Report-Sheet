import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSendEmailVerification,
} from "../../config/auth";
import styled from "styled-components";
import { useAuth } from "../../Context/AuthContext";
import { useSnackbar } from "notistack";

const Login = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
      } finally {
        setIsSigningIn(false);
        doSendEmailVerification();
      }
    }
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch(() => setIsSigningIn(false));
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to="/" replace={true} />}
      <Wrapper>
        <div className="card">
          <h2 className="title">Welcome Back 👋</h2>
          <p className="subtitle">Login to continue</p>

          <form onSubmit={onSubmit} className="form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>

            {errorMessage && <span className="error">{errorMessage}</span>}

            <button
              type="submit"
              disabled={isSigningIn}
              className="btn primary-btn"
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            disabled={isSigningIn}
            onClick={onGoogleSignIn}
            className="btn google-btn"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="google-icon"
            />
            {isSigningIn ? "Signing In..." : "Continue with Google"}
          </button>
        </div>
      </Wrapper>
    </>
  );
};

export default Login;

// ✅ STYLES
const Wrapper = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;

  .card {
    width: 100%;
    max-width: 400px;
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    text-align: center;
  }

  .title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #6b7280;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    text-align: left;
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.9rem;
    color: #374151;
  }

  .input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 1rem;
    transition: 0.3s;
  }

  .input:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }

  .btn {
    width: 100%;
    padding: 0.8rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
    margin-top: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .primary-btn {
    background: #2563eb;
    color: white;
    border: none;
  }

  .primary-btn:hover {
    background: #1e40af;
  }

  .primary-btn:disabled {
    background: #93c5fd;
    cursor: not-allowed;
  }

  .google-btn {
    background: #fff;
    border: 1px solid #d1d5db;
    color: #374151;
    font-weight: 500;
  }

  .google-btn:hover {
    background: #f3f4f6;
  }

  .google-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .text {
    margin: 1rem 0;
    font-size: 0.9rem;
  }

  .text a {
    color: #2563eb;
    font-weight: bold;
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1rem 0;
    color: #9ca3af;
    font-size: 0.85rem;
    font-weight: bold;
  }

  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #d1d5db;
  }

  .divider:not(:empty)::before {
    margin-right: 0.75em;
  }

  .divider:not(:empty)::after {
    margin-left: 0.75em;
  }

  .error {
    color: #dc2626;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    display: block;
  }
`;
