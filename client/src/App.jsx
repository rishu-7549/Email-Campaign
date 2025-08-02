import { useState, useEffect } from "react";
import CampaignBuilder from "./pages/CampaignBuilder";
import Login from "./components/Login";
import Signup from "./components/Signup";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    // Clear any existing data when a new user logs in
    if (user && user.email !== userData.email) {
      localStorage.clear();
    }
    setUser(userData);
    setToken(userToken);
  };

  const handleSignup = (userData, userToken) => {
    // Clear any existing data when a new user signs up
    if (user && user.email !== userData.email) {
      localStorage.clear();
    }
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    // Clear all localStorage items to ensure complete reset
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  const switchToSignup = () => {
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
  };

  // If not authenticated, show login/signup
  if (!user || !token) {
    return showSignup ? (
      <Signup onSignup={handleSignup} onSwitchToLogin={switchToLogin} />
    ) : (
      <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
    );
  }

  // If authenticated, show the main app
  return (
    <div className="h-screen bg-gray-50">
      <CampaignBuilder
        key={user?.email} // Force remount when user changes
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
}
