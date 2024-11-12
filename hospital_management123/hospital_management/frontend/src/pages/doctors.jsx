import React, { useState, useEffect } from 'react';
import { fetchDoctors, addDoctor, updateDoctor, fetchDoctorSchedule } from '../services/api';

const DoctorForm = ({ onSubmit, onClose, initialData = null }) => {
  const [doctor, setDoctor] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    availableDays: [],
    timeSlots: [],
    ...initialData
  });

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'General Medicine',
    'Gynecology',
    'ENT',
    'Ophthalmology'
  ];

  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const timeSlots = [
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayToggle = (day) => {
    setDoctor(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleTimeSlotToggle = (slot) => {
    setDoctor(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(slot)
        ? prev.timeSlots.filter(s => s !== slot)
        : [...prev.timeSlots, slot]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(doctor);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {initialData ? 'Edit Doctor' : 'Add New Doctor'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={doctor.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={doctor.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={doctor.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <select
                name="specialization"
                value={doctor.specialization}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={doctor.qualification}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                value={doctor.experience}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Days
            </label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    doctor.availableDays.includes(day)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Slots
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleTimeSlotToggle(slot)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    doctor.timeSlots.includes(slot)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor, onEdit }) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedule, setSchedule] = useState(null);

  const loadSchedule = async () => {
    try {
      const data = await fetchDoctorSchedule(doctor.id);
      setSchedule(data);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    }
  };

  useEffect(() => {
    if (showSchedule) {
      loadSchedule();
    }
  }, [showSchedule]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">Dr. {doctor.name}</h3>
          <p className="text-blue-600">{doctor.specialization}</p>
        </div>
        <button
          onClick={() => onEdit(doctor)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✏️
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Qualification:</span> {doctor.qualification}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Experience:</span> {doctor.experience} years
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Email:</span> {doctor.email}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Phone:</span> {doctor.phone}
        </p>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {showSchedule ? 'Hide Schedule' : 'View Schedule'}
        </button>

        {showSchedule && schedule && (
          <div className="mt-3 border-t pt-3">
            <h4 className="font-medium mb-2">Available Days:</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {doctor.availableDays.map(day => (
                <span
                  key={day}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {day}
                </span>
              ))}
            </div>
            
            <h4 className="font-medium mb-2">Time Slots:</h4>
            <div className="grid grid-cols-2 gap-2">
              {doctor.timeSlots.map(slot => (
                <span
                  key={slot}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (doctorData) => {
    try {
      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, doctorData);
      } else {
        await addDoctor(doctorData);
      }
      await loadDoctors();
      setShowForm(false);
      setEditingDoctor(null);
    } catch (error) {
      console.error('Failed to save doctor:', error);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !filterSpecialization || doctor.specialization === filterSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const specializations = [...new Set(doctors.map(d => d.specialization))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <button
          onClick={() => {
            setEditingDoctor(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Doctor
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md flex-grow"
        />
        <select
          value={filterSpecialization}
          onChange={(e) => setFilterSpecialization(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Specializations</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No doctors found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {showForm && (
        <DoctorForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingDoctor(null);
          }}
          initialData={editingDoctor}
        />
      )}
    </div>
  );
};

export default Doctors;