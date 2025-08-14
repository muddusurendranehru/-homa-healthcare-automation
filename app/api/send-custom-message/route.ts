// app/api/send-custom-message/route.ts
// CUSTOM HEALTHCARE MESSAGING SYSTEM WITH SUPABASE
// Send different types of healthcare messages dynamically

import { createClient } from '@supabase/supabase-js';

// Supabase configuration (your existing credentials)
const supabaseUrl = 'https://oztndjdowoewkbeznjvd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dG5kamRvd29ld2tiZXpuanZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODkyMzksImV4cCI6MjA3MDY2NTIzOX0.yr6CC6zdXFzGOmwHARJwWlSaAmwOWH1VnvcODtdNwAc';
const supabase = createClient(supabaseUrl, supabaseKey);

interface MessageRequest {
  messageType: 'appointment' | 'prescription' | 'lab_results' | 'emergency' | 'follow_up' | 'custom';
  patientName: string;
  clinicName?: string;
  customMessage?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  medicationName?: string;
  labTestType?: string;
  doctorName?: string;
  emergencyDetails?: string;
  chatId?: string;
}

export async function POST(request: Request) {
  try {
    const data: MessageRequest = await request.json();
    
    // Telegram bot configuration
    const botToken = '8214864800:AAEtYsHUOv07OkQcP-szHCN-gY8yeVkTPGQ';
    const defaultChatId = '5892544777'; // Your chat ID
    const targetChatId = data.chatId || defaultChatId;
    
    // Generate message based on type
    const message = generateHealthcareMessage(data);
    
    // Send via Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const telegramResult = await telegramResponse.json();

    if (telegramResult.ok) {
      // Log to Supabase for tracking
      await logMessageToSupabase(data, message, 'telegram', 'sent');
      
      return Response.json({
        success: true,
        message: `✅ ${data.messageType} message sent successfully!`,
        patientName: data.patientName,
        messageType: data.messageType,
        sentVia: 'telegram',
        messageId: telegramResult.result.message_id,
        timestamp: new Date().toISOString()
      });
    } else {
      await logMessageToSupabase(data, message, 'telegram', 'failed');
      
      return Response.json({
        success: false,
        error: telegramResult.description,
        messageType: data.messageType,
        patientName: data.patientName
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('❌ Custom message error:', error);
    
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Generate healthcare messages based on type
function generateHealthcareMessage(data: MessageRequest): string {
  const clinicName = data.clinicName || 'Homa Healthcare';
  const doctorName = data.doctorName || 'Dr. Muddu Surendra Nehru';
  const currentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  switch (data.messageType) {
    case 'appointment':
      return `🏥 <b>${clinicName}</b>

📅 <b>APPOINTMENT REMINDER</b>

👤 Dear <b>${data.patientName}</b>,

🕐 <b>Date & Time:</b> ${data.appointmentDate} at ${data.appointmentTime}
👨‍⚕️ <b>Doctor:</b> ${doctorName}
📍 Please arrive 15 minutes early
💳 Bring ID and insurance cards

❓ <b>Need to reschedule?</b>
📞 Call: +91 99637 21999

<i>Automated reminder from ${clinicName}</i>
⏰ Sent: ${currentTime}`;

    case 'prescription':
      return `💊 <b>MEDICATION REMINDER</b>

👤 Dear <b>${data.patientName}</b>,

⏰ <b>Time to take your medication:</b>
💊 <b>${data.medicationName}</b>

📋 <b>Important Instructions:</b>
• Take as prescribed by ${doctorName}
• Do not skip doses
• Take with food if advised

📞 <b>Side effects or concerns?</b>
Call immediately: +91 99637 21999

🏥 <i>${clinicName} - Your Health Partner</i>
⏰ Sent: ${currentTime}`;

    case 'lab_results':
      return `📊 <b>LAB RESULTS READY</b>

👤 Dear <b>${data.patientName}</b>,

✅ Your <b>${data.labTestType}</b> results are ready

🏥 <b>Collection Details:</b>
📍 Reception desk at ${clinicName}
🕐 Timing: 9:00 AM - 6:00 PM
💳 Please bring ID proof

👨‍⚕️ <b>Doctor consultation available</b>
Schedule appointment with ${doctorName}

📞 <b>Questions?</b> Call: +91 99637 21999

🏥 <i>${clinicName}</i>
⏰ Sent: ${currentTime}`;

    case 'emergency':
      return `🚨 <b>URGENT MEDICAL ALERT</b>

👤 Dear <b>${data.patientName}</b>,

⚡ <b>IMMEDIATE ATTENTION REQUIRED</b>

📋 <b>Details:</b> ${data.emergencyDetails}

📞 <b>CALL NOW:</b> +91 99637 21999
🏥 <b>Or visit clinic immediately</b>
🚑 <b>Emergency services:</b> Dial 108

⏰ <b>This is a time-sensitive medical matter</b>

🏥 <i>${clinicName} Emergency Team</i>
👨‍⚕️ ${doctorName}
⏰ Sent: ${currentTime}`;

    case 'follow_up':
      return `💚 <b>FOLLOW-UP CARE</b>

👤 Dear <b>${data.patientName}</b>,

🩺 Hope you're feeling better after your visit with ${doctorName}!

📋 <b>Please remember:</b>
💊 Take medications as prescribed
🚰 Stay well hydrated
😴 Get adequate rest
🚶 Light exercise as advised

📞 <b>Any concerns or side effects?</b>
Call us: +91 99637 21999

📅 <b>Next appointment:</b> As scheduled
👨‍⚕️ With ${doctorName}

🏥 <i>${clinicName} - Always Caring</i>
⏰ Sent: ${currentTime}`;

    case 'custom':
      return `🏥 <b>${clinicName}</b>

👤 Dear <b>${data.patientName}</b>,

${data.customMessage}

📞 <b>Contact us:</b> +91 99637 21999
👨‍⚕️ <b>Doctor:</b> ${doctorName}

🏥 <i>${clinicName}</i>
⏰ Sent: ${currentTime}`;

    default:
      return `🏥 <b>${clinicName}</b>

👤 Dear <b>${data.patientName}</b>,

📋 Healthcare notification from your medical team.

📞 Contact: +91 99637 21999
👨‍⚕️ ${doctorName}

🏥 <i>${clinicName}</i>
⏰ ${currentTime}`;
  }
}

// Log messages to Supabase for tracking
async function logMessageToSupabase(data: MessageRequest, message: string, channel: string, status: string) {
  try {
    const { error } = await supabase
      .from('message_logs')
      .insert({
        patient_name: data.patientName,
        clinic_name: data.clinicName || 'Homa Healthcare',
        message_type: data.messageType,
        message_content: message,
        channel: channel,
        status: status,
        chat_id: data.chatId,
        sent_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase logging error:', error);
    }
  } catch (error) {
    console.error('Failed to log to Supabase:', error);
  }
}

// GET endpoint for testing and templates
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  // Quick test examples
  const examples = {
    appointment: {
      messageType: 'appointment',
      patientName: 'Rajesh Kumar',
      clinicName: 'Dr. Sharma Clinic',
      appointmentDate: 'Tomorrow',
      appointmentTime: '10:00 AM',
      doctorName: 'Dr. Rakesh Sharma'
    },
    prescription: {
      messageType: 'prescription',
      patientName: 'Priya Sharma',
      clinicName: 'Dr. Sharma Clinic',
      medicationName: 'Metformin 500mg - After breakfast',
      doctorName: 'Dr. Rakesh Sharma'
    },
    lab_results: {
      messageType: 'lab_results',
      patientName: 'Amit Patel',
      clinicName: 'Dr. Sharma Clinic',
      labTestType: 'Blood Sugar Test',
      doctorName: 'Dr. Rakesh Sharma'
    },
    emergency: {
      messageType: 'emergency',
      patientName: 'Sunita Devi',
      clinicName: 'Dr. Sharma Clinic',
      emergencyDetails: 'Blood pressure readings require immediate attention',
      doctorName: 'Dr. Rakesh Sharma'
    }
  };

  if (type && examples[type as keyof typeof examples]) {
    return Response.json({
      message: 'Example message data',
      example: examples[type as keyof typeof examples],
      usage: `POST to /api/send-custom-message with this data`
    });
  }

  return Response.json({
    message: '🏥 Custom Healthcare Messaging API',
    owner: 'Dr. Muddu Surendra Nehru',
    system: 'Homa Healthcare Automation',
    capabilities: [
      'appointment reminders',
      'prescription alerts',
      'lab result notifications',
      'emergency alerts',
      'follow-up care messages',
      'custom messages'
    ],
    usage: {
      endpoint: 'POST /api/send-custom-message',
      examples: Object.keys(examples),
      supabase: 'Connected for message logging',
      telegram: 'Active bot integration'
    },
    revenue: '₹1,80,000/month automation system'
  });
}

// Create Supabase table for message logging (run once)
export async function createMessageLogTable() {
  const { error } = await supabase.rpc('create_message_logs_table', {
    sql: `
    CREATE TABLE IF NOT EXISTS message_logs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      patient_name TEXT NOT NULL,
      clinic_name TEXT NOT NULL,
      message_type TEXT NOT NULL,
      message_content TEXT NOT NULL,
      channel TEXT NOT NULL,
      status TEXT NOT NULL,
      chat_id TEXT,
      sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    `
  });

  return { error };
}