import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SupportChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Bonjour ! Je suis l\'assistant AI AssetFlow. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Vous êtes un assistant sympathique et serviable pour AssetFlow, une plateforme de gestion de patrimoine multi-actifs. Votre objectif est d'aider les utilisateurs avec leurs questions sur la plateforme. Gardez vos réponses concises et utiles. Ne mentionnez pas que vous êtes un LLM. Voici la question de l'utilisateur : "${inputValue}"`
      });

      const aiMessage = { sender: 'ai', text: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error invoking LLM:", error);
      const errorMessage = { sender: 'ai', text: 'Désolé, je rencontre des difficultés de connexion. Veuillez réessayer plus tard.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 z-50">
      <Card className="glass-card flex flex-col h-[60vh]">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-indigo-400" />
            <CardTitle className="text-white">Assistant AI</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
              {message.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
              )}
              <div className={`max-w-xs p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-700 text-slate-200 rounded-bl-none'
              }`}>
                <p className="text-sm">{message.text}</p>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-200" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="max-w-xs p-3 rounded-lg bg-slate-700 text-slate-200 rounded-bl-none">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t border-slate-700">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Posez une question..."
              className="bg-slate-800 border-slate-600 text-white"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}