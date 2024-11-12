import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    waitingPatients: 0,
    availableBeds: 0,
    todayAppointments: 0
  });
  const [waitTimeData, setWaitTimeData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchWaitTimeData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchWaitTimeData = async () => {
    try {
      const response = await fetch('/api/dashboard/wait-times');
      const data = await response.json();
      setWaitTimeData(data);
    } catch (error) {
      console.error('Error fetching wait time data:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hospital Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Waiting Patients</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.waitingPatients}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Available Beds</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.availableBeds}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Today's Appointments</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.todayAppointments}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Wait Time Trends</h2>
        </CardHeader>
        <CardContent>
          <LineChart width={800} height={300} data={waitTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="waitTime" 
              stroke="#8884d8" 
              name="Wait Time (minutes)" 
            />
          </LineChart>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;