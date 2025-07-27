export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">VeganMapAI</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover vegan-friendly restaurants with AI-powered scoring
          </p>
          
          <div className="space-y-4">
            <a
              href="/api/login"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors inline-block text-center"
            >
              Sign In to Get Started
            </a>
            
            <div className="text-sm text-gray-500">
              Find vegan options in Sofia with comprehensive scoring
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}