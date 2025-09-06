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
      try{
        await doSignInWithEmailAndPassword(email, password);
      }catch (error){
        enqueueSnackbar(error.message, {
          variant: "error",
          anchorOrigin: {
            horizontal: "center",
            vertical: "bottom",
          },
        });
      } finally{
        setIsSigningIn(false);
        doSendEmailVerification();
      }
    }
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch((err) => {
        setIsSigningIn(false);
      });
    }
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <Wrapper>
        <main className="container">
          <div className="card">
            <div className="card-title">
              <h3>Welcome Back</h3>
            </div>
            <form onSubmit={onSubmit} className="form-group">
              <label>Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
              <label>Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
              {errorMessage && (
                <span className="error-message">{errorMessage}</span>
              )}
              <button
                type="submit"
                disabled={isSigningIn}
                className={`button ${isSigningIn ? "disabled" : "enabled"}`}
              >
                {isSigningIn ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <p className="link">
              Don't have an account? <Link to={"/register"}>Sign up</Link>
            </p>
            <div className="divider">
              <div className="divider-line"></div>
              <div className="divider-text">OR</div>
              <div className="divider-line"></div>
            </div>
            <button
              disabled={isSigningIn}
              onClick={onGoogleSignIn}
              className={`google-button ${
                isSigningIn ? "disabled" : "enabled"
              }`}
            >
              <svg
                className="google-icon"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                  fill="#4285F4"
                />
                <path
                  d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                  fill="#34A853"
                />
                <path
                  d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                  fill="#FBBC04"
                />
                <path
                  d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                  fill="#EA4335"
                />
              </svg>
              {isSigningIn ? "Signing In..." : "Continue with Google"}
            </button>
          </div>
        </main>
      </Wrapper>
    </div>
  );
};

const Wrapper = styled.section`
  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card {
    width: 24rem;
    color: #4b5563; /* text-gray-600 */
    margin: auto;
    padding: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-radius: 0.5rem;
  }

  .card-title {
    text-align: center;
  }

  .form-group {
    margin-top: 1rem;
  }

  .input-field {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.75rem;
    color: #4b5563; /* text-gray-600 */
    background-color: transparent;
    border: 1px solid #e2e8f0; /* border */
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    border-radius: 0.375rem;
  }

  .input-field:focus {
    border-color: #2563eb; /* focus:border-indigo-600 */
  }

  .error-message {
    color: #e53e3e; /* text-red-600 */
    font-weight: bold;
  }

  .button {
    width: 100%;
    padding: 0.75rem;
    margin-top: 1rem;
    color: #fff;
    font-weight: 500;
    border-radius: 0.375rem;
    transition: background-color 0.3s, box-shadow 0.3s;
    cursor: pointer;
  }

  .button:disabled {
    background-color: #d1d5db; /* bg-gray-300 */
    cursor: not-allowed;
  }

  .button:hover {
    background-color: #2563eb; /* hover:bg-indigo-700 */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .link {
    text-align: center;
    margin-top: 0.5rem;
  }

  .divider {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .divider-line {
    flex-grow: 1;
    border-bottom: 2px solid #cbd5e0; /* border-b-2 */
    margin: 0.25rem;
  }

  .divider-text {
    font-size: 0.875rem;
    font-weight: bold;
  }

  .google-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.625rem;
    margin-top: 1rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.3s;
    cursor: pointer;
  }

  .google-button:disabled {
    cursor: not-allowed;
  }

  .google-button:hover {
    background-color: #f3f4f6; /* hover:bg-gray-100 */
  }

  .google-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export default Login;
