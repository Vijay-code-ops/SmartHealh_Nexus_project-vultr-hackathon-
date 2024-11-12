# backend/routes/appointment.py
from flask import Blueprint, request, jsonify
from backend.services.queue_manager import QueueManager
from backend.models import Appointment, Patient, Doctor

appointment_bp = Blueprint('appointment', __name__)
queue_manager = QueueManager()

@appointment_bp.route('/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json()
    try:
        # Create new appointment
        appointment = Appointment(
            patient_id=data['patient_id'],
            doctor_id=data['doctor_id'],
            department_id=data['department_id'],
            appointment_time=datetime.fromisoformat(data['appointment_time'])
        )
        
        # Calculate wait time and queue number
        appointment.estimated_wait_time = queue_manager.calculate_wait_time(
            appointment.department_id,
            appointment.doctor_id,
            appointment.appointment_time
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        return jsonify({
            'message': 'Appointment scheduled successfully',
            'appointment_id': appointment.id,
            'queue_number': appointment.queue_number,
            'estimated_wait_time': appointment.estimated_wait_time
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@appointment_bp.route('/appointments/<int:appointment_id>/status', methods=['PUT'])
@jwt_required()
def update_appointment_status():
    data = request.get_json()
    appointment = Appointment.query.get_or_404(appointment_id)
    
    try:
        appointment.status = data['status']
        if appointment.status == 'completed':
            # Trigger queue optimization
            queue_manager.optimize_queue(appointment.department_id)
            
        db.session.commit()
        return jsonify({'message': 'Appointment status updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400