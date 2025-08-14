// src/app/page.tsx - Healthcare Dashboard with CORRECT column names
'use client';
import { Heart, Users, Calendar, Activity, TrendingUp, Bell, Settings, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HealthcareDB } from '@/lib/supabase';

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  activeAutomations: number;
  diabetesPatients: number;
}

interface RecentActivity {
  time: string;
  action: string;
  patient: string;
}

interface AutomationStatus {
  name: string;
  status: string;
  next: string;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    activeAutomations: 0,
    diabetesPatients: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from Supabase using CORRECT column names
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Get patient statistics using corrected functions
        const patientStats = await HealthcareDB.getPatientStats();
        
        // Get active automations count
        const activeAutomations = await HealthcareDB.getActiveAutomations();
        
        // Get today's appointments
        const todayAppointments = await HealthcareDB.getTodayAppointments();
        
        // Get recent activities (using actual patient data)
        const recentActivity = await HealthcareDB.getRecentActivity();

        // Update stats with real data
        setStats({
          totalPatients: patientStats.totalPatients,
          todayAppointments: todayAppointments.length,
          activeAutomations: activeAutomations.length,
          diabetesPatients: patientStats.diabetesPatients
        });

        // Set recent activities from real patient registrations
        setRecentActivities(recentActivity.length > 0 ? recentActivity : [
          { 
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
            action: "System connected", 
            patient: "Database live" 
          },
          { 
            time: new Date(Date.now() - 15*60*1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
            action: `${patientStats.totalPatients} patients`, 
            patient: "in database" 
          },
          { 
            time: new Date(Date.now() - 30*60*1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
            action: "Diabetes tracking", 
            patient: `${patientStats.diabetesPatients} patients` 
          },
          { 
            time: new Date(Date.now() - 45*60*1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
            action: "System status", 
            patient: "All systems operational" 
          },
        ]);

        // Set automation status based on real data
        const automations: AutomationStatus[] = [
          { 
            name: "Patient Database", 
            status: patientStats.totalPatients > 0 ? "Active" : "Empty", 
            next: `${patientStats.totalPatients} records`, 
            color: patientStats.totalPatients > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800" 
          },
          { 
            name: "Diabetes Tracking", 
            status: patientStats.diabetesPatients > 0 ? "Active" : "No Patients", 
            next: `${patientStats.diabetesPatients} patients`, 
            color: patientStats.diabetesPatients > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800" 
          },
          { 
            name: "Automation Campaigns", 
            status: activeAutomations.length > 0 ? "Active" : "Inactive", 
            next: `${activeAutomations.length} running`, 
            color: activeAutomations.length > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" 
          },
          { 
            name: "Appointments Today", 
            status: todayAppointments.length > 0 ? "Scheduled" : "None", 
            next: `${todayAppointments.length} today`, 
            color: todayAppointments.length > 0 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800" 
          },
        ];
        setAutomationStatus(automations);

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Dashboard</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      title: "Total Patients",
      value: stats.totalPatients.toLocaleString(),
      change: "Live Database",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments.toString(),
      change: "Real-time",
      icon: Calendar,
      color: "bg-green-500"
    },
    {
      title: "Active Automations",
      value: stats.activeAutomations.toString(),
      change: "Live Status",
      icon: Activity,
      color: "bg-purple-500"
    },
    {
      title: "Diabetes Patients",
      value: stats.diabetesPatients.toString(),
      change: "From Medical History",
      icon: Heart,
      color: "bg-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🏥 Homa Health Care
            </h1>
            <p className="text-gray-600">Healthcare Automation Dashboard - Real Patient Data</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <button className="p-2 rounded-lg bg-white shadow-sm border hover:bg-gray-50">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-white shadow-sm border hover:bg-gray-50">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">H</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.patient}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {automationStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.next}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => alert('Add Patient: Integration with patient form needed')}
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Patient</span>
          </button>
          <button 
            onClick={() => alert('Schedule: Integration with appointments table needed')}
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <Calendar className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Schedule</span>
          </button>
          <button 
            onClick={() => alert('Messaging: Integration with automation campaigns needed')}
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <MessageSquare className="h-8 w-8 text-purple-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Send Message</span>
          </button>
          <button 
            onClick={() => alert(`Analytics: ${stats.totalPatients} patients, ${stats.diabetesPatients} with diabetes`)}
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            <TrendingUp className="h-8 w-8 text-orange-500 mb-2" />
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}