// frontend/src/components/HospitalManagement.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';

const HospitalManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [beds, setBeds] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const fetchHospitalData = async () => {
    try {
      const [deptRes, doctorRes, bedRes] = await Promise.all([
        fetch('/api/departments'),
        fetch('/api/doctors'),
        fetch('/api/beds')
      ]);

      setDepartments(await deptRes.json());
      setDoctors(await doctorRes.json());
      setBeds(await bedRes.json());
    } catch (error) {
      console.error('Error fetching hospital data:', error);
    }
  };

  const DepartmentSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-bold">Departments</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Head Doctor</TableHead>
              <TableHead>Staff Count</TableHead>
              <TableHead>Current Patients</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map(dept => (
              <TableRow key={dept.id}>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.headDoctor}</TableCell>
                <TableCell>{dept.staffCount}</TableCell>
                <TableCell>{dept.currentPatients}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => setSelectedDepartment(dept)}
                    className="mr-2"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const DoctorSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-bold">Doctors</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Patients</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map(doctor => (
              <TableRow key={doctor.id}>
                <TableCell>{`${doctor.firstName} ${doctor.lastName}`}</TableCell>
                <TableCell>{doctor.department}</TableCell>
                <TableCell>{doctor.status}</TableCell>
                <TableCell>{doctor.currentPatients}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDoctorSchedule(doctor.id)}
                    className="mr-2"
                  >
                    View Schedule
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const BedManagementSection = () => (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Bed Management</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ward</TableHead>
              <TableHead>Total Beds</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Occupied</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {beds.map(ward => (
              <TableRow key={ward.id}>
                <TableCell>{ward.name}</TableCell>
                <TableCell>{ward.totalBeds}</TableCell>
                <TableCell>{ward.availableBeds}</TableCell>
                <TableCell>{ward.occupiedBeds}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleBedAllocation(ward.id)}
                    className="mr-2"
                  >
                    Manage Beds
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hospital Management</h1>
      <DepartmentSection />
      <DoctorSection />
      <BedManagementSection />
    </div>
  );
};

export default HospitalManagement;