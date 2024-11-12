# backend/services/queue_manager.py
from datetime import datetime, timedelta
import numpy as np
from backend.models import Appointment, Doctor

class QueueManager:
    def __init__(self):
        self.average_consultation_time = 15  # minutes

    def calculate_wait_time(self, department_id, doctor_id, appointment_time):
        """Calculate estimated wait time for a patient based on current queue"""
        # Get all appointments for the same doctor on the same day
        current_queue = Appointment.query.filter(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_time >= appointment_time.replace(hour=0, minute=0),
            Appointment.appointment_time <= appointment_time.replace(hour=23, minute=59),
            Appointment.status.in_(['scheduled', 'in-progress'])
        ).order_by(Appointment.appointment_time).all()

        # Calculate estimated wait time based on queue position and average consultation time
        queue_position = len([apt for apt in current_queue 
                            if apt.appointment_time <= appointment_time])
        
        return queue_position * self.average_consultation_time

    def optimize_queue(self, department_id):
        """Optimize queue based on various factors"""
        current_time = datetime.now()
        appointments = Appointment.query.filter(
            Appointment.department_id == department_id,
            Appointment.appointment_time >= current_time,
            Appointment.status == 'scheduled'
        ).all()

        # Factor in doctor availability, priority cases, and current load
        for apt in appointments:
            priority_score = self._calculate_priority_score(apt)
            new_queue_number = self._assign_queue_number(apt, priority_score)
            apt.queue_number = new_queue_number
            apt.estimated_wait_time = self.calculate_wait_time(
                apt.department_id, apt.doctor_id, apt.appointment_time
            )

        db.session.commit()

    def _calculate_priority_score(self, appointment):
        """Calculate priority score based on multiple factors"""
        score = 0
        
        # Factor 1: Patient age (higher priority for elderly)
        if appointment.patient.age > 65:
            score += 2
        
        # Factor 2: Medical history
        if self._has_critical_condition(appointment.patient.medical_history):
            score += 3
        
        # Factor 3: Appointment type
        if appointment.appointment_type == 'emergency':
            score += 5
        
        return score

    def _assign_queue_number(self, appointment, priority_score):
        """Assign queue number based on priority score and current queue"""
        base_queue = Appointment.query.filter(
            Appointment.department_id == appointment.department_id,
            Appointment.appointment_time == appointment.appointment_time
        ).count()
        
        # Adjust queue position based on priority
        adjusted_position = max(1, base_queue - (priority_score // 2))
        return adjusted_position

    @staticmethod
    def _has_critical_condition(medical_history):
        """Check if patient has any critical conditions"""
        critical_conditions = ['heart disease', 'diabetes', 'cancer', 'respiratory']
        return any(condition in medical_history.lower() for condition in critical_conditions)