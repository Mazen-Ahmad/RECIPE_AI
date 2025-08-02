import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import FunctionTransformer
from sklearn.preprocessing import StandardScaler

# Load and train the model (you should do this once and save the model)
df = pd.read_csv("D:\Final_Indian_Food_Unmodified_Ingredients.csv")

# Define features and target
X = df.drop(columns=["difficulty"])
y = df["difficulty"]

# Preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ("tfidf", TfidfVectorizer(), "main_ingredients"),
        ("cooking_and_count", FunctionTransformer(lambda x: x * 1.5), ["estimated_cooking_time_minutes", "ingredient_count"]),
        ("complexity_score", StandardScaler(), ["complexity_score"])
    ]
)

# Full pipeline
pipeline = Pipeline([
    ("features", preprocessor),
    ("clf", RandomForestClassifier(random_state=42))
])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline.fit(X_train, y_train)

def predict_difficulty(processed_data):
    """
    Predict difficulty level for a recipe
    This function is called by app.py
    
    Args:
        processed_data: Dictionary containing recipe features
        
    Returns:
        Dictionary with prediction results
    """
    try:
        # Create DataFrame for prediction
        test_df = pd.DataFrame([{
            "main_ingredients": processed_data.get("main_ingredients_text", ""),
            "estimated_cooking_time_minutes": processed_data.get("estimated_cooking_time_minutes", 30),
            "ingredient_count": processed_data.get("ingredient_count", 1),
            "complexity_score": processed_data.get("complexity_score", 1)
        }])
        
        # Make prediction
        predicted_difficulty = pipeline.predict(test_df)[0]
        
        # Get prediction probabilities for confidence scores
        predicted_probabilities = pipeline.predict_proba(test_df)[0]
        
        # Create confidence scores dictionary
        classes = pipeline.named_steps['clf'].classes_
        confidence_scores = {}
        for i, class_label in enumerate(classes):
            confidence_scores[int(class_label)] = float(predicted_probabilities[i])
        
        # Ensure all difficulty levels (1-5) are present
        for level in range(1, 6):
            if level not in confidence_scores:
                confidence_scores[level] = 0.0
        
        result = {
            "predicted_difficulty": int(predicted_difficulty),
            "confidence_scores": confidence_scores
        }
        
        return result
        
    except Exception as e:
        print(f"Error in predict_difficulty: {str(e)}")
        # Return default prediction if error occurs
        return {
            "predicted_difficulty": 3,
            "confidence_scores": {1: 0.2, 2: 0.2, 3: 0.2, 4: 0.2, 5: 0.2}
        }