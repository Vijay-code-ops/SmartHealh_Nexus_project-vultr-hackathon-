import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    symptoms: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      // Handle success
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Department</label>
          <Select
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            className="w-full"
          >
            <option value="">Select Department</option>
            <option value="cardiology">Cardiology</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="pediatrics">Pediatrics</option>
          </Select>
        </div>

        <div>
          <label className="block mb-2">Doctor</label>
          <Select
            value={formData.doctor}
            onChange={(e) => setFormData({...formData, doctor: e.target.value})}
            className="w-full"
          >
            <option value="">Select Doctor</option>
          </Select>
        </div>

        <div>
          <label className="block mb-2">Date</label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Time</label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Symptoms</label>
          <textarea
            value={formData.symptoms}
            onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
            className="w-full h-24 p-2 border rounded"
          />
        </div>

        <Button type="submit" className="w-full">
          Book Appointment
        </Button>
      </form>
    </div>
  );
};

export default AppointmentBooking;