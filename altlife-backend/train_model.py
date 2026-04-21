import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
import joblib
import os

def train_model():
    print("Loading data...")
    df = pd.read_csv('profile_data.csv')
    X = df[['age', 'career', 'lifestyle', 'choice']]
    y = df[['happiness', 'success', 'finance']]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    categorical_features = ['career', 'lifestyle', 'choice']
    numerical_features = ['age']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ]
    )
    
    model = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42)))
    ])
    
    print("Training model...")
    model.fit(X_train, y_train)
    
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"Training R² Score: {train_score:.4f}")
    print(f"Testing R² Score: {test_score:.4f}")
    
    os.makedirs('altlife-backend/model_artifacts', exist_ok=True)
    joblib.dump(model, 'altlife-backend/model_artifacts/model.pkl')
    print("Model saved to model_artifacts/model.pkl")
    
    return model

if __name__ == '__main__':
    train_model()
