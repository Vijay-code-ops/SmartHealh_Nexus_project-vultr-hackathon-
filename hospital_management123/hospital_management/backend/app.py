# backend/app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from backend.config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Register blueprints
    from backend.routes.auth import auth_bp
    from backend.routes.appointment import appointment_bp
    from backend.routes.bed_management import bed_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(appointment_bp, url_prefix='/api/appointments')
    app.register_blueprint(bed_bp, url_prefix='/api/beds')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app