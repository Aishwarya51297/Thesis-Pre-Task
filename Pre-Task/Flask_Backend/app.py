from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os
import json
import openai
import base64
 
app = Flask(__name__, template_folder="templates")
CORS(app)
openai.api_key = "key"  # Don't forget to replace with your actual API key.
# Serve Home Page with Images
 
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
 
 
def json_serializable(data):
    """Convert any set to a list to make it JSON serializable."""
    if isinstance(data, set):
        return list(data)
    if isinstance(data, dict):
        return {key: json_serializable(value) for key, value in data.items()}
    if isinstance(data, list):
        return [json_serializable(item) for item in data]
 
@app.route('/images', methods=['GET'])
def serve_images():
    image_folder = os.path.join(app.static_folder, "images")
    images = [f for f in os.listdir(image_folder) if f.lower().endswith(('png', 'jpg', 'jpeg'))]
    return jsonify(images)
 
# Serve Image
@app.route('/images/<filename>', methods=['GET'])
def get_image(filename):
    image_folder = os.path.join(app.static_folder, "images")
    return send_from_directory(image_folder, filename)
 
def get_metadata(image_id):
    """Fetch dynamic metadata (gender, age, orientation) based on the image_id."""
   
    # Initialize the values for gender, age group, and orientation
    gender = "unknown"
    age_group = "unknown"
    orientation = "unknown"
    dataList = []
 
    # Define the path to your stats.json file
    image_folder = os.path.join(app.static_folder, "data", "stats.json")
   
    # Open and load the JSON data from stats.json
    with open(image_folder, 'r') as file:
        image_metadata = json.load(file)
        print(image_metadata)  # For debugging: to check the structure of the JSON
 
        # Dynamically check for gender based on image_id
        for gender_key, gender_data in image_metadata["gender"].items():
            if gender_key.endswith("_ids") and image_id in gender_data:
                gender = str(gender_key).replace("_ids", "")  # Ensure it's a string
                dataList.insert(0, gender)  # Insert gender into the first position
                break  # Exit the loop once we find the matching gender
   
        # Age group
        for age_key, age_data in image_metadata["age"].items():
            if age_key.endswith("_ids") and image_id in age_data:
                age_group = str(age_key).replace("_ids", "")  # Ensure it's a string
                age_group = age_group.replace("_", "")  # Clean up any underscores
                dataList.insert(1, age_group)  # Insert age group into the second position
                break  # Exit the loop once we find the matching age group
       
        # Orientation
        for orientation_key, orientation_data in image_metadata["orientation"].items():
            if orientation_key.endswith("_ids") and image_id in orientation_data:
                orientation = str(orientation_key).replace("_ids", "")  # Ensure it's a string
                orientation = orientation.replace("_", "")
                dataList.insert(2, orientation)  # Insert orientation into the third position
                break  # Exit the loop once we find the matching orientation
   
    return dataList
 
 
# Describe Image with GPT-4o Vision Model
@app.route('/describe-image/<image_id>', methods=['POST'])
def describe_image(image_id):
    """
    Fetches the description of the image from OpenAI GPT-4o model.
    """
    print(image_id)
    number = image_id.split(".")[0]
    metadata= get_metadata(int(number))  # Convert image_id to int
    image_folder = os.path.join(app.static_folder, "images")
    image_path = os.path.join(image_folder, f"{image_id}")  # Assuming image format is PNG
    base64_image = encode_image(image_path)
    prompt = f"Describe the given image of a {metadata[0]},{metadata[1]} person who is {metadata[2]}. Provide a detailed description of the {metadata[0]} and their environment."
    print(prompt)
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that responds in plain text. Help me with my math homework!"},
                {"role": "user", "content": [
                    {"type": "text", "text":f"{prompt}"},
                    {"type": "image_url", "image_url": {
                        "url": f"data:image/png;base64,{base64_image}"}
                    }],
                }
                ]
        )
        print(response.choices[0].message.content)
        description=response.choices[0].message.content
        return jsonify({"image_id": image_id, "description": description})
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
 
if __name__ == '__main__':
    app.run(debug=True)