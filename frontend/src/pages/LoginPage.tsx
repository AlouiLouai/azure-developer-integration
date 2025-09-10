
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Welcome</h1>
        <p>Please sign in with your Google account to continue</p>
        <button onClick={handleLogin} className="google-btn">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
