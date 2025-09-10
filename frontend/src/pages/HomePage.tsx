import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import './HomePage.css';

interface User {
  id: string;
  name: string;
  picture: string;
}

const HomePage = () => {
  const { logout } = useAuth();
  const token = localStorage.getItem('token');
  let user: User | null = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  }

  return (
    <div className="home-page">
      <div className="user-card">
        {user ? (
          <>
            <img src={user.picture} alt="User avatar" className="avatar" />
            <h1>Welcome, {user.name}!</h1>
            <p>You are logged in.</p>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <h1>Welcome!</h1>
        )}
      </div>
    </div>
  );
};

export default HomePage;