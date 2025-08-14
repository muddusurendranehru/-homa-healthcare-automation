// app/api/send-custom-message/route.ts
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const botToken = '8214864800:AAEtYsHUOv07OkQcP-szHCN-gY8yeVkTPGQ';
    const chatId = '5892544777';
    
    // Generate custom message based on type
    let message = '';
    
    if (data.messageType === 'appointment') {
      message = `🏥 ${data.clinicName || 'Dr. Sharma Clinic'}

📅 APPOINTMENT REMINDER

👤 Dear ${data.patientName},

🕐 ${data.appointmentDate} at ${data.appointmentTime}
👨‍⚕️ Doctor: ${data.doctorName}
📍 Please arrive 15 minutes early
💳 Bring ID and insurance cards

📞 Contact: +91 99637 21999

Your healthcare team`;
    } else if (data.messageType === 'prescription') {
      message = `💊 MEDICATION REMINDER

👤 Dear ${data.patientName},

⏰ Time to take your medication:
💊 ${data.medicationName}

📋 Take as prescribed
📞 Call if side effects: +91 99637 21999

🏥 ${data.clinicName || 'Healthcare Team'}`;
    } else if (data.messageType === 'emergency') {
      message = `🚨 URGENT MEDICAL ALERT

👤 Dear ${data.patientName},

⚡ ${data.emergencyDetails}

📞 CALL NOW: +91 99637 21999
🏥 Visit clinic immediately

Emergency Team`;
    } else {
      message = `🏥 ${data.clinicName || 'Healthcare Clinic'}

👤 Dear ${data.patientName},

${data.customMessage || 'Healthcare notification'}

📞 Contact: +91 99637 21999`;
    }

    // Send to Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    
    if (result.ok) {
      return Response.json({
        success: true,
        message: `✅ ${data.messageType} sent to ${data.patientName}!`,
        messageType: data.messageType,
        patient: data.patientName
      });
    } else {
      return Response.json({
        success: false,
        error: result.description
      }, { status: 400 });
    }

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: '🏥 Custom Healthcare Messaging API',
    status: 'Working',
    examples: {
      appointment: {
        messageType: 'appointment',
        patientName: 'Rajesh Kumar',
        clinicName: 'Dr. Sharma Clinic',
        appointmentDate: 'Tomorrow',
        appointmentTime: '10:00 AM',
        doctorName: 'Dr. Rakesh Sharma'
      }
    }
  });
}