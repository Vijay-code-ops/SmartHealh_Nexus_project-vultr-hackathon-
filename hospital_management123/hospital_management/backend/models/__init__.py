# backend/models/__init__.py

from .patient import Patient
from .appointment import Appointment
from .doctor import Doctor
from .department import Department
from .bed import Bed
from .hospital import Hospital


# Initialize SQLAlchemy instance
db = SQLAlchemy()

# Import all models using absolute imports to avoid ImportError
from hospital_management.backend.models.patient import Patient
from hospital_management.backend.models.appointment import Appointment
from hospital_management.backend.models.doctor import Doctor
from hospital_management.backend.models.department import Department
from hospital_management.backend.models.bed import Bed
from hospital_management.backend.models.hospital import Hospital

# Base Model class with common fields and methods
class BaseModel(db.Model):
    """Abstract base model class that other models will inherit from"""
    __abstract__ = True

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def save(self):
        """Save the model instance to database"""
        try:
            db.session.add(self)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    def delete(self):
        """Soft delete the model instance"""
        try:
            self.is_active = False
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    def hard_delete(self):
        """Permanently delete the model instance"""
        try:
            db.session.delete(self)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    def update(self, **kwargs):
        """Update the model instance with given kwargs"""
        try:
            for key, value in kwargs.items():
                if hasattr(self, key):
                    setattr(self, key, value)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    @classmethod
    def get_by_id(cls, id):
        """Get model instance by ID"""
        return cls.query.get(id)

    @classmethod
    def get_all(cls, is_active=True):
        """Get all active/inactive model instances"""
        return cls.query.filter_by(is_active=is_active).all()

# User model for authentication
class User(UserMixin, BaseModel):
    """User model for authentication and access control"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    role = db.Column(db.String(20), nullable=False)  # admin, doctor, nurse, staff
    last_login = db.Column(db.DateTime)
    
    # Relationships
    doctor_profile = db.relationship('Doctor', backref='user', uselist=False)

    def get_full_name(self):
        """Return user's full name"""
        return