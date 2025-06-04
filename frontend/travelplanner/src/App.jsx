import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Signup from "./pages/SignUp";
import Explore from "./pages/Explore";
import SavedTrips from "./pages/SavedTrips";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import ChatbaseBot from "./components/ChatbaseBot";
import './App.css';

// Helper component to access location inside Router
const AppContent = () => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Monitor login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/saved-trips">Saved Trips</Link>
          <Link to="/profile">Profile</Link>
        </div>

        <div className="nav-right">
          {isAuthenticated ? (
            <>
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="profile-pic"
                  title={user.displayName}
                />
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/explore"
          element={<Explore savedPlaces={savedPlaces} setSavedPlaces={setSavedPlaces} />}
        />
        <Route path="/saved-trips" element={isAuthenticated ? <SavedTrips user={user} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {/* ✅ Show chatbot only if not on /login or /signup */}
      {location.pathname !== "/login" && location.pathname !== "/signup" && <ChatbaseBot />}
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
