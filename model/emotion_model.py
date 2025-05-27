#!/usr/bin/env python3
import requests
import json
from flask import Flask, request, jsonify
import os

app = Flask(__name__)
API_TOKEN = "token_from_env"

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    image_file = request.files['image']
    temp_path = f"temp_{os.path.basename(image_file.filename)}"
    image_file.save(temp_path)
    
    try:
        result = emotions(temp_path)
        os.remove(temp_path)  # Clean up
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def emotions(image_path):
    url = "https://api.luxand.cloud/photo/emotions"
    headers = {"token": API_TOKEN}

    if image_path.startswith("https://"):
        files = {"photo": image_path}
    else:
        files = {"photo": open(image_path, "rb")}

    response = requests.post(url, headers=headers, files=files)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"API error: {response.text}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)