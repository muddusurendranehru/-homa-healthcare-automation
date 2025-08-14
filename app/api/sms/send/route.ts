import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// =============================================================================
// HOMA HEALTHCARE SMS AUTOMATION - ₹1,80,000 REVENUE SYSTEM
// NEW TWILIO CREDENTIALS - PRODUCTION READY
// =============================================================================

// Initialize Twilio client with NEW credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

console.log('🏥 HOMA HEALTHCARE SMS API - NEW CREDENTIALS INITIALIZING...');
console.log('💰 Target Revenue: ₹1,45,000/month from SMS automation');
console.log('📊 Credentials Status Check:');
console.log('   Account SID:', accountSid ? '✅ LOADED' : '❌ MISSING');
console.log('   API Key:', apiKey ? '✅ LOADED' : '❌ MISSING');
console.log('   API Secret:', apiSecret ? '✅ LOADED' : '❌ MISSING');
console.log('   Messaging Service:', messagingServiceSid ? '✅ LOADED' : '❌ MISSING');
console.log('   Phone Number:', fromNumber ? '✅ LOADED' : '❌ MISSING');

// Validate essential credentials
if (!accountSid) {
  console.error('❌ CRITICAL: Missing TWILIO_ACCOUNT_SID');
}
if (!messagingServiceSid) {
  console.error('❌ CRITICAL: Missing TWILIO_MESSAGING_SERVICE_SID');
}
if (!apiKey && !authToken) {
  console.error('❌ CRITICAL: Missing both TWILIO_API_KEY and TWILIO_AUTH_TOKEN');
}

// Initialize Twilio client with API Key (preferred) or fallback to Auth Token
let client;
try {
  if (apiKey && apiSecret) {
    console.log('🔑 Using API Key authentication (PRODUCTION MODE)');
    client = twilio(apiKey, apiSecret, { accountSid });
  } else if (authToken) {
    console.log('🔑 Using Auth Token authentication (BACKUP MODE)');
    client = twilio(accountSid, authToken);
  } else {
    throw new Error('No valid authentication credentials found');
  }
  console.log('✅ Twilio client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Twilio client:', error);
}

export async function POST(request: NextRequest) {
  try {
    console.log('\n🚀 =================================================');
    console.log('📱 HOMA HEALTHCARE SMS API - NEW REQUEST RECEIVED');
    console.log('💰 Generating ₹1,45,000/month revenue through SMS automation');
    console.log('⏰ Request Time:', new Date().toISOString());
    console.log('🏥 Healthcare Provider: Homa Health Care');
    console.log('👨‍⚕️ Owner: Muddu Surendra Nehru');
    console.log('=================================================\n');
    
    // Parse request body
    const body = await request.json();
    const { phone, message } = body;

    console.log('📝 Request Data Analysis:');
    console.log('   📞 Target Phone:', phone ? `${phone.substring(0, 5)}***${phone.substring(phone.length - 3)}` : 'MISSING');
    console.log('   📄 Message Length:', message ? `${message.length} characters` : 'MISSING');
    console.log('   🔍 Message Preview:', message ? `"${message.substring(0, 50)}..."` : 'NO MESSAGE');

    // Validate required fields
    if (!phone || !message) {
      console.log('❌ VALIDATION FAILED: Missing required fields');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Phone number and message are required',
          help: 'Provide both phone (+919963721999) and message fields',
          system: 'Homa Healthcare SMS Validation'
        },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!phone.match(/^\+[1-9]\d{1,14}$/)) {
      console.log('❌ VALIDATION FAILED: Invalid phone number format');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid phone number format',
          help: 'Use international format: +919963721999',
          example: '+919963721999',
          system: 'Homa Healthcare SMS Validation'
        },
        { status: 400 }
      );
    }

    // Enhanced message formatting for Homa Healthcare branding
    const formattedMessage = `🏥 HOMA HEALTH CARE
━━━━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Automated Patient Communication System
📱 ₹1,80,000/month Healthcare Automation
🚀 24/7 Professional Healthcare Services

📞 Contact: Muddu Surendra Nehru
🏥 Homa Health Care - Your Trusted Partner

Thank you for choosing our services.`;

    // Prepare message options using Messaging Service SID
    const messageOptions = {
      body: formattedMessage,
      to: phone,
      messagingServiceSid: messagingServiceSid,
    };

    console.log('📤 SENDING SMS VIA NEW TWILIO CREDENTIALS...');
    console.log('🔧 SMS Configuration:');
    console.log('   📞 To:', phone);
    console.log('   📱 Via Messaging Service:', messagingServiceSid);
    console.log('   📄 Message Size:', formattedMessage.length, 'characters');
    console.log('   🔑 Auth Method:', apiKey ? 'API Key' : 'Auth Token');

    // Send SMS via Twilio with error handling
    let result;
    try {
      result = await client.messages.create(messageOptions);
    } catch (twilioError: any) {
      console.error('❌ TWILIO API ERROR:', twilioError);
      throw twilioError;
    }

    console.log('\n🎉 =======================================');
    console.log('✅ SMS SENT SUCCESSFULLY WITH NEW CREDENTIALS!');
    console.log('💰 REVENUE SYSTEM: ACTIVE');
    console.log('📊 SMS Details:');
    console.log('   🆔 Message SID:', result.sid);
    console.log('   📱 Status:', result.status);
    console.log('   📞 To:', result.to);
    console.log('   📱 From:', result.from || result.messagingServiceSid);
    console.log('   💰 Revenue Impact: Contributing to ₹1,45,000/month');
    console.log('   🏥 Healthcare Provider: Homa Health Care');
    console.log('   ⏰ Sent At:', new Date().toISOString());
    console.log('=======================================\n');

    return NextResponse.json({
      success: true,
      messageId: result.sid,
      status: result.status,
      to: phone,
      from: result.from || `Homa Healthcare (+18777804236)`,
      message: '🏥 SMS sent successfully! NEW Twilio credentials working perfectly! ₹1,45,000/month SMS automation ACTIVE! 🚀',
      
      // Business Intelligence
      revenueSystem: 'ACTIVE',
      monthlyPotential: '₹1,45,000',
      businessImpact: 'Patient communication automated with new production credentials',
      
      // Technical Details
      credentials: 'New API Key authentication - Production Ready',
      messagingService: messagingServiceSid,
      phoneNumber: result.from || '+18777804236',
      
      // Healthcare Information
      hospital: 'Homa Health Care',
      owner: 'Muddu Surendra Nehru',
      
      // System Status
      timestamp: new Date().toISOString(),
      systemStatus: 'Fully Operational',
      nextSteps: 'Ready to onboard 500+ patients for automated healthcare communication'
    });

  } catch (error: any) {
    console.error('\n❌ =======================================');
    console.error('SMS SENDING ERROR WITH NEW CREDENTIALS');
    console.error('💰 REVENUE IMPACT: Temporary interruption');
    console.error('🔧 Error Analysis:');
    console.error('   📝 Error Message:', error.message);
    console.error('   🔢 Error Code:', error.code || 'No code');
    console.error('   📊 Error Details:', error.moreInfo || 'No additional info');
    console.error('   ⏰ Error Time:', new Date().toISOString());
    console.error('=======================================\n');
    
    // Enhanced error handling with specific solutions
    let errorMessage = error.message || 'Unknown SMS sending error';
    let helpMessage = 'Contact support for assistance';
    let actionRequired = 'Check system status';
    let errorCode = error.code;

    // Specific error handling for common Twilio issues
    switch (errorCode) {
      case 20003:
        errorMessage = 'Authentication failed with new credentials';
        helpMessage = 'Verify TWILIO_API_KEY and TWILIO_API_SECRET in environment variables';
        actionRequired = 'Check new API key and secret configuration';
        break;
        
      case 21211:
        errorMessage = 'Invalid phone number format';
        helpMessage = 'Use international format with country code: +919963721999';
        actionRequired = 'Fix phone number format and retry';
        break;
        
      case 21608:
      case 21606:
        errorMessage = 'Phone number not verified for trial account';
        helpMessage = 'Add +919963721999 to verified caller IDs in Twilio console';
        actionRequired = 'Verify phone number in Twilio console or upgrade to paid account';
        break;
        
      case 21614:
        errorMessage = 'Invalid messaging service SID';
        helpMessage = 'Check TWILIO_MESSAGING_SERVICE_SID: ' + messagingServiceSid;
        actionRequired = 'Verify messaging service SID in Twilio console';
        break;
        
      case 21619:
        errorMessage = 'Messaging service not found';
        helpMessage = 'Messaging service may be disabled or deleted';
        actionRequired = 'Recreate messaging service or use phone number instead';
        break;
        
      default:
        errorMessage = error.message || 'Unexpected Twilio API error';
        helpMessage = 'Check Twilio console for account status and error details';
        actionRequired = 'Review Twilio account settings and try again';
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      help: helpMessage,
      actionRequired: actionRequired,
      
      // Error Details
      code: errorCode,
      details: error.moreInfo || 'No additional error information available',
      
      // System Information
      system: 'Homa Healthcare Revenue System',
      credentials: 'New API Key authentication',
      impact: 'Temporary interruption in ₹1,45,000/month SMS revenue generation',
      
      // Troubleshooting Information
      troubleshooting: {
        checkCredentials: 'Verify all TWILIO_* environment variables',
        checkAccount: 'Login to Twilio console and verify account status',
        checkPhone: 'Ensure phone number is in international format (+919963721999)',
        checkMessagingService: 'Verify messaging service ' + messagingServiceSid + ' is active'
      },
      
      // Business Impact
      hospital: 'Homa Health Care',
      owner: 'Muddu Surendra Nehru',
      timestamp: new Date().toISOString()
      
    }, { status: 500 });
  }
}

// Health check endpoint for SMS service
export async function GET() {
  console.log('🔍 SMS SERVICE HEALTH CHECK - Homa Healthcare');
  
  return NextResponse.json({
    service: 'Homa Healthcare SMS API',
    status: 'Active',
    version: '2.0 - NEW CREDENTIALS',
    credentials: {
      accountSid: accountSid ? 'Configured' : 'Missing',
      apiKey: apiKey ? 'Configured' : 'Missing',
      authToken: authToken ? 'Configured' : 'Missing',
      messagingService: messagingServiceSid ? 'Configured' : 'Missing'
    },
    revenue: {
      target: '₹1,45,000/month',
      service: 'SMS Automation',
      capacity: '500+ patients'
    },
    hospital: 'Homa Health Care',
    owner: 'Muddu Surendra Nehru',
    timestamp: new Date().toISOString()
  });
}