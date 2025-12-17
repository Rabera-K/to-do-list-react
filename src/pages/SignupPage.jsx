import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import '../styles/validation.css';

 function SignupPage() {
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [localErrors, setLocalErrors] = useState([]);
  const { signup, loading, error: authError, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = [];
    
    if (!firstname.trim()) {
      errors.push('Firstname is required');
    }
    
    if (!email.trim()) {
      errors.push('Email is required');
    }
    
    if (!password.trim()) {
      errors.push('Password is required');
    }
    
    if (password.length < 8) {
      errors.push('Password must have at least 8 characters');
    }
    
    if (password !== repeatPassword) {
      errors.push('Password does not match repeat password');
    }
    
    setLocalErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErrors([]);
    
    if (!validateForm()) {
      return;
    }
    
    const userData = {
      name: firstname,
      email,
      password,
    };
    
    const result = await signup(userData);
    
    if (result.success) {
      // Redirect to login page after successful signup
      navigate('/login');
    }
  };

  const clearError = () => {
    setLocalErrors([]);
  };

  return (
    <div className="wrapper">
      <h1>Sign Up</h1>
      
      {(localErrors.length > 0 || authError) && (
        <div id="error-message">
          {localErrors.map((error, index) => (
            <p key={index} className="error">{error}</p>
          ))}
          {authError && <p className="error">{authError}</p>}
        </div>
      )}
      
      <form id="form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname-input">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
              <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
            </svg>
          </label>
          <input
            type="text"
            id="firstname-input"
            value={firstname}
            onChange={(e) => {
              setFirstname(e.target.value);
              clearError();
            }}
            placeholder="Firstname"
            disabled={loading}
            autoComplete="given-name"
          />
        </div>
        <div>
          <label htmlFor="email-input">@</label>
          <input
            type="email"
            id="email-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
            }}
            placeholder="Email"
            disabled={loading}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password-input">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
              <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
            </svg>
          </label>
          <input
            type="password"
            id="password-input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError();
            }}
            placeholder="Password"
            disabled={loading}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label htmlFor="repeat-password-input">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
              <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
            </svg>
          </label>
          <input
            type="password"
            id="repeat-password-input"
            value={repeatPassword}
            onChange={(e) => {
              setRepeatPassword(e.target.value);
              clearError();
            }}
            placeholder="Repeat Password"
            disabled={loading}
            autoComplete="new-password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default SignupPage;