export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            🚀 Avallon Cloud
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your complete site generation platform is ready!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">✅ GitHub Integration</h3>
              <p className="text-gray-600">Create repositories automatically</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">✅ Vercel Deployment</h3>
              <p className="text-gray-600">Deploy sites automatically</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">🔧 Claude Integration</h3>
              <p className="text-gray-600">AI site generation (needs API key fix)</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Test Your APIs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="/api/test/complete-workflow" 
                className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                target="_blank"
              >
                🧪 Test Complete Workflow
              </a>
              
              <a 
                href="/api/test/final-success" 
                className="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                target="_blank"
              >
                📊 System Status
              </a>
              
              <a 
                href="/api/test/github-permissions" 
                className="block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                target="_blank"
              >
                🔗 GitHub Test
              </a>
              
              <a 
                href="/api/test/claude-debug" 
                className="block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                target="_blank"
              >
                🤖 Claude Debug
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
