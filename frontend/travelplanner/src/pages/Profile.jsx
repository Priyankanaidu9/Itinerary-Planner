import React from "react";
import { auth } from "../firebase";

const Profile = () => {
  const user = auth.currentUser;

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f0f8ff",  // Light blue color
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: "600px",
        margin: "auto",
        color: "#333",  // Darker text for better contrast
      }}
    >
      <h2 style={{ textAlign: "center", fontFamily: "'Roboto', sans-serif" }}>
        User Profile
      </h2>

      {user ? (
        <div style={{ textAlign: "center" }}>
          {/* Profile Picture */}
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{
                borderRadius: "50%",
                width: "150px",
                height: "150px",
                objectFit: "cover",
                marginBottom: "1rem",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
          )}

          {/* User Info */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              <strong>Name:</strong> {user.displayName}
            </p>
            <p style={{ fontSize: "1.1rem" }}>
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          {/* Edit Profile / Log Out Buttons */}
          <div>
            <button
              onClick={() => alert("Feature Coming Soon!")}
              style={{
                backgroundColor: "#2575fc",
                border: "none",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                margin: "10px",
                fontSize: "1rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s ease",
              }}
            >
              Edit Profile
            </button>

            <button
              onClick={() => auth.signOut()}
              style={{
                backgroundColor: "#e74c3c",
                border: "none",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                margin: "10px",
                fontSize: "1rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s ease",
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", fontSize: "1.1rem" }}>
          No user is logged in.
        </p>
      )}
    </div>
  );
};

export default Profile;
