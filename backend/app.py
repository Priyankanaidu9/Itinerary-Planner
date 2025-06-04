import requests
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)  # ✅ Corrected here
CORS(app)  # Enable CORS globally

# 🔐 API Key
API_KEY = "AIzaSyATuIgymyHtGJUBwBauyhOy1JA51pkwKgo"
API_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key={API_KEY}"

# 🔍 Itinerary generation function
def generate_itinerary(destination, days, budget_range):
    min_budget = int(budget_range.split('-')[0].replace(',', '').strip())
    max_budget = int(budget_range.split('-')[1].replace(',', '').strip())

    prompt = f"""
    Plan a detailed {days}-day travel itinerary for {destination}, staying strictly within a budget of ₹{min_budget} - ₹{max_budget}.

    For each day, include:
    - Affordable attractions to visit
    - Budget-friendly restaurants
    - Hidden gems
    - Hotels/homestays
    - Cost-effective transport options

    At the end, include:
    - Optional local tour packages (if affordable)
    - Budget breakdown (stay, food, travel, etc.)
    - Final approximate trip cost summary within the budget

    Use this format:
    Day 1:
    - Attractions: ...
    - Restaurants: ...
    - Hidden Gems: ...
    - Hotel: ...
    - Transport: ...

    Travel Packages:
    - ...

    Approximate Budget Summary:
    - Total Cost: ₹____
    - Breakdown: Stay ₹___ | Food ₹___ | Travel ₹___ | Misc ₹___
    """

    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            raw_output = result["candidates"][0]["content"]["parts"][0]["text"]
            return extract_and_format_itinerary(raw_output)
        else:
            return f"Error {response.status_code}: {response.text}"
    except Exception as e:
        return f"Error: {e}"

# 🧹 Format content with HTML
def extract_and_format_itinerary(text):
    text = text.replace("*", "")  # Remove asterisks
    text = re.sub(r"(Day \d+:)", r'<h3 class="day-heading">🗓 \1</h3>', text)
    text = re.sub(r"(Travel Packages.*?)\n", r'<h3 class="section-heading">📦 \1</h3>\n', text, flags=re.IGNORECASE)
    text = re.sub(r"(Approximate Budget Summary.*?)\n", r'<h3 class="section-heading">💰 \1</h3>\n', text, flags=re.IGNORECASE)
    return text.replace("\n", "<br>").strip()  # Convert to <br> format

# 📥 API route
@app.route('/itinerary', methods=['POST'])
def get_itinerary():
    data = request.json
    destination = data.get("destination")
    days = int(data.get("days"))
    budget_range = data.get("budget_range")
    itinerary = generate_itinerary(destination, days, budget_range)
    return jsonify({"itinerary": itinerary})

# 🚀 Run server
if __name__ == '__main__':  # ✅ Corrected here
    app.run(debug=True, port=5000)
