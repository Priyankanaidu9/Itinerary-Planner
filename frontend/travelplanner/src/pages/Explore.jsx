import { useState } from "react";
import "./explore.css";

const ItineraryPlanner = () => {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("5000 - 8000");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchItinerary = async () => {
    if (!destination || !days || !budget) return;

    setLoading(true);
    setItinerary(""); // Clear previous result

    try {
      const response = await fetch("http://localhost:5000/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          days,
          budget_range: budget,
        }),
      });

      const data = await response.json();
      setItinerary(data.itinerary);

      // 🧠 Save to localStorage for SavedTrips.jsx
      const savedTrips = JSON.parse(localStorage.getItem("savedTrips")) || [];

      const newTrip = {
        name: destination,
        description: `A ${days}-day trip planned with a budget of ₹${budget}`,
        image: `https://source.unsplash.com/400x300/?travel,${destination}`, // Unsplash dynamic image
        itinerary: data.itinerary,
      };

      savedTrips.push(newTrip);
      localStorage.setItem("savedTrips", JSON.stringify(savedTrips));
    } catch (err) {
      console.error("Error:", err);
      setItinerary("❌ Failed to fetch itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="explore">
      <h1>🌍 Personalized Travel Itinerary Planner</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Destination (e.g. Ooty)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <input
          type="number"
          min="1"
          placeholder="Number of Days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <select value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="5000 - 8000">₹5,000 - ₹8,000</option>
          <option value="8000 - 12000">₹8,000 - ₹12,000</option>
          <option value="12000 - 20000">₹12,000 - ₹20,000</option>
        </select>

        <button onClick={fetchItinerary} className="search-button">
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </div>

      <div className="itinerary-output">
        {loading ? (
          <p>🧠 Generating itinerary, please wait...</p>
        ) : itinerary ? (
          <div className="itinerary-box">
            <h2>🧳 Your Itinerary</h2>
            <pre style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
              {itinerary}
            </pre>
          </div>
        ) : (
          <p>Enter details above to get your plan!</p>
        )}
      </div>
    </div>
  );
};

export default ItineraryPlanner;
