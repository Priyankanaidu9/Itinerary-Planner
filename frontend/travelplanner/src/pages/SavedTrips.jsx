import React, { useEffect, useState } from "react";
import "./savedtrip.css";

const SavedTrips = () => {
  const [savedPlaces, setSavedPlaces] = useState([]);

  // Load saved trips from localStorage when the component mounts
  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem("savedTrips")) || [];
    setSavedPlaces(trips);
  }, []);

  // Clear all trips
  const clearAllTrips = () => {
    localStorage.removeItem("savedTrips");
    setSavedPlaces([]);
  };

  return (
    <div className="saved-trips">
      <h1>Your Saved Trips</h1>

      {savedPlaces.length === 0 ? (
        <p>No saved trips yet. Start adding places!</p>
      ) : (
        <>
          <button className="clear-button" onClick={clearAllTrips}>
            🗑️ Clear All Trips
          </button>

          <div className="saved-destinations">
            {savedPlaces.map((place, index) => (
              <div key={index} className="destination-card">
                <img src={place.image} alt={place.name} />
                <h3>{place.name}</h3>
                <p>{place.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SavedTrips;
