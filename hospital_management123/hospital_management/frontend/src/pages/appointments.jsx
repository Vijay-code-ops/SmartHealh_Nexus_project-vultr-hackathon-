import React, { useState, useEffect } from 'react';
import { fetchAppointments, createAppointment, fetchDoctors, fetchPatients } from '../services/api';
import { formatDate, formatTime } from '../utils/helpers';
import { APPOINTMENT_STATUS } from '../utils/constants';

const AppointmentForm = ({ onSubmit, onClose, doctors, patients }) => {
  const [appointment, setAppointment] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'consultation',
    notes: ''
  });

  const handleChange = (e) => {
    setAppointment({
      ...appointment,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointment);
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Schedule New Appointment</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <select
              name="patientId"
              value={appointment.patientId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor
            </label>
            <select
              name="doctorId"
              value={appointment.doctorId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={appointment.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={appointment.time}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={appointment.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="emergency">Emergency</option>
              <option value="routine-checkup">Routine Checkup</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={appointment.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="3"
            placeholder="Additional notes..."
          />
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
            Schedule Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

const AppointmentCard = ({ appointment }) => {
  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">
            Patient: {appointment.patientName}
          </h3>
          <p className="text-gray-600">
            Doctor: Dr. {appointment.doctorName}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <span className="text-gray-500">Date:</span>
          <span className="ml-2">{formatDate(appointment.date)}</span>
        </div>
        <div>
          <span className="text-gray-500">Time:</span>
          <span className="ml-2">{formatTime(appointment.time)}</span>
        </div>
        <div>
          <span className="text-gray-500">Type:</span>
          <span className="ml-2">{appointment.type}</span>
        </div>
      </div>

      {appointment.notes && (
        <div className="mt-3">
          <span className="text-gray-500">Notes:</span>
          <p className="mt-1 text-sm text-gray-600">{appointment.notes}</p>
        </div>
      )}
    </div>
  );
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, doctorsData, patientsData] = await Promise.all([
        fetchAppointments(),
        fetchDoctors(),
        fetchPatients()
      ]);
      setAppointments(appointmentsData);
      setDoctors(doctorsData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (appointmentData) => {
    try {
      await createAppointment(appointmentData);
      await loadData();
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

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
        <h1 className="text-2xl font-bold">Appointments</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Appointment
        </button>
      </div>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">All Appointments</option>
          {Object.values(APPOINTMENT_STATUS).map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No appointments found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <AppointmentForm
            onSubmit={handleCreateAppointment}
            onClose={() => setShowForm(false)}
            doctors={doctors}
            patients={patients}
          />
        </div>
      )}
    </div>
  );
};

export default Appointments;