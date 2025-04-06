from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS

# Load environment variables
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(ENV_PATH)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Allow only React app

# Get API Key
# GEMINI_API_KEY=""
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("⚠️ GEMINI_API_KEY is not set! Check your .env file.")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_input = request.json.get("message")
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(user_input)
        
        # Check response format
        if hasattr(response, 'text'):
            reply_text = response.text
        else:
            reply_text = response.candidates[0].content if response.candidates else "No response"

        return jsonify({"reply": reply_text})
    
    except Exception as e:
        return jsonify({"reply": f"⚠️ Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
