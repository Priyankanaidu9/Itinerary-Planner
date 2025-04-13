import React from "react";
import { auth } from "../firebase";

const Profile = () => {
  const user = auth.currentUser;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Profile</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.displayName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{ borderRadius: "50%", width: "100px", marginTop: "1rem" }}
            />
          )}
        </div>
      ) : (
        <p>No user is logged in.</p>
      )}
    </div>
  );
};

export default Profile;
