import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../../config/auth";
import styled from "styled-components";
import { useAuth } from "../../Context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      await doCreateUserWithEmailAndPassword(email, password);
    }
  };

  return (
    <div>
      <Wrapper>
        {userLoggedIn && <Navigate to={"/doctor_use/InitialSheet"} replace={true} />}
        <main className="main-container">
          <div className="card">
            <div className="card-title">
              <h3>Create a New Account</h3>
            </div>
            <form onSubmit={onSubmit} className="form-group">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="input-field"
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  disabled={isRegistering}
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="input-field"
                />
              </div>

              <div>
                <label>Confirm Password</label>
                <input
                  disabled={isRegistering}
                  type="password"
                  autoComplete="off"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setconfirmPassword(e.target.value);
                  }}
                  className="input-field"
                />
              </div>

              {errorMessage && (
                <span className="error-message">{errorMessage}</span>
              )}

              <button
                type="submit"
                disabled={isRegistering}
                className={`button ${isRegistering ? "disabled" : "enabled"}`}
              >
                {isRegistering ? "Signing Up..." : "Sign Up"}
              </button>
              <div className="login-link">
                Already have an account? {"   "}
                <Link to={"/login"} className="login-text">
                  Continue
                </Link>
              </div>
            </form>
          </div>
        </main>
      </Wrapper>
    </div>
  );
};

export default Register;

const Wrapper = styled.section`
  .main-container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card {
    width: 24rem;
    color: #4b5563;
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
    color: #4b5563;
    background-color: transparent;
    border: 1px solid #e2e8f0;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    border-radius: 0.375rem;
  }

  .input-field:focus {
    border-color: #2563eb;
  }

  .error-message {
    color: #e53e3e;
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
    background-color: #d1d5db;
    cursor: not-allowed;
  }

  .button:hover {
    background-color: #2563eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.1);
  }
`;
