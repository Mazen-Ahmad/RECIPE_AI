from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import traceback

# Import your existing Python files
from nlp_processor import process_recipe_text  # Your NLP processing file
from ml_predictor import predict_difficulty    # Your ML prediction file

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/api/predict-difficulty', methods=['POST'])
def predict_recipe_difficulty():
    try:
        # Get recipe text from frontend
        data = request.get_json()
        recipe_text = data.get('recipe_text', '')
        
        if not recipe_text:
            return jsonify({'error': 'Recipe text is required'}), 400
        
        print(f"Received recipe text: {recipe_text[:100]}...")  # Debug log
        
        # Step 1: Process recipe text using your NLP processor
        processed_data = process_recipe_text(recipe_text)
        print(f"Processed data: {processed_data}")  # Debug log
        
        # Step 2: Predict difficulty using your ML model
        prediction_result = predict_difficulty(processed_data)
        print(f"Prediction result: {prediction_result}")  # Debug log
        
        # Step 3: Combine results for frontend
        response = {
            "predicted_difficulty": prediction_result["predicted_difficulty"],
            "confidence_scores": prediction_result["confidence_scores"],
            "ingredients": processed_data["ingredients"],
            "ingredient_count": processed_data["ingredient_count"],
            "estimated_cooking_time": processed_data.get("estimated_cooking_time_minutes", 30),
            "complexity_score": processed_data.get("complexity_score", 1),
            "status": "success"
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "API is running"})

@app.route('/')
def home():
    return jsonify({
        "message": "Recipe Difficulty Predictor API",
        "endpoints": {
            "/api/predict-difficulty": "POST - Predict recipe difficulty",
            "/api/health": "GET - Health check"
        }
    })

if __name__ == '__main__':
    print("Starting Recipe Difficulty Predictor API...")
    print("Frontend should connect to: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)