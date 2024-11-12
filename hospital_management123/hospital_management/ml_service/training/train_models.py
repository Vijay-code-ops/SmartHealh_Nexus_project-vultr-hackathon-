def train_models(historical_data_path):
    """Train all ML models using historical data"""
    predictor = HospitalPredictor()
    
    # Load and preprocess historical data
    historical_data = pd.read_csv(historical_data_path)
    historical_data['date'] = pd.to_datetime(historical_data['date'])
    
    # Split data into bed demand and wait time datasets
    bed_demand_data = historical_data[['date', 'current_occupancy', 'special_events', 'bed_demand']]
    wait_time_data = historical_data[['current_patients', 'max_capacity', 'available_staff', 
                                    'total_staff', 'hour', 'is_emergency', 'priority_score', 'wait_time']]
    
    # Train models
    predictor.train_bed_demand_model(bed_demand_data)
    predictor.train_wait_time_model(wait_time_data)
    
    return predictor