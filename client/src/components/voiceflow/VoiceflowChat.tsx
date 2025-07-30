import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceflowChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceflowChat({ isOpen, onClose }: VoiceflowChatProps) {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Здравейте! Аз съм вашият AI асистент за веган ресторанти в София. Какво бихте искали да знаете?'
      }]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Use our existing chat API instead of Voiceflow for now
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.message };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Грешка',
        description: 'Проблем при изпращане на съобщението. Опитайте отново.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Гласово разпознаване не се поддържа',
        description: 'Вашият браузър не поддържа гласово разпознаване. Използвайте текстовото поле.',
        variant: 'destructive'
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
  
    recognition.lang = 'bg-BG';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    // Add timeout handling
    let timeoutId: NodeJS.Timeout;
    
    const startTimeout = () => {
      timeoutId = setTimeout(() => {
        recognition.stop();
        setIsListening(false);
        toast({
          title: 'Времето за говорене изтече',
          description: 'Опитайте отново или използвайте текстовото поле.',
          variant: 'destructive'
        });
      }, 10000); // 10 seconds timeout
    };

    recognition.onstart = () => {
      setIsListening(true);
      startTimeout();
    };

    recognition.onresult = (event: any) => {
      clearTimeout(timeoutId);
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      sendMessage(transcript);
    };

    recognition.onerror = (event: any) => {
      clearTimeout(timeoutId);
      setIsListening(false);
      
      let errorMessage = 'Опитайте отново или използвайте текстовото поле.';
      
      if (event.error === 'not-allowed') {
        errorMessage = 'Достъпът до микрофона е отказан. Моля, разрешете достъп в браузъра си.';
      } else if (event.error === 'no-speech') {
        errorMessage = 'Не беше разпознат звук. Опитайте отново и говорете по-ясно.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Проблем с микрофона. Проверете дали е свързан правилно.';
      } else if (event.error === 'network') {
        errorMessage = 'Мрежова грешка. Проверете интернет връзката си.';
      }
      
      toast({
        title: 'Грешка при гласово разпознаване',
        description: errorMessage,
        variant: 'destructive'
      });
    };

    recognition.onend = () => {
      clearTimeout(timeoutId);
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Асистент
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Напишете вашия въпрос..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={startListening}
              disabled={isLoading || isListening}
              className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              title={isListening ? 'Слушам...' : 'Натиснете за гласово въвеждане'}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </Button>
            <Button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-green-500 hover:bg-green-600"
            >
              <Send size={16} />
            </Button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            {isListening ? 'Говорете сега...' : 'Използвайте микрофона или текстовото поле'}
          </p>
        </div>
      </div>
    </div>
  );
}