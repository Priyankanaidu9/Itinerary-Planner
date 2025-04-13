import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Signup from "./pages/SignUp"; // ✅ Correct Signup component
import Explore from "./pages/Explore";
import SavedTrips from "./pages/SavedTrips";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import './App.css'; // ✅ Import the CSS

const App = () => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Monitor login/logout
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
    <Router>
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
              <Link to="/signup">Sign Up</Link> {/* ✅ Added Signup link */}
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/explore"
          element={<Explore savedPlaces={savedPlaces} setSavedPlaces={setSavedPlaces} />}
        />
        <Route path="/saved-trips" element={<SavedTrips savedPlaces={savedPlaces} />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* ✅ Correct Signup route */}
      </Routes>
    </Router>
  );
};

export default App;
