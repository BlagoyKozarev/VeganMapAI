import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { VoiceflowChat } from '@/components/voiceflow/VoiceflowChat';
import { ArrowLeft, Mic, MessageCircle } from 'lucide-react';

export default function AiChat() {
  const [, setLocation] = useLocation();
  const [isVoiceflowOpen, setIsVoiceflowOpen] = useState(false);

  const quickQuestions = [
    "Какви са най-добрите веган ресторанти в София?",
    "Кажи ми за ресторанти с високи веган оценки", 
    "Къде мога да намеря веган пица в центъра?",
    "Препоръчай ми място за веган закуска"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Назад
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Асистент за Веган Ресторанти
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Здравейте! Аз съм вашият AI асистент
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Помагам ви да откриете най-добрите веган места в София. Говорете с мен на български език 
            или използвайте текстовите предложения по-долу.
          </p>
        </div>

        {/* Voice Chat Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setIsVoiceflowOpen(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Mic size={24} className="mr-3" />
            Започнете гласов разговор
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Натиснете и говорете на български език
          </p>
        </div>

        {/* Quick Questions */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Или изберете от тези въпроси:
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setIsVoiceflowOpen(true)}
                className="text-left h-auto p-4 justify-start bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <MessageCircle size={16} className="mr-3 text-green-500 flex-shrink-0" />
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Mic size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Гласово управление</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Говорете естествено на български език
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageCircle size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Интелигентни отговори</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              AI-базирани препоръки за веган места
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ArrowLeft size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Бърз достъп</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Директни връзки към карта и ресторанти
            </p>
          </div>
        </div>
      </div>

      {/* Voiceflow Modal */}
      <VoiceflowChat 
        isOpen={isVoiceflowOpen} 
        onClose={() => setIsVoiceflowOpen(false)} 
      />
    </div>
  );
}