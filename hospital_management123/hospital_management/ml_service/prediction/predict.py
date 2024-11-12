def predict_hospital_metrics(predictor, current_data):
    """Make predictions for bed demand and wait times"""
    bed_demand = predictor.predict_bed_demand(current_data)
    wait_time = predictor.predict_wait_time(current_data)
    
    return {
        'predicted_bed_demand': bed_demand,
        'predicted_wait_time': wait_time
    }