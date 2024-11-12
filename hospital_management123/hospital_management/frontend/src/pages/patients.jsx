import React, { useState, useEffect } from 'react';
import { fetchPatients, addPatient } from '../services/api';

const PatientForm = ({ onSubmit, onClose }) => {
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    gender: '',
    contact: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(patient);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Patient Name"
        className="w-full p-2 border rounded"
        value={patient.name}
        onChange={(e) => setPatient({ ...patient, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Age"
        className="w-full p-2 border rounded"
        value={patient.age}
        onChange={(e) => setPatient({ ...patient, age: e.target.value })}
      />
      <select
        className="w-full p-2 border rounded"
        value={patient.gender}
        onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input
        type="tel"
        placeholder="Contact Number"
        className="w-full p-2 border rounded"
        value={patient.contact}
        onChange={(e) => setPatient({ ...patient, contact: e.target.value })}
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Add Patient
      </button>
    </form>
  );
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    }
  };

  const handleAddPatient = async (patientData) => {
    try {
      await addPatient(patientData);
      loadPatients();
    } catch (error) {
      console.error('Failed to add patient:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Patient
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <PatientForm
              onSubmit={handleAddPatient}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Age</th>
              <th className="px-6 py-3 text-left">Gender</th>
              <th className="px-6 py-3 text-left">Contact</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-t">
                <td className="px-6 py-4">{patient.name}</td>
                <td className="px-6 py-4">{patient.age}</td>
                <td className="px-6 py-4">{patient.gender}</td>
                <td className="px-6 py-4">{patient.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;