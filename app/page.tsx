export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          🏥 Homa Healthcare Automation
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          ₹1,80,000/month Healthcare Communication System
        </p>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">
            ✅ System Status: 100% Operational
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-800">📱 SMS System</h3>
              <p className="text-green-700">₹1,45,000/month potential</p>
              <p className="text-green-600">Ready for 500+ patients</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800">💬 Telegram Bot</h3>
              <p className="text-blue-700">₹35,000/month potential</p>
              <p className="text-blue-600">Real-time notifications</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🚀 Ready for Business Launch
          </h3>
          <p className="text-yellow-700">
            Owner: <strong>Muddu Surendra Nehru</strong><br/>
            All systems operational and ready for patient onboarding
          </p>
        </div>
      </div>
    </div>
  );
}