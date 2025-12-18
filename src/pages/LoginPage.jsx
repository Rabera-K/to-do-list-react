import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuthContext} from '../context/AuthContext';
import '../styles/validation.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErrors, setLocalErrors] = useState([]);
  const { login, loading, error: authError, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = [];
    
    if (!email.trim()) {
      errors.push('Email is required');
    }
    
    if (!password.trim()) {
      errors.push('Password is required');
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
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const clearError = () => {
    setLocalErrors([]);
  };

  return (
    <div className="wrapper">
      <h1>Login</h1>
      
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
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>New here? <Link to="/signup">Create an Account</Link></p>
    </div>
  );
}

export default LoginPage;