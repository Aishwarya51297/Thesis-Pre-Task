from flask import Flask, jsonify, send_from_directory, render_template
from flask_cors import CORS
import os
import json

app = Flask(__name__, template_folder="templates")
CORS(app)

# Serve Home Page with Images
@app.route('/images', methods=['GET'])
def serve_images():
    image_folder = os.path.join(app.static_folder, "images")
    images = [f for f in os.listdir(image_folder) if f.lower().endswith(('png', 'jpg', 'jpeg'))]
    return jsonify(images)

# Serve Statistics JSON Data
@app.route('/statistics', methods=['GET'])
def serve_statistics():
    stats_file = os.path.join(os.path.dirname(__file__), 'static/data/stats.json')
    with open(stats_file, 'r') as f:
        stats = json.load(f)
    return jsonify(stats)

@app.route('/images/<filename>', methods=['GET'])
def get_image(filename):
    image_folder = os.path.join(app.static_folder, "images")
    return send_from_directory(image_folder, filename)

if __name__ == '__main__':
    app.run(debug=True)