import{useState, useCallback} from 'react';
import {usenavigate}from 'react-router-dom';
import{signup, login} from '../services/auth';

function useAuth(){
    const[user, setUser]=useState(()=> {
        const storedUser=localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser):null;
    })


const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.login(email, password);
      
      localStorage.setItem("token", data.authToken || data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signup(userData);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
}
export default useAuth;