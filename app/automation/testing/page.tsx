'use client';

import { useState } from 'react';

export default function TestAutomationPage() {
  const [smsPhone, setSmsPhone] = useState('+919963721999');
  const [smsMessage, setSmsMessage] = useState('🏥 Muddu! Homa Healthcare ₹1,80,000 automation system is LIVE! Ready for patient communication! 💰');
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsResult, setSmsResult] = useState<any>(null);

  const [telegramChatId, setTelegramChatId] = useState('5892544777');
  const [telegramMessage, setTelegramMessage] = useState('🚀 Muddu! Your Homa Healthcare revenue system is activated! Ready to automate 500+ patient communications! 💰');
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramResult, setTelegramResult] = useState<any>(null);

  const sendTestSMS = async () => {
    setSmsLoading(true);
    setSmsResult(null);
    
    try {
      console.log('🏥 Sending SMS test...');
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: smsPhone,
          message: smsMessage,
        }),
      });
      
      const data = await response.json();
      setSmsResult(data);
      console.log('📱 SMS Result:', data);
    } catch (error) {
      console.error('❌ SMS Error:', error);
      setSmsResult({ success: false, error: 'Network error', details: error.message });
    } finally {
      setSmsLoading(false);
    }
  };

  const sendTestTelegram = async () => {
    setTelegramLoading(true);
    setTelegramResult(null);
    
    try {
      console.log('🤖 Sending Telegram test...');
      const response = await fetch('/api/test-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: telegramChatId,
          message: telegramMessage,
        }),
      });
      
      const data = await response.json();
      setTelegramResult(data);
      console.log('🤖 Telegram Result:', data);
    } catch (error) {
      console.error('❌ Telegram Error:', error);
      setTelegramResult({ success: false, error: 'Network error', details: error.message });
    } finally {
      setTelegramLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🏥 Homa Healthcare Automation
          </h1>
          <p className="text-2xl text-green-600 font-semibold">
            💰 ₹1,80,000+ Monthly Revenue System
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Test SMS & Telegram Automation • 500+ Patient Communication System
          </p>
          <div className="mt-4 bg-blue-100 rounded-lg p-4 inline-block">
            <p className="text-blue-800 font-semibold">🚀 System Status: LIVE</p>
            <p className="text-blue-600">Server: localhost:3020 | Owner: Muddu Surendra Nehru</p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💰 Revenue Potential</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">₹45,000</div>
              <div className="text-sm text-gray-600">Appointment Reminders</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">₹70,000</div>
              <div className="text-sm text-gray-600">Medication Compliance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">₹35,000</div>
              <div className="text-sm text-gray-600">Patient Engagement</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">₹30,000</div>
              <div className="text-sm text-gray-600">Billing Automation</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* SMS Testing */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-6 flex items-center">
              📱 SMS Testing
              <span className="ml-4 text-lg font-normal text-green-600">₹1,45,000/month</span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number (Muddu's Phone)
                </label>
                <input
                  type="text"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  placeholder="+919963721999"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Test Message
                </label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={sendTestSMS}
                disabled={smsLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {smsLoading ? '📤 Sending SMS...' : '📱 Send Test SMS to Muddu'}
              </button>
              
              {smsResult && (
                <div className={`p-4 rounded-lg ${smsResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className={`font-semibold ${smsResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {smsResult.success ? '✅ SMS SUCCESS!' : '❌ SMS ERROR:'}
                  </h3>
                  <pre className="text-sm mt-2 overflow-auto">
                    {JSON.stringify(smsResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Telegram Testing */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center">
              🤖 Telegram Testing
              <span className="ml-4 text-lg font-normal text-green-600">₹35,000/month</span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chat ID
                </label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="5892544777"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Muddu's Chat: 5892544777 | Homa Staff Group: -1002557630252
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Test Message
                </label>
                <textarea
                  value={telegramMessage}
                  onChange={(e) => setTelegramMessage(e.target.value)}
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={sendTestTelegram}
                disabled={telegramLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {telegramLoading ? '📤 Sending Message...' : '🤖 Send Test Message to Muddu'}
              </button>
              
              {telegramResult && (
                <div className={`p-4 rounded-lg ${telegramResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className={`font-semibold ${telegramResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {telegramResult.success ? '✅ TELEGRAM SUCCESS!' : '❌ TELEGRAM ERROR:'}
                  </h3>
                  <pre className="text-sm mt-2 overflow-auto">
                    {JSON.stringify(telegramResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-gray-800 text-white rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">🔧 System Status</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>📱 SMS Service:</strong><br />
              Twilio Messaging Service<br />
              Phone: +919963721999<br />
              SID: MGc222dda84948540d9a5f77482fd73325
            </div>
            <div>
              <strong>🤖 Telegram Bot:</strong><br />
              @homahealthcare_automation_bot<br />
              Bot ID: 8214864800<br />
              Chat ID: 5892544777
            </div>
            <div>
              <strong>💰 Revenue System:</strong><br />
              Target: ₹1,80,000/month<br />
              Capacity: 500+ Patients<br />
              Owner: Muddu Surendra Nehru
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">🎯 Success Checklist</h3>
          <div className="text-yellow-700 space-y-2">
            <p><strong>✅ Step 1:</strong> Click "Send Test SMS" - SMS should arrive on +919963721999</p>
            <p><strong>✅ Step 2:</strong> Click "Send Test Message" - Message should appear in Telegram chat 5892544777</p>
            <p><strong>✅ Step 3:</strong> Both tests successful = ₹1,80,000/month system READY!</p>
            <p><strong>🚀 Next:</strong> Start onboarding patients for automated healthcare communication</p>
          </div>
        </div>
      </div>
    </div>
  );
}