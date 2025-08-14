// src/lib/supabase.ts - Fixed Supabase Database Configuration (CORRECT COLUMN NAMES)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Healthcare Database Service Functions - CORRECTED FOR ACTUAL TABLE STRUCTURE
export class HealthcareDB {

  // Patient Management - Using CORRECT column names
  static async getPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        id,
        patient_id,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        address,
        medical_history,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getPatientById(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        id,
        patient_id,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        address,
        emergency_contact,
        medical_history,
        insurance_info,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createPatient(patient: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: object;
    medical_history?: object;
  }) {
    const { data, error } = await supabase
      .from('patients')
      .insert(patient)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Patient Statistics for Dashboard
  static async getPatientStats() {
    const { data, error } = await supabase
      .from('patients')
      .select('id, medical_history, created_at');

    if (error) throw error;

    const totalPatients = data?.length || 0;
    const today = new Date().toISOString().split('T')[0];
    const newToday = data?.filter(p => 
      p.created_at.split('T')[0] === today
    ).length || 0;

    // Count diabetes patients from medical_history JSON
    const diabetesPatients = data?.filter(p => {
      try {
        const history = typeof p.medical_history === 'string' 
          ? JSON.parse(p.medical_history) 
          : p.medical_history;
        return history?.conditions?.some((condition: string) => 
          condition.toLowerCase().includes('diabetes')
        );
      } catch {
        return false;
      }
    }).length || 0;

    return {
      totalPatients,
      newToday,
      diabetesPatients
    };
  }

  // Dashboard Analytics
  static async getDashboardMetrics() {
    const { data, error } = await supabase
      .from('analytics_dashboard')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.warn('Analytics dashboard table might not exist or be empty:', error);
      return null;
    }
    return data?.[0] || null;
  }

  // Automation Campaigns
  static async getAutomationCampaigns() {
    const { data, error } = await supabase
      .from('automation_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Automation campaigns table might not exist:', error);
      return [];
    }
    return data || [];
  }

  static async getActiveAutomations() {
    const { data, error } = await supabase
      .from('automation_campaigns')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.warn('Automation campaigns table might not exist:', error);
      return [];
    }
    return data || [];
  }

  // Appointments
  static async getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', today)
      .lt('appointment_date', new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]);

    if (error) {
      console.warn('Appointments table might not exist:', error);
      return [];
    }
    return data || [];
  }

  // Recent Activity (using patients table for real activity)
  static async getRecentActivity() {
    const { data, error } = await supabase
      .from('patients')
      .select('first_name, last_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return data?.map(patient => ({
      time: new Date(patient.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      action: "Patient registered",
      patient: `${patient.first_name} ${patient.last_name}`
    })) || [];
  }

  // Search patients by name
  static async searchPatients(searchTerm: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('id, patient_id, first_name, last_name, email, phone')
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,patient_id.ilike.%${searchTerm}%`);

    if (error) throw error;
    return data;
  }

  // Get patients with specific medical conditions
  static async getPatientsByCondition(condition: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*');

    if (error) throw error;

    return data?.filter(patient => {
      try {
        const history = typeof patient.medical_history === 'string' 
          ? JSON.parse(patient.medical_history) 
          : patient.medical_history;
        return history?.conditions?.some((c: string) => 
          c.toLowerCase().includes(condition.toLowerCase())
        );
      } catch {
        return false;
      }
    }) || [];
  }
}