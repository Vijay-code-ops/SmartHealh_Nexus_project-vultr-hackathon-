class Bed(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.id'), nullable=False)
    ward_type = db.Column(db.String(50), nullable=False)  # ICU, General, Emergency, etc.
    status = db.Column(db.String(20), default='available')  # available, occupied, maintenance
    current_patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'))
    last_sanitized = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)