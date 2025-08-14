// app/api/group-message/route.ts
export async function POST(request: Request) {
  try {
    const { groupId, message, clinicName } = await request.json();
    
    const botToken = '8214864800:AAEtYsHUOv07OkQcP-szHCN-gY8yeVkTPGQ';
    const targetGroupId = groupId || '-1002557630252'; // Default to your group
    
    const clinicMessage = `🏥 <b>${clinicName || 'Healthcare Clinic'}</b>

${message}

⏰ <i>Sent: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</i>`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetGroupId,
        text: clinicMessage,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    
    if (result.ok) {
      return Response.json({
        success: true,
        message: 'Group message sent successfully!',
        messageId: result.result.message_id,
        sentTo: targetGroupId
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