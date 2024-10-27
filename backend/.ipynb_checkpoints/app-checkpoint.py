from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

app = Flask(__name__)
CORS(app)

# Load and prepare the data
data = pd.read_csv('car_data.csv')

# Select relevant features
features = ['registration_year', 'kms_driven', 'manufacturing_year', 'mileage(kmpl)', 'engine(cc)', 'max_power(bhp)', 'torque(Nm)']
target = 'price(in lakhs)'

# Handle missing values
imputer = SimpleImputer(strategy='mean')
X = imputer.fit_transform(data[features])
y = data[target]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train the model
model = LinearRegression()
model.fit(X_train_scaled, y_train)

@app.route('/predict', methods=['POST'])
def predict():
    input_data = request.json
    input_df = pd.DataFrame([input_data])
    
    # Handle missing values in input
    input_imputed = imputer.transform(input_df[features])
    
    # Scale input data
    input_scaled = scaler.transform(input_imputed)
    
    # Make prediction
    prediction = model.predict(input_scaled)
    
    return jsonify({'predicted_price': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)