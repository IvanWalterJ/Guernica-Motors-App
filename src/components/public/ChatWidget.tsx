import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "¡Hola! Soy tu asesor personal de Guernica Motors. ¿En qué te puedo ayudar hoy? Si buscas un modelo específico que no ves en nuestro catálogo, dímelo y nuestro equipo de importación lo conseguirá para ti." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (!chatRef.current) {
      try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
        chatRef.current = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: "Eres un asesor de ventas premium de Guernica Motors, una agencia de autos de lujo en Argentina. Tu objetivo es ayudar a los clientes. Si el cliente busca un auto que no tenemos en catálogo o quiere recomendar uno, debes ofrecer nuestro servicio de 'Vehicle Sourcing' (Búsqueda a pedido). Pregunta qué marca, modelo, año, color y presupuesto tienen en mente, y diles que nuestro equipo de importación lo conseguirá para ellos. Sé muy cortés, profesional, exclusivo y conciso en tus respuestas. Usa formato markdown para resaltar información importante."
          }
        });
      } catch (error) {
        console.error("Error initializing Gemini:", error);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) throw new Error("Chat not initialized");
      const response = await chatRef.current.sendMessage({ message: userText });
      setMessages(prev => [...prev, { role: "model", content: response.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "model", content: "Lo siento, en este momento mis sistemas están experimentando demoras. Por favor, intenta de nuevo más tarde o contáctanos por teléfono." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 bg-gradient-guernica text-white rounded-full animate-pulse-glow transition-all hover:scale-105 z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 right-8 w-[calc(100vw-4rem)] sm:w-[380px] h-[600px] max-h-[80vh] bg-[#0A0A0A] rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center text-white bg-[#0A0A0A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-guernica shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium tracking-wide">Asistente IA</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Guernica Motors</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-light leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-red-600 text-white rounded-tr-sm' 
                      : 'bg-[#1A1A1A] border border-white/10 text-gray-200 rounded-tl-sm'
                  }`}>
                    {msg.role === 'model' ? (
                      <div className="prose prose-invert prose-sm max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&>strong]:text-white">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1A] border border-white/10 text-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-lg">
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-[#050505]/80 backdrop-blur-md border-t border-white/10">
              <form onSubmit={handleSend} className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu mensaje..."
                  disabled={isLoading}
                  className="flex-1 bg-[#111111]/80 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#dc2626]/50 transition-all font-light shadow-inner disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-gradient-guernica text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
