// src/app/patients/page.tsx - Patient Management Interface
'use client';
import { useState, useEffect } from 'react';
import { HealthcareDB } from '@/lib/supabase';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Calendar,
  Phone,
  Mail,
  Heart,
  AlertTriangle,
  Filter
} from 'lucide-react';

interface Patient {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  medical_history?: any;
  created_at: string;
}

export default function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch patients
  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await HealthcareDB.getPatients();
        setPatients(data || []);
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterCondition === 'all') return matchesSearch;

    if (filterCondition === 'diabetes') {
      try {
        const history = typeof patient.medical_history === 'string' 
          ? JSON.parse(patient.medical_history) 
          : patient.medical_history;
        return matchesSearch && history?.conditions?.some((condition: string) => 
          condition.toLowerCase().includes('diabetes')
        );
      } catch {
        return false;
      }
    }

    return matchesSearch;
  });

  // Get medical conditions
  const getMedicalConditions = (patient: Patient) => {
    try {
      const history = typeof patient.medical_history === 'string' 
        ? JSON.parse(patient.medical_history) 
        : patient.medical_history;
      return history?.conditions || [];
    } catch {
      return [];
    }
  };

  // Get allergies
  const getAllergies = (patient: Patient) => {
    try {
      const history = typeof patient.medical_history === 'string' 
        ? JSON.parse(patient.medical_history) 
        : patient.medical_history;
      return history?.allergies || [];
    } catch {
      return [];
    }
  };

  // Calculate age
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading patients...</span>
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
              👥 Patient Management
            </h1>
            <p className="text-gray-600">Manage and track your patients' health records</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Patient
          </button>
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
                placeholder="Search patients by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Patients</option>
              <option value="diabetes">Diabetes Patients</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredPatients.length} of {patients.length} patients
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const conditions = getMedicalConditions(patient);
          const allergies = getAllergies(patient);
          const hasDiabetes = conditions.some((c: string) => c.toLowerCase().includes('diabetes'));

          return (
            <div key={patient.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              {/* Patient Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {patient.first_name[0]}{patient.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {patient.first_name} {patient.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{patient.patient_id}</p>
                  </div>
                </div>
                {hasDiabetes && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Diabetes
                  </span>
                )}
              </div>

              {/* Patient Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {patient.email}
                </div>
                {patient.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {patient.phone}
                  </div>
                )}
                {patient.date_of_birth && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Age: {calculateAge(patient.date_of_birth)}
                  </div>
                )}
              </div>

              {/* Medical Info */}
              {(conditions.length > 0 || allergies.length > 0) && (
                <div className="mb-4">
                  {conditions.length > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <Heart className="h-4 w-4 mr-1 text-red-500" />
                        Conditions:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {conditions.map((condition: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {allergies.length > 0 && (
                    <div>
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                        Allergies:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {allergies.map((allergy: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedPatient(patient)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500">
            {searchTerm || filterCondition !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first patient'
            }
          </p>
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{selectedPatient.first_name} {selectedPatient.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Patient ID</label>
                      <p className="text-gray-900">{selectedPatient.patient_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedPatient.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">
                        {selectedPatient.date_of_birth 
                          ? `${new Date(selectedPatient.date_of_birth).toLocaleDateString()} (Age: ${calculateAge(selectedPatient.date_of_birth)})`
                          : 'Not provided'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-gray-900 capitalize">{selectedPatient.gender || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Medical History</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Medical Conditions</label>
                      <div className="mt-1">
                        {getMedicalConditions(selectedPatient).length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {getMedicalConditions(selectedPatient).map((condition: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {condition}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No conditions recorded</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Allergies</label>
                      <div className="mt-1">
                        {getAllergies(selectedPatient).length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {getAllergies(selectedPatient).map((allergy: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                {allergy}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No allergies recorded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Patient
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Schedule Appointment
                  </button>
                  <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}