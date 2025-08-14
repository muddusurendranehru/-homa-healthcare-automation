import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

console.log('🔧 Twilio SMS API initialized');

if (!accountSid || !authToken) {
  console.error('❌ Missing Twilio credentials in environment variables');
}

const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
  try {
    console.log('📱 SMS API called - Homa Healthcare Automation');
    
    const body = await request.json();
    const { phone, message } = body;

    console.log('📝 SMS Request:', { phone: phone?.substring(0, 5) + '***', message: message?.substring(0, 30) + '...' });

    // Validate required fields
    if (!phone || !message) {
      console.log('❌ Missing phone or message');
      return NextResponse.json(
        { success: false, error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    // Prepare message options with Messaging Service SID (recommended for production)
    const messageOptions: any = {
      body: message,
      to: phone,
      messagingServiceSid: messagingServiceSid, // Use messaging service for better delivery
    };

    console.log('📤 Sending SMS via Twilio...');

    // Send SMS via Twilio
    const result = await client.messages.create(messageOptions);

    console.log('✅ SMS sent successfully!', {
      sid: result.sid,
      status: result.status,
      to: result.to
    });

    return NextResponse.json({
      success: true,
      messageId: result.sid,
      status: result.status,
      to: phone,
      from: result.from || 'Homa Healthcare',
      message: '🏥 SMS sent successfully! ₹1,80,000 automation system LIVE! 🚀'
    });

  } catch (error: any) {
    console.error('❌ SMS sending error:', error);
    
    // Handle specific Twilio errors
    let errorMessage = error.message;
    let helpMessage = '';
    
    if (error.code === 21211) {
      errorMessage = 'Invalid phone number format';
      helpMessage = 'Use format: +91XXXXXXXXXX (with country code)';
    } else if (error.code === 21608) {
      errorMessage = 'Phone number is unverified';
      helpMessage = 'Verify phone number in Twilio console for trial account';
    } else if (error.code === 20003) {
      errorMessage = 'Authentication error';
      helpMessage = 'Check Twilio Account SID and Auth Token';
    } else if (error.code === 21606) {
      errorMessage = 'Phone number not verified for trial account';
      helpMessage = 'Add phone number to verified caller IDs in Twilio console';
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      help: helpMessage,
      code: error.code,
      details: 'Check Twilio console and phone number format'
    }, { status: 500 });
  }
}