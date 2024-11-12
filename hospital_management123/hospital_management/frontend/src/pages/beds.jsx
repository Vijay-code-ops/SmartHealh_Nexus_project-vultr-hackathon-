import React, { useState, useEffect } from 'react';
import { BadgePlus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Beds = () => {
  const [beds, setBeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  
  const [formData, setFormData] = useState({
    bedNumber: '',
    ward: '',
    status: 'available',
    notes: ''
  });

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API call
      const response = await fetch('/api/beds');
      const data = await response.json();
      setBeds(data);
    } catch (err) {
      setError('Failed to fetch beds data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedBed ? `/api/beds/${selectedBed.id}` : '/api/beds';
      const method = selectedBed ? 'PUT' : 'POST';
      
      // Replace with your actual API call
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      await fetchBeds();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save bed data');
    }
  };

  const handleDelete = async (bedId) => {
    if (window.confirm('Are you sure you want to delete this bed?')) {
      try {
        // Replace with your actual API call
        await fetch(`/api/beds/${bedId}`, { method: 'DELETE' });
        await fetchBeds();
      } catch (err) {
        setError('Failed to delete bed');
      }
    }
  };

  const handleEdit = (bed) => {
    setSelectedBed(bed);
    setFormData({
      bedNumber: bed.bedNumber,
      ward: bed.ward,
      status: bed.status,
      notes: bed.notes
    });
    setShowAddDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setSelectedBed(null);
    setFormData({
      bedNumber: '',
      ward: '',
      status: 'available',
      notes: ''
    });
  };

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bed Management</h1>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <BadgePlus className="h-4 w-4" />
          Add New Bed
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beds.map((bed) => (
          <Card key={bed.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bed #{bed.bedNumber}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(bed)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(bed.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm">Ward: {bed.ward}</p>
                <p className="text-sm">
                  Status: 
                  <span className={`ml-1 ${
                    bed.status === 'available' ? 'text-green-600' :
                    bed.status === 'occupied' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {bed.status}
                  </span>
                </p>
                {bed.notes && <p className="text-sm text-gray-500">{bed.notes}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBed ? 'Edit Bed' : 'Add New Bed'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bedNumber">Bed Number</Label>
                <Input
                  id="bedNumber"
                  name="bedNumber"
                  value={formData.bedNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ward">Ward</Label>
                <Input
                  id="ward"
                  name="ward"
                  value={formData.ward}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit">
                <Check className="h-4 w-4 mr-2" />
                {selectedBed ? 'Update' : 'Add'} Bed
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Beds;