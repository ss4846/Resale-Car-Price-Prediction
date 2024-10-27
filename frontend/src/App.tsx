import React, { useState } from 'react';
import axios from 'axios';

export default function Component() {
  const [formData, setFormData] = useState({
    registration_year: 2024,
    kms_driven: 50000,
    manufacturing_year: 2019,
    mileage: 15,
    engine: 1500,
    max_power: 100,
    torque: 200
  });
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        registration_year: formData.registration_year,
        kms_driven: formData.kms_driven,
        manufacturing_year: formData.manufacturing_year,
        'mileage(kmpl)': formData.mileage,
        'engine(cc)': formData.engine,
        'max_power(bhp)': formData.max_power,
        'torque(Nm)': formData.torque
      });
      setPredictedPrice(response.data.predicted_price);
    } catch (error) {
      console.error('Error predicting price:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/sample_car.jpeg)' }}>
      <div className="p-8 rounded-lg shadow-md w-120 w-full max-w-md mx-auto bg-black/45 text-white border">
        <h1 className="text-3xl font-bold mb-6 text-center">Car Price Prediction</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="registration_year" className="block text-base font-medium text-white-700">Registration Year</label>
            <input
              type="number"
              id="registration_year"
              name="registration_year"
              value={formData.registration_year}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-white bg-zinc-300 text-black border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="kms_driven" className="block text-base font-medium text-white-700">Kilometers Driven</label>
            <input
              type="number"
              id="kms_driven"
              name="kms_driven"
              value={formData.kms_driven}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-white bg-zinc-300 text-black border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="manufacturing_year" className="block text-base font-medium text-white-700">Manufacturing Year</label>
            <input
              type="number"
              id="manufacturing_year"
              name="manufacturing_year"
              value={formData.manufacturing_year}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-white bg-zinc-300 text-black border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="mileage" className="block text-base font-medium text-white-700">Mileage (kmpl)</label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-white bg-zinc-300 text-black border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="engine" className="block text-base font-medium text-white-700">Engine (cc)</label>
            <input
              type="number"
              id="engine"
              name="engine"
              value={formData.engine}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-white bg-zinc-300 text-black border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="max_power" className="block text-base font-medium text-white-700">Max Power (bhp)</label>
            <input
              type="number"
              id="max_power"
              name="max_power"
              value={formData.max_power}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-white bg-zinc-300 text-black border-gray-700"
            />
          </div>
          <div>
            <label htmlFor="torque" className="block text-base font-medium text-white-700">Torque (Nm)</label>
            <input
              type="number"
              id="torque"
              name="torque"
              value={formData.torque}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-white bg-zinc-300 text-black border-gray-700"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Predict Price
          </button>
        </form>
        {predictedPrice !== null && (
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold">Predicted Price:</h2>
            <p className="text-2xl font-bold text-indigo-600">₹{predictedPrice.toFixed(2)} Lakhs</p>
          </div>
        )}
      </div>
    </div>
  );
}