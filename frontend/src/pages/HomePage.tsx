import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

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
    <div className="min-h-screen bg-[#1A1A1A] text-gray-100 font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 md:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Connect with <span className="text-[#38E07B]">Ease</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Seamlessly manage your tasks, projects, and collaborations in one intuitive platform.
          </p>
          {user ? (
            <div className="bg-[#29382F] p-6 rounded-lg shadow-xl border border-[#38E07B] inline-block">
              <img src={user.picture} alt="User avatar" className="w-20 h-20 rounded-full mb-4 mx-auto border-2 border-[#38E07B]" />
              <h2 className="text-xl font-bold mb-2">Welcome back, {user.name}!</h2>
              <button
                onClick={logout}
                className="bg-[#38E07B] text-[#1A1A1A] font-bold py-3 px-8 rounded-full transition-all duration-300 hover:brightness-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#38E07B] focus:ring-opacity-75"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="bg-[#38E07B] text-[#1A1A1A] font-bold py-3 px-8 rounded-full transition-all duration-300 hover:brightness-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#38E07B] focus:ring-opacity-75"
            >
              Get Started Now
            </button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:py-24 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            Powerful Features for Your Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-[#29382F] p-8 rounded-lg shadow-xl border border-[#38E07B] text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-[#38E07B] mb-4">
                {/* Placeholder Icon */}
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Intuitive Task Management</h3>
              <p className="text-gray-300">Organize, prioritize, and track your tasks effortlessly with our user-friendly interface.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-[#29382F] p-8 rounded-lg shadow-xl border border-[#38E07B] text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-[#38E07B] mb-4">
                {/* Placeholder Icon */}
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Collaboration</h3>
              <p className="text-gray-300">Work together seamlessly with your team, share updates, and achieve goals faster.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-[#29382F] p-8 rounded-lg shadow-xl border border-[#38E07B] text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-[#38E07B] mb-4">
                {/* Placeholder Icon */}
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9a2 2 0 00-2-2h-7a2 2 0 00-2 2v10a2 2 0 002 2zM9 3L5 7m4-4l4 4m-4-4v14"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Data Management</h3>
              <p className="text-gray-300">Your data is safe with us. We ensure top-notch security and privacy for all your information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 md:py-24 bg-[#1A1A1A] text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            Join thousands of satisfied users who are boosting their productivity with Connect.
          </p>
          <button
            className="bg-[#38E07B] text-[#1A1A1A] font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#38E07B] focus:ring-opacity-75"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Connect App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
