import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../../config/auth";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../Context/AuthContext";
import { useSnackbar } from "notistack";

const Register = () => {
  const { userLoggedIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      try {
        await doCreateUserWithEmailAndPassword(email, password);
      } catch (error) {
        console.error("Registration error:", error);
        enqueueSnackbar(error.message, {
          variant: "error",
          anchorOrigin: {
            horizontal: "center",
            vertical: "bottom",
          },
        });
      } finally {
        setIsRegistering(false);
      }
    }
  };

return (
    <PageWrapper>
      <MainContainer>
        {userLoggedIn ? <Navigate to={"/doctor_use/InitialSheet"} /> : (
          <LayoutGrid>
            {/* Left Side: Information Panel */}
            <InfoPanel>
              <h1 style={{ color: "#2563eb", fontWeight: "bold", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                Easiest Available
              </h1>
              <h2
                style={{
                  fontSize: "2.25rem", // base: text-4xl
                  fontWeight: "bold",
                  color: "#1f2937", // gray-800
                  marginBottom: "1rem",
                  lineHeight: "1.25"
                }}
              >
                Pathology Lab Software
              </h2>
              <FeatureList>
                <FeatureItem>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ height: "1.5rem", width: "1.5rem", color: "#3b82f6", marginRight: "0.5rem" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Easy to start</span>
                </FeatureItem>
                <FeatureItem>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ height: "1.5rem", width: "1.5rem", color: "#3b82f6", marginRight: "0.5rem" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Easy to run</span>
                </FeatureItem>
                <FeatureItem>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ height: "1.5rem", width: "1.5rem", color: "#3b82f6", marginRight: "0.5rem" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Easy to grow</span>
                </FeatureItem>
              </FeatureList>

              <Description>
                Create beautifully designed lab reports and start managing your lab easily in 10 minutes. Labsmart simplifies billing, reporting & day-to-day operations making your lab run smoother and faster.
              </Description>

              <LinksContainer>
                  <StyledInfoLink href="#">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Product brochure
                  </StyledInfoLink>
                   <a href="#" className="text-gray-600 hover:underline">Learn more</a>
              </LinksContainer>
            </InfoPanel>

            {/* Right Side: Registration Form */}
            <FormPanel>
              <h3>Create Your Account</h3>
              <StyledForm onSubmit={onSubmit}>
                <div>
                  <label>Email</label>
                  <InputField
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label>Password</label>
                  <InputField
                    disabled={isRegistering}
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // placeholder="••••••••"
                  />
                </div>
                <div>
                  <label>Confirm Password</label>
                  <InputField
                    disabled={isRegistering}
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    // placeholder="••••••••"
                  />
                </div>
                {errorMessage && (
                  <ErrorMessage role="alert">
                      <p>{errorMessage}</p>
                  </ErrorMessage>
                )}
                <SubmitButton type="submit" disabled={isRegistering}>
                  {isRegistering ? (
                      <>
                          <Spinner viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </Spinner>
                          Creating Account...
                      </>
                  ) : 'Create Account'}
                </SubmitButton>
                <SignInLink>
                  Already have an account?{' '}
                  <Link to={"/login"}>
                    Sign in
                  </Link>
                </SignInLink>
              </StyledForm>
            </FormPanel>
          </LayoutGrid>
        )}
      </MainContainer>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  background-color: #F9FAFB;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
`;

const MainContainer = styled.main`
  width: 100%;
  max-width: 1152px; /* Corresponds to max-w-6xl */
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: center;
`;

const LayoutGrid = styled.div`
  width: 100%;
  background: #fff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;
  display: grid;
  overflow: hidden;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Panel = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const InfoPanel = styled(Panel)`
  background-color: rgba(249, 250, 251, 0.5);

  h1 {
    color: #2563EB;
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  h2 {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 1rem;
    line-height: 1.2;
    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 1.125rem;
  color: #4B5563;
  margin-bottom: 1.5rem;
`;

const FeatureItem = styled.p`
  display: flex;
  align-items: center;
  margin: 0;

  span {
    font-weight: 600;
  }
  svg {
    height: 1.5rem;
    width: 1.5rem;
    color: #3B82F6;
    margin-right: 0.5rem;
  }
`;

const Description = styled.p`
  color: #374151;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const LinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  a {
    text-decoration: none;
  }
  a.text-gray-600:hover {
    text-decoration: underline;
    color: #4B5563;
  }
`;

const StyledInfoLink = styled.a`
  display: flex;
  align-items: center;
  color: #2563EB;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
  svg {
    height: 1.25rem;
    width: 1.25rem;
    margin-right: 0.5rem;
  }
`;

const FormPanel = styled(Panel)`
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #F9FAFB;
  border: 1px solid #D1D5DB;
  color: #000;
  border-radius: 0.5rem;
  transition: box-shadow 0.2s, border-color 0.2s;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const ErrorMessage = styled.div`
  background-color: #FEF2F2;
  border-left: 4px solid #EF4444;
  color: #B91C1C;
  padding: 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  p {
    margin: 0;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.svg`
  animation: ${spin} 1s linear infinite;
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.75rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  color: #fff;
  font-weight: 700;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  background-color: #2563EB;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;

  &:hover {
    background-color: #1D4ED8;
    transform: scale(1.02);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

  &:disabled {
    background-color: #93C5FD;
    cursor: not-allowed;
    transform: scale(1);
  }
`;

const SignInLink = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #4B5563;
  padding-top: 1rem;

  a {
    font-weight: 600;
    color: #2563EB;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Register;

