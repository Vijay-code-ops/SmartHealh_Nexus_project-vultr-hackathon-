# backend/services/chatbot.py
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class HospitalChatbot:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("gpt2")
        self.model = AutoModelForCausalLM.from_pretrained("gpt2")
        self.max_length = 100
        self.intent_patterns = {
            'appointment_booking': ['book', 'schedule', 'appointment', 'visit'],
            'check_wait_time': ['wait', 'time', 'long', 'queue'],
            'find_doctor': ['doctor', 'specialist', 'physician'],
            'emergency': ['emergency', 'urgent', 'immediate'],
            'general_info': ['information', 'hours', 'location', 'contact']
        }
        
    def process_message(self, message, user_context=None):
        """Process user message and generate appropriate response"""
        intent = self._detect_intent(message)
        
        if intent == 'emergency':
            return self._handle_emergency()
        
        response = self._generate_response(message, intent, user_context)
        actions = self._determine_actions(intent, message)
        
        return {
            'response': response,
            'actions': actions,
            'intent': intent
        }
    
    def _detect_intent(self, message):
        """Detect user intent from message"""
        message = message.lower()
        
        # Check emergency keywords first
        if any(word in message for word in self.intent_patterns['emergency']):
            return 'emergency'
        
        # Check other intents
        max_matches = 0
        detected_intent = 'general_info'
        
        for intent, patterns in self.intent_patterns.items():
            matches = sum(1 for pattern in patterns if pattern in message)
            if matches > max_matches:
                max_matches = matches
                detected_intent = intent
        
        return detected_intent
    
    def _generate_response(self, message, intent, user_context):
        """Generate appropriate response based on intent and context"""
        if intent == 'appointment_booking':
            return self._handle_appointment_booking(message, user_context)
        elif intent == 'check_wait_time':
            return self._handle_wait_time_check(user_context)
        elif intent == 'find_doctor':
            return self._handle_doctor_search(message)
        elif intent == 'emergency':
            return self._handle_emergency()
        else:
            return self._handle_general_info(message)
    
    def _determine_actions(self, intent, message):
        """Determine required actions based on intent"""
        actions = []
        
        if intent == 'appointment_booking':
            actions.append({
                'type': 'OPEN_APPOINTMENT_FORM',
                'data': self._extract_appointment_details(message)
            })
        elif intent == 'check_wait_time':
            actions.append({
                'type': 'FETCH_WAIT_TIME',
                'data': None
            })
        elif intent == 'find_doctor':
            actions.append({
                'type': 'SEARCH_DOCTORS',
                'data': self._extract_doctor_criteria(message)
            })
        elif intent == 'emergency':
            actions.append({
                'type': 'SHOW_EMERGENCY_CONTACT',
                'data': None
            })
        
        return actions
    
    def _handle_appointment_booking(self, message, user_context):
        """Handle appointment booking requests"""
        # Extract relevant information from message
        details = self._extract_appointment_details(message)
        
        if not details.get('department'):
            return "Which department would you like to schedule an appointment with?"
        
        if not details.get('preferred_date'):
            return "When would you like to schedule the appointment?"
        
        return f"I'll help you book an appointment with {details['department']} department on {details['preferred_date']}. Please confirm these details."
    
    def _handle_wait_time_check(self, user_context):
        """Handle wait time inquiries"""
        # In a real implementation, this would fetch actual wait times
        return "Current estimated wait time is