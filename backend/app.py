from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score

app = Flask(__name__)
CORS(app)

# Load and prepare the data
data = pd.read_csv('car_data.csv')

# Select relevant features
features = ['registration_year', 'kms_driven', 'manufacturing_year', 'mileage(kmpl)', 'engine(cc)', 'max_power(bhp)', 'torque(Nm)']
target = 'price(in lakhs)'

# Convert columns to numeric, replacing non-numeric values with NaN
for feature in features + [target]:
    data[feature] = pd.to_numeric(data[feature], errors='coerce')

# Remove rows with NaN values
data = data.dropna(subset=features + [target])

# Split the data
X = data[features]
y = data[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create preprocessing steps
numeric_features = features
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# Combine preprocessing steps
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features)
    ])

# Create a pipeline with the preprocessor and the model
model = Pipeline(steps=[('preprocessor', preprocessor),
                        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))])

# Fit the model
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Mean Squared Error: {mse}")
print(f"R-squared Score: {r2}")

@app.route('/predict', methods=['POST'])
def predict():
    input_data = request.json
    input_df = pd.DataFrame([input_data])
    
    # Convert input data to numeric, replacing non-numeric values with NaN
    for feature in features:
        input_df[feature] = pd.to_numeric(input_df[feature], errors='coerce')
    
    # Make prediction
    prediction = model.predict(input_df)
    
    # Ensure prediction is non-negative and within a reasonable range
    prediction = max(0, min(prediction[0], 1000))  # Assuming max price is 1000 lakhs
    
    return jsonify({'predicted_price': float(prediction)})

if __name__ == '__main__':
    app.run(debug=True)