import { Button } from '@/components/ui/button';

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vegan-light-green to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-vegan-green rounded-2xl mb-4">
            <i className="fas fa-leaf text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">VeganMapAI</h1>
          <p className="text-neutral-gray font-opensans">Discover amazing vegan-friendly places near you</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full bg-black text-white py-4 px-6 rounded-xl font-opensans font-medium flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors h-auto"
          >
            <i className="fab fa-apple text-xl"></i>
            <span>Continue with Apple</span>
          </Button>
          
          <Button 
            onClick={handleLogin}
            variant="outline"
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl font-opensans font-medium flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors h-auto"
          >
            <i className="fab fa-google text-xl text-red-500"></i>
            <span>Continue with Google</span>
          </Button>
        </div>
        
        <p className="text-sm text-neutral-gray text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
