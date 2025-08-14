// src/app/appointments/page.tsx - Appointment Scheduling System
'use client';
import { useState, useEffect } from 'react';
import { HealthcareDB } from '@/lib/supabase';
import { 
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye
} from 'lucide-react';

interface Appointment {
  id: string;
  patient_id: string;
  doctor_name?: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

interface Patient {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export default function AppointmentScheduling() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    patient_id: '',
    doctor_name: 'Dr. Smith',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '09:00',
    appointment_type: 'Consultation',
    notes: ''
  });

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [appointmentsData, patientsData] = await Promise.all([
          HealthcareDB.getTodayAppointments(),
          HealthcareDB.getPatients()
        ]);
        
        // Mock appointments for demo (replace with real data)
        const mockAppointments: Appointment[] = [
          {
            id: '1',
            patient_id: 'P000001',
            doctor_name: 'Dr. Smith',
            appointment_date: new Date().toISOString().split('T')[0],
            appointment_time: '09:00',
            appointment_type: 'Consultation',
            status: 'scheduled',
            notes: 'Regular diabetes checkup',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            patient_id: 'P000002',
            doctor_name: 'Dr. Johnson',
            appointment_date: new Date().toISOString().split('T')[0],
            appointment_time: '10:30',
            appointment_type: 'Follow-up',
            status: 'confirmed',
            notes: 'Blood pressure monitoring',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            patient_id: 'P000003',
            doctor_name: 'Dr. Smith',
            appointment_date: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
            appointment_time: '14:00',
            appointment_type: 'Initial Consultation',
            status: 'scheduled',
            notes: 'New patient intake',
            created_at: new Date().toISOString()
          }
        ];

        setAppointments(mockAppointments);
        setPatients(patientsData || []);
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Get patient info
  const getPatientInfo = (patientId: string) => {
    return patients.find(p => p.patient_id === patientId);
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const patient = getPatientInfo(appointment.patient_id);
    const matchesSearch = patient ? 
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointment_type.toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];
    const matchesDate = filterDate === 'all' || 
      (filterDate === 'today' && appointment.appointment_date === today) ||
      (filterDate === 'tomorrow' && appointment.appointment_date === tomorrow) ||
      (filterDate === 'week' && new Date(appointment.appointment_date) <= new Date(Date.now() + 7*24*60*60*1000));

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Status icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Handle form submission
  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to database
    const appointment: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      status: 'scheduled',
      created_at: new Date().toISOString()
    };
    
    setAppointments([...appointments, appointment]);
    setShowAddForm(false);
    setNewAppointment({
      patient_id: '',
      doctor_name: 'Dr. Smith',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '09:00',
      appointment_type: 'Consultation',
      notes: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading appointments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📅 Appointment Scheduling
            </h1>
            <p className="text-gray-600">Manage patient appointments and schedules</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.appointment_date === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {appointments.filter(a => a.status === 'scheduled').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by patient name, doctor, or appointment type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Appointments ({filteredAppointments.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredAppointments.map((appointment) => {
            const patient = getPatientInfo(appointment.patient_id);
            return (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Time */}
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {appointment.appointment_time}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(appointment.status)}
                            <span className="capitalize">{appointment.status}</span>
                          </div>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{appointment.doctor_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.appointment_type}</span>
                        </div>
                        {patient?.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{patient.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">Try adjusting your search or filters, or schedule a new appointment</p>
          </div>
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Schedule New Appointment</h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                  <select
                    value={newAppointment.patient_id}
                    onChange={(e) => setNewAppointment({...newAppointment, patient_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.patient_id}>
                        {patient.first_name} {patient.last_name} ({patient.patient_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <select
                    value={newAppointment.doctor_name}
                    onChange={(e) => setNewAppointment({...newAppointment, doctor_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Dr. Smith">Dr. Smith</option>
                    <option value="Dr. Johnson">Dr. Johnson</option>
                    <option value="Dr. Williams">Dr. Williams</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newAppointment.appointment_date}
                      onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={newAppointment.appointment_time}
                      onChange={(e) => setNewAppointment({...newAppointment, appointment_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                  <select
                    value={newAppointment.appointment_type}
                    onChange={(e) => setNewAppointment({...newAppointment, appointment_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Initial Consultation">Initial Consultation</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Checkup">Checkup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Additional notes for the appointment..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Schedule Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}