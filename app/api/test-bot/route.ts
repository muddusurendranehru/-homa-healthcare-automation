import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

console.log('🤖 Homa Healthcare Telegram Bot - Initializing...');

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 🏥 HOMA HEALTHCARE - TELEGRAM API CALLED! 💰');
    
    const body = await request.json();
    const { chatId, message } = body;

    console.log('📝 Telegram Request received:', { 
      chatId, 
      messageLength: message?.length 
    });

    // Validate required fields
    if (!chatId || !message) {
      console.log('❌ Missing chatId or message');
      return NextResponse.json(
        { success: false, error: 'Chat ID and message are required' },
        { status: 400 }
      );
    }

    console.log('📤 💰 Sending REVENUE-GENERATING message via Telegram Bot...');

    // Format message for Homa Healthcare branding
    const formattedMessage = `🏥 *HOMA HEALTHCARE AUTOMATION*

${message}

💰 ₹1,80,000 Monthly Revenue System ACTIVE!
🚀 Automated Patient Communication LIVE!
📱 500+ Patient Capacity Ready!

_Powered by Homa Healthcare Automation_
_Contact: Muddu Surendra Nehru_`;

    // Send message via Telegram Bot API
    const telegramResponse = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedMessage,
        parse_mode: 'Markdown',
      }),
    });

    const responseData = await telegramResponse.json();
    console.log('📱 Telegram response received');

    if (!telegramResponse.ok) {
      console.error('❌ Telegram API error:', responseData);
      
      let errorMessage = 'Failed to send Telegram message';
      let helpMessage = '';
      
      if (responseData.error_code === 400 && responseData.description?.includes('chat not found')) {
        errorMessage = 'Chat not found';
        helpMessage = 'Send /start to @homahealthcare_automation_bot first';
      } else if (responseData.error_code === 403) {
        errorMessage = 'Bot blocked by user';
        helpMessage = 'Unblock bot and send /start to @homahealthcare_automation_bot';
      } else if (responseData.description?.includes('chat_id')) {
        errorMessage = 'Invalid chat ID';
        helpMessage = 'Use Chat ID: 5892544777 (personal) or -1002557630252 (group)';
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          help: helpMessage,
          details: responseData.description,
          system: 'Homa Healthcare Telegram Service'
        },
        { status: telegramResponse.status }
      );
    }

    console.log('✅ 🚀 TELEGRAM MESSAGE SENT! REVENUE SYSTEM ACTIVE!');

    return NextResponse.json({
      success: true,
      messageId: responseData.result.message_id,
      chatId: responseData.result.chat.id,
      message: '🤖 Telegram message sent successfully! ₹1,80,000 healthcare automation LIVE! 🚀',
      revenueSystem: 'ACTIVE',
      monthlyPotential: '₹1,80,000'
    });

  } catch (error: any) {
    console.error('❌ Telegram error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send Telegram message', 
        help: 'Check bot token: 8214864800:AAEtYsHUOv07OkQcP-szHCN-gY8yeVkTPGQ',
        details: error.message,
        system: 'Homa Healthcare Telegram Service'
      },
      { status: 500 }
    );
  }
}

// Test endpoint to verify bot status
export async function GET() {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getMe`);
    const data = await response.json();
    
    if (response.ok) {
      return NextResponse.json({
        success: true,
        bot: data.result,
        message: '🤖 Homa Healthcare Bot ACTIVE! Ready for ₹1,80,000 automation! 🚀'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Bot authentication failed' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to check bot status' },
      { status: 500 }
    );
  }
}