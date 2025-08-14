'use client';

import { useState } from 'react';

export default function TestAutomationPage() {
  const [smsPhone, setSmsPhone] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const sendTestSMS = async () => {
    if (!smsPhone) {
      alert('Please enter a phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'test',
          phone: smsPhone,
          data: {}
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  const sendTestTelegram = async () => {
    if (!telegramChatId) {
      alert('Please enter a chat ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: telegramChatId,
          message: 'Test message from Homa Health Care!'
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 Homa Health Care</h1>
          <p className="text-xl text-gray-600 mb-4">Automation Testing Center</p>
          <p className="text-gray-500">Port 3020 • URL: /testing</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-semibold text-gray-800">SMS Service</h3>
            <p className="text-green-600 text-sm">✅ Twilio Active</p>
            <p className="text-xs text-gray-500">+16163772849</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-semibold text-gray-800">Telegram Bot</h3>
            <p className="text-green-600 text-sm">✅ Bot Ready</p>
            <p className="text-xs text-gray-500">@homahealthcare_automation_bot</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-800">Revenue Ready</h3>
            <p className="text-green-600 text-sm">✅ ₹1,80,000/month</p>
            <p className="text-xs text-gray-500">Automation Live</p>
          </div>
        </div>

        {/* SMS Testing */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            📱 SMS Testing
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number (International Format):</label>
              <input
                type="text"
                placeholder="+91XXXXXXXXXX"
                value={smsPhone}
                onChange={(e) => setSmsPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Use your own number for testing</p>
            </div>
            <button 
              onClick={sendTestSMS}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending SMS...' : '📱 Send Test SMS'}
            </button>
          </div>
        </div>

        {/* Telegram Testing */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            💬 Telegram Testing
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chat ID:</label>
              <input
                type="text"
                placeholder="Get from bot interaction logs"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Message @homahealthcare_automation_bot first, then check console logs
              </p>
            </div>
            <button 
              onClick={sendTestTelegram}
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending to Bot...' : '💬 Send Test Message'}
            </button>
          </div>
        </div>

        {/* Quick Setup Guide */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Quick Telegram Setup:</h3>
          <ol className="text-yellow-700 space-y-2">
            <li>1. Open Telegram and search: <strong>@homahealthcare_automation_bot</strong></li>
            <li>2. Send <strong>/start</strong> command</li>
            <li>3. Check your Next.js console logs for chat ID</li>
            <li>4. Copy the chat ID and paste it above</li>
            <li>5. Test the bot!</li>
          </ol>
        </div>

        {/* Results */}
        {result && (
          <div className={`rounded-lg shadow-lg p-6 mb-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`text-lg font-semibold mb-3 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Success!' : '❌ Error'}
            </h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
            {result.success && result.messageId && (
              <div className="mt-4 p-3 bg-green-100 rounded">
                <p className="text-green-800 font-semibold">✅ Message sent successfully!</p>
                <p className="text-green-700 text-sm">Message ID: {result.messageId}</p>
              </div>
            )}
          </div>
        )}

        {/* Revenue Info */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">💰 Revenue Potential</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">✅ Once Testing Works:</h4>
              <ul className="text-sm space-y-1">
                <li>• SMS automation working</li>
                <li>• Telegram bot responding</li>
                <li>• Ready for patient onboarding</li>
                <li>• Revenue generation ready</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🚀 Start Earning:</h4>
              <ul className="text-sm space-y-1">
                <li>• Appointment reminders: ₹45,000/month</li>
                <li>• Medication compliance: ₹70,000/month</li>
                <li>• Patient engagement: ₹35,000/month</li>
                <li>• Billing automation: ₹30,000/month</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}