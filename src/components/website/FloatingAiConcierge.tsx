import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  User,
  Send,
  X,
  Sparkles,
  Globe,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { AppState } from '../../services/store';
import { AiService, SUPPORTED_LANGUAGES } from '../../services/aiService';

interface FloatingAiConciergeProps {
  state: AppState;
  isOpen: boolean;
  onToggle: () => void;
  onOpenBooking: (serviceId?: string) => void;
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export const FloatingAiConcierge: React.FC<FloatingAiConciergeProps> = ({
  state,
  isOpen,
  onToggle,
  onOpenBooking,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: `Hello! 🌊 Welcome to Dive Go Hurghada. I am your 24/7 multilingual Red Sea diving and excursion concierge. How can I help you with boat diving, beginner PADI courses, or dolphin snorkeling trips today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [isRtl, setIsRtl] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    if (/[\u0600-\u06FF]/.test(query)) {
      setIsRtl(true);
    }

    try {
      const response = await AiService.sendChatMessage({
        message: query,
        conversationHistory: messages.map((m) => ({ role: m.role, text: m.text })),
        businessProfile: state.profile,
        verifiedServices: state.services,
        verifiedPolicies: state.knowledgeBase,
        customerLanguage: SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.name || 'English',
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          text: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: response.source,
        },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: `Daily boat diving is €65, Discover Scuba is €55, and Dolphin House is €35. Please message our WhatsApp desk at ${state.profile.whatsappNumber || '+2 0103 94 64 284'}!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full shadow-2xl shadow-cyan-600/40 flex items-center space-x-2 group transition-all duration-300 hover:scale-105 cursor-pointer"
          title="Open AI Concierge"
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <span className="text-xs font-bold hidden sm:inline pr-1">Ask AI Concierge (24/7)</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[400px] h-[540px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                  <span>AI Diving & Tour Concierge</span>
                  <span className="text-[10px] text-emerald-400 font-bold">● Online</span>
                </h3>
                <span className="text-[10px] text-cyan-300">Dive Go Hurghada • Multilingual Assistant</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsRtl(!isRtl)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isRtl ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                RTL
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Strip */}
          <div className="bg-slate-950/80 px-3 py-2 border-b border-slate-800/80 flex overflow-x-auto space-x-1.5 no-scrollbar text-[11px]">
            <button
              onClick={() => handleSendMessage('What is the price of daily boat diving?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 shrink-0 whitespace-nowrap transition cursor-pointer"
            >
              € Diving Prices
            </button>
            <button
              onClick={() => handleSendMessage('كم سعر رحلة الغوص اليومية؟')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 shrink-0 whitespace-nowrap transition cursor-pointer"
            >
              🇪🇬 بالعربية
            </button>
            <button
              onClick={() => handleSendMessage('Can children join the Dolphin House trip?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 shrink-0 whitespace-nowrap transition cursor-pointer"
            >
              🐬 Dolphin House
            </button>
          </div>

          {/* Messages Feed */}
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-slate-900 to-slate-950 text-xs"
          >
            {messages.map((m) => {
              const isAsst = m.role === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${
                    isAsst ? 'justify-start' : 'justify-end flex-row-reverse'
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                      isAsst ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isAsst ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  </div>

                  <div className={`max-w-[82%] space-y-1 ${isAsst ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed shadow-sm ${
                        isAsst
                          ? 'bg-slate-800/90 text-slate-200 border border-slate-700/70'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium'
                      }`}
                    >
                      {m.text}
                    </div>

                    <div className="flex items-center space-x-1.5 text-[9px] text-slate-500 px-1">
                      <span>{m.timestamp}</span>
                      {m.source && <span className="font-mono text-cyan-500">· {m.source}</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-2 text-xs text-cyan-400 py-1">
                <Bot className="h-4 w-4 animate-bounce" />
                <span className="animate-pulse">Checking verified facts...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Book Now Action Bar */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Ready to dive with us?</span>
            <button
              onClick={() => onOpenBooking()}
              className="flex items-center space-x-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[11px] font-bold shadow-sm transition cursor-pointer"
            >
              <Calendar className="h-3 w-3" />
              <span>Book Online</span>
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                dir={isRtl ? 'rtl' : 'ltr'}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRtl ? 'اكتب رسالتك هنا...' : 'Ask about prices, schedule, pickup...'}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-xl shadow-md transition cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
