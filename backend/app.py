from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Allow React to access this API

# Your Gemini API Key (🔐 keep this secret in real projects)
API_KEY = "AIzaSyDgyFI2qKStcu0gkC441bKoRmNJZQ7VA7Y"
API_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key={API_KEY}"

# ✅ Your model function (from your script)
def generate_itinerary(destination, days, budget_range):
    budget_text = f"between {budget_range.split('-')[0].strip()} and {budget_range.split('-')[1].strip()} INR per day."

    prompt = f"""
    Generate a detailed {days}-day travel itinerary for {destination}.
    - Budget: {budget_text}
    - Include must-visit attractions, restaurants, and hidden gems.
    - Optimize travel routes and transportation options.
    - Share tips on culture and safety.
    - Format clearly with day-wise plans.
    """

    headers = {
        "Content-Type": "application/json"
    }

    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            return result["candidates"][0]["content"]["parts"][0]["text"]
        else:
            return f"Error {response.status_code}: {response.text}"
    except Exception as e:
        return f"Error: {e}"

# 🔁 Route for frontend to call
@app.route('/itinerary', methods=['POST'])
def get_itinerary():
    data = request.json
    destination = data.get("destination")
    days = data.get("days")
    budget_range = data.get("budget_range")

    itinerary = generate_itinerary(destination, days, budget_range)
    return jsonify({"itinerary": itinerary})

# 🏃‍♀️ Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
