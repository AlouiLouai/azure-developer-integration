
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      login();
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, login, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallbackPage;
