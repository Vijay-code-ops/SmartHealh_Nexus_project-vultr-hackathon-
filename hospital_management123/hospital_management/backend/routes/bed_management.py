# backend/routes/bed_management.py
from flask import Blueprint, request, jsonify
from backend.services.bed_allocator import BedManagementSystem

bed_bp = Blueprint('bed', __name__)
bed_manager = BedManagementSystem