import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

class HospitalPredictor:
    def __init__(self):
        self.bed_demand_model = RandomForestRegressor(n_estimators=100)
        self.wait_time_model = RandomForestRegressor(n_estimators=100)
        self.scaler = StandardScaler()
        
    def train_bed_demand_model(self, historical_data):
        """Train model to predict bed demand"""
        X = self._prepare_features(historical_data)
        y = historical_data['bed_demand']
        
        X_scaled = self.scaler.fit_transform(X)
        self.bed_demand_model.fit(X_scaled, y)
    
    def predict_bed_demand(self, features):
        """Predict bed demand for given features"""
        X = self._prepare_features(features)
        X_scaled = self.scaler.transform(X)
        return self.bed_demand_model.predict(X_scaled)
    
    def train_wait_time_model(self, historical_data):
        """Train model to predict wait times"""
        X = self._prepare_wait_time_features(historical_data)
        y = historical_data['wait_time']
        
        X_scaled = self.scaler.fit_transform(X)
        self.wait_time_model.fit(X_scaled, y)
    
    def predict_wait_time(self, features):
        """Predict wait time for given features"""
        X = self._prepare_wait_time_features(features)
        X_scaled = self.scaler.transform(X)
        return self.wait_time_model.predict(X_scaled)
    
    def _prepare_features(self, data):
        """Prepare features for bed demand prediction"""
        return pd.DataFrame({
            'day_of_week': data['date'].dt.dayofweek,
            'month': data['date'].dt.month,
            'is_weekend': data['date'].dt.dayofweek.isin([5, 6]).astype(int),
            'current_occupancy': data['current_occupancy'],
            'seasonal_factor': self._calculate_seasonal_factor(data['date']),
            'special_events': data['special_events'].astype(int)
        })
    
    def _prepare_wait_time_features(self, data):
        """Prepare features for wait time prediction"""
        return pd.DataFrame({
            'department_load': data['current_patients'] / data['max_capacity'],
            'staff_availability': data['available_staff'] / data['total_staff'],
            'time_of_day': data['hour'],
            'is_emergency': data['is_emergency'].astype(int),
            'patient_priority': data['priority_score']
        })
    
    def _calculate_seasonal_factor(self, dates):
        """Calculate seasonal factor based on historical patterns"""
        # Implement seasonal factor calculation based on your specific needs
        return np.sin(2 * np.pi * dates.dt.dayofyear / 365)