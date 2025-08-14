import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

console.log('🤖 Telegram API initialized - Homa Healthcare Bot');

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 Telegram API called - Homa Healthcare Automation');
    
    const body = await request.json();
    const { chatId, message } = body;

    console.log('📝 Telegram Request:', { chatId, message: message?.substring(0, 30) + '...' });

    // Validate required fields
    if (!chatId || !message) {
      console.log('❌ Missing chatId or message');
      return NextResponse.json(
        { success: false, error: 'Chat ID and message are required' },
        { status: 400 }
      );
    }

    console.log('📤 Sending message via Telegram Bot...');

    // Send message via Telegram Bot API
    const telegramResponse = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🏥 *Homa Healthcare Automation*\n\n${message}\n\n💰 ₹1,80,000 Monthly Revenue System ACTIVE! 🚀`,
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
        helpMessage = 'Start the bot first: send /start to @homahealthcare_automation_bot';
      } else if (responseData.error_code === 403) {
        errorMessage = 'Bot was blocked by user';
        helpMessage = 'Unblock the bot and send /start';
      } else if (responseData.error_code === 400 && responseData.description?.includes('bot')) {
        errorMessage = 'Invalid chat ID or bot not started';
        helpMessage = 'Get your chat ID from: https://api.telegram.org/bot8214864800:AAEtYsHUOv07OkQcP-szHCN-gY8yeVkTPGQ/getUpdates';
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          help: helpMessage,
          details: responseData.description
        },
        { status: telegramResponse.status }
      );
    }

    console.log('✅ Telegram message sent successfully!');

    return NextResponse.json({
      success: true,
      messageId: responseData.result.message_id,
      chatId: responseData.result.chat.id,
      message: '🤖 Telegram message sent successfully! Healthcare automation LIVE! 🚀'
    });

  } catch (error: any) {
    console.error('❌ Telegram error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send Telegram message', 
        help: 'Check bot token and chat ID',
        details: error.message
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
        message: '🤖 Homa Healthcare Bot is ACTIVE and ready for ₹1,80,000 automation! 🚀'
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