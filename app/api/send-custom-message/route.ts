// app/api/send-custom-message/route.ts
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const botToken = '8214864800:AAEtYsHUOv07OkQcP-szHCN-gY8yeVkTPGQ';
    const chatId = '5892544777';
    
    let message = '';
    
    if (data.messageType === 'appointment') {
      message = `🏥 ${data.clinicName || 'Dr. Sharma Clinic'}

📅 APPOINTMENT REMINDER

👤 Dear ${data.patientName},

🕐 ${data.appointmentDate} at ${data.appointmentTime}
👨‍⚕️ Doctor: ${data.doctorName}
📍 Please arrive 15 minutes early

📞 Contact: +91 99637 21999`;
    } else if (data.messageType === 'prescription') {
      message = `💊 MEDICATION REMINDER

👤 Dear ${data.patientName},

⏰ Time to take: ${data.medicationName}
📋 Take as prescribed
📞 Call: +91 99637 21999`;
    } else {
      message = `🏥 Healthcare Notification

👤 Dear ${data.patientName},
${data.customMessage || 'Healthcare update'}
📞 +91 99637 21999`;
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    const result = await response.json();
    
    return Response.json({
      success: result.ok,
      message: result.ok ? `✅ ${data.messageType} sent to ${data.patientName}` : result.description,
      patient: data.patientName
    });

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: '🏥 Custom Healthcare Messaging API - WORKING!',
    status: 'Active',
    owner: 'Dr. Muddu Surendra Nehru'
  });
}
