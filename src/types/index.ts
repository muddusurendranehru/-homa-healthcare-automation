// src/types/index.ts - Healthcare System Type Definitions (EXACT COLUMN NAMES)

// User & Authentication Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist';
  department?: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Patient Management Types
export interface Patient {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
  emergency_contact?: EmergencyContact;
  medical_history?: MedicalHistory;
  insurance_info?: InsuranceInfo;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  email?: string;
}

export interface MedicalHistory {
  conditions: string[];
  allergies: string[];
  medications: Medication[];
  surgeries: Surgery[];
  family_history: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  prescribing_doctor: string;
}

export interface Surgery {
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  notes?: string;
}

export interface InsuranceInfo {
  provider: string;
  policy_number: string;
  group_number: string;
  effective_date: string;
  expiry_date?: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  duration_minutes: number;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  symptoms?: string[];
  diagnosis?: Diagnosis;
  treatment_plan?: TreatmentPlan;
  follow_up_required: boolean;
  follow_up_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  patient?: Pick<Patient, 'first_name' | 'last_name' | 'patient_id'>;
  doctor?: Pick<Profile, 'full_name' | 'role'>;
}

export type AppointmentType = 
  | 'consultation' 
  | 'follow-up' 
  | 'emergency' 
  | 'procedure' 
  | 'vaccination' 
  | 'checkup';

export type AppointmentStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export interface Diagnosis {
  primary: string;
  secondary?: string[];
  icd_codes?: string[];
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface TreatmentPlan {
  medications: Medication[];
  procedures: string[];
  lifestyle_changes: string[];
  follow_up_schedule: string;
  specialist_referrals?: SpecialistReferral[];
}

export interface SpecialistReferral {
  specialist_type: string;
  doctor_name?: string;
  urgency: 'routine' | 'urgent' | 'stat';
  reason: string;
}

// Automation & Marketing Types
export interface AutomationCampaign {
  id: string;
  name: string;
  type: AutomationType;
  status: AutomationStatus;
  target_audience?: TargetAudience;
  content_template?: ContentTemplate;
  schedule_config?: ScheduleConfig;
  performance_metrics?: PerformanceMetrics;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type AutomationType = 'instagram' | 'facebook' | 'whatsapp' | 'email' | 'sms';
export type AutomationStatus = 'active' | 'paused' | 'completed' | 'draft';

export interface TargetAudience {
  age_range?: [number, number];
  gender?: 'male' | 'female' | 'all';
  conditions?: string[];
  last_visit_days?: number;
  appointment_type?: AppointmentType[];
}

export interface ContentTemplate {
  subject?: string;
  message: string;
  images?: string[];
  hashtags?: string[];
  call_to_action?: string;
  personalization_fields?: string[];
}

export interface ScheduleConfig {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  send_time: string; // HH:MM format
  days_of_week?: number[]; // 0-6, Sunday = 0
  start_date: string;
  end_date?: string;
  timezone: string;
}

export interface PerformanceMetrics {
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  response_count: number;
  conversion_count: number;
  last_updated: string;
}

// Automation Log Types
export interface AutomationLog {
  id: string;
  campaign_id?: string;
  patient_id?: string;
  message_type: string;
  message_content?: any;
  sent_at?: string;
  delivery_status: DeliveryStatus;
  response_data?: any;
  created_at: string;
}

export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read';

// Analytics & Dashboard Types
export interface DashboardMetric {
  id: string;
  metric_name: string;
  metric_value?: number;
  metric_date: string;
  department?: string;
  additional_data?: any;
  created_at: string;
}

export interface DashboardStats {
  total_patients: number;
  todays_appointments: number;
  active_automations: number;
  patient_satisfaction: number;
  monthly_revenue?: number;
  new_patients_this_month?: number;
}

export interface RecentActivity {
  id: string;
  time: string;
  action: string;
  patient?: string;
  user?: string;
  type: 'patient' | 'appointment' | 'automation' | 'system';
}

// Form & UI Types
export interface PatientFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Partial<Address>;
  emergency_contact?: Partial<EmergencyContact>;
  insurance_info?: Partial<InsuranceInfo>;
}

export interface AppointmentFormData {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  appointment_type: AppointmentType;
  notes?: string;
}

export interface CampaignFormData {
  name: string;
  type: AutomationType;
  target_audience: Partial<TargetAudience>;
  content_template: Partial<ContentTemplate>;
  schedule_config: Partial<ScheduleConfig>;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Social Media Integration Types
export interface SocialMediaPost {
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  content: string;
  images?: string[];
  hashtags?: string[];
  scheduled_time?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
}

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'media';
  content: string;
  template_name?: string;
  media_url?: string;
  delivery_status: DeliveryStatus;
}

// AI & Content Generation Types
export interface AIContentRequest {
  type: 'instagram' | 'facebook' | 'whatsapp' | 'email' | 'newsletter';
  topic: string;
  target_audience?: string;
  tone?: 'professional' | 'friendly' | 'educational' | 'urgent';
  length?: 'short' | 'medium' | 'long';
  include_hashtags?: boolean;
  include_cta?: boolean;
}

export interface AIContentResponse {
  content: string;
  hashtags?: string[];
  call_to_action?: string;
  success: boolean;
  error?: string;
}

// System Configuration Types
export interface SystemConfig {
  hospital_name: string;
  hospital_id: string;
  timezone: string;
  business_hours: BusinessHours;
  contact_info: ContactInfo;
  emergency_contacts: EmergencyContact[];
  social_media_accounts: SocialMediaAccounts;
}

export interface BusinessHours {
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
}

export interface TimeSlot {
  open: string; // HH:MM
  close: string; // HH:MM
  is_closed: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: Address;
  website?: string;
}

export interface SocialMediaAccounts {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Export all types as a namespace
export namespace Healthcare {
  export type User = Profile;
  export type PatientRecord = Patient;
  export type AppointmentRecord = Appointment;
  export type Campaign = AutomationCampaign;
  export type Metric = DashboardMetric;
  export type Activity = RecentActivity;
  export type Config = SystemConfig;
}