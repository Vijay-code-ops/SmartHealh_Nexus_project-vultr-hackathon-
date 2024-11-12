import React, { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../services/api';

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="text-xl font-bold">{title}</div>
      <div className="ml-auto text-blue-500">{icon}</div>
    </div>
    <div className="text-3xl font-bold mt-2">{value}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAppointments: 0,
    availableBeds: 0,
    activeDoctors: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="👥"
        />
        <DashboardCard
          title="Active Appointments"
          value={stats.activeAppointments}
          icon="📅"
        />
        <DashboardCard
          title="Available Beds"
          value={stats.availableBeds}
          icon="🛏️"
        />
        <DashboardCard
          title="Active Doctors"
          value={stats.activeDoctors}
          icon="👨‍⚕️"
        />
      </div>
    </div>
  );
};

export default Dashboard;