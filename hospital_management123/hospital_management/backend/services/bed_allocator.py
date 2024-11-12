# backend/services/bed_allocator.py
from datetime import datetime, timedelta
from backend.models import Bed, Hospital
from backend.utils.ml_predictor import predict_bed_demand

class BedManagementSystem:
    def __init__(self):
        self.bed_types = ['ICU', 'General', 'Emergency', 'Special Care']
        self.min_buffer = 2  # Minimum beds to keep as buffer per type

    def get_available_beds(self, hospital_id=None, bed_type=None):
        """Get available beds with optional filters"""
        query = Bed.query.filter(Bed.status == 'available')
        
        if hospital_id:
            query = query.filter(Bed.hospital_id == hospital_id)
        if bed_type:
            query = query.filter(Bed.ward_type == bed_type)
            
        return query.all()

    def allocate_bed(self, patient_id, preferred_hospital_id=None, bed_type='General'):
        """Allocate best available bed for patient"""
        # First try preferred hospital
        if preferred_hospital_id:
            bed = self._find_suitable_bed(preferred_hospital_id, bed_type)
            if bed:
                return self._assign_bed(bed, patient_id)

        # If no bed in preferred hospital, search in nearby hospitals
        nearby_hospitals = self._get_nearby_hospitals(preferred_hospital_id)
        for hospital in nearby_hospitals:
            bed = self._find_suitable_bed(hospital.id, bed_type)
            if bed:
                return self._assign_bed(bed, patient_id)

        return None, "No available beds found"

    def predict_bed_availability(self, hospital_id, days_ahead=7):
        """Predict bed availability for next n days"""
        current_occupancy = self._get_current_occupancy(hospital_id)
        predicted_demand = predict_bed_demand(hospital_id, days_ahead)
        
        availability_forecast = []
        for day in range(days_ahead):
            forecast = {
                'date': datetime.now() + timedelta(days=day),
                'predicted_available': {
                    bed_type: max(0, current_occupancy[bed_type]['total'] - 
                                predicted_demand[day][bed_type])
                    for bed_type in self.bed_types
                }
            }
            availability_forecast.append(forecast)
            
        return availability_forecast

    def _find_suitable_bed(self, hospital_id, bed_type):
        """Find suitable bed based on type and availability"""
        return Bed.query.filter(
            Bed.hospital_id == hospital_id,
            Bed.ward_type == bed_type,
            Bed.status == 'available'
        ).first()

    def _assign_bed(self, bed, patient_id):
        """Assign bed to patient and update status"""
        try:
            bed.status = 'occupied'
            bed.current_patient_id = patient_id
            bed.last_sanitized = datetime.now()
            db.session.commit()
            return bed, "Bed allocated successfully"
        except Exception as e:
            db.session.rollback()
            return None, f"Error allocating bed: {str(e)}"

    def _get_current_occupancy(self, hospital_id):
        """Get current bed occupancy statistics"""
        occupancy = {}
        for bed_type in self.bed_types:
            beds = Bed.query.filter(
                Bed.hospital_id == hospital_id,
                Bed.ward_type == bed_type
            ).all()
            
            occupied = len([b for b in beds if b.status == 'occupied'])
            occupancy[bed_type] = {
                'total': len(beds),
                'occupied': occupied,
                'available': len(beds) - occupied
            }
        
        return occupancy

    def _get_nearby_hospitals(self, hospital_id):
        """Get list of nearby hospitals sorted by distance"""
        if not hospital_id:
            return Hospital.query.all()
            
        main_hospital = Hospital.query.get(hospital_id)
        if not main_hospital:
            return []

        # In a real implementation, you would use geocoding and distance calculations
        # For this example, we'll just return all other hospitals
        return Hospital.query.filter(Hospital.id != hospital_id).all()