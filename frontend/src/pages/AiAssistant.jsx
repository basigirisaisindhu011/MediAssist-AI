import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import aiService from '../services/aiService';
import {
  Sparkles,
  Send,
  Trash2,
  Bot,
  User,
  ShieldAlert,
  Loader2,
  HelpCircle
} from 'lucide-react';

export const AiAssistant = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'initial-1',
      sender: 'ai',
      text: `Hello ${user?.name || 'there'}! I am your MediAssist AI Health Assistant. How can I help you understand symptoms, interpret medical terms, or manage your wellness goals today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const suggestedQuestions = [
    'What are early warning signs of high blood pressure?',
    'How can I improve my sleep quality naturally?',
    'What should I eat for cardiovascular health?',
    'When should I see a doctor for a persistent cough?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const msgCounterRef = useRef(100);
  const generateId = (prefix) => {
    msgCounterRef.current += 1;
    return `${prefix}-${msgCounterRef.current}`;
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: generateId('user'),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await aiService.askAssistant(query);
      const aiMsg = {
        id: generateId('ai'),
        sender: 'ai',
        text: res.reply || res.message || 'I have processed your query. Please consult a clinician for specific medical concerns.',
        timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg = {
        id: generateId('error'),
        sender: 'ai',
        text: 'I encountered an issue retrieving clinical insights. Please check your network connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: generateId('reset'),
        sender: 'ai',
        text: 'Conversation history cleared. How can I assist you with your health today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-7.5rem)] flex flex-col space-y-4">
      {/* Header Bar */}
      <div className="glass-panel p-5 bg-gradient-to-r from-sky-600/90 via-teal-600/90 to-indigo-600/90 text-white rounded-2xl shadow-xl flex items-center justify-between shrink-0 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                AI Health Assistant
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/30 text-teal-100 border border-teal-300/30">
                24/7 Active
              </span>
            </div>
            <p className="text-sky-100 text-xs sm:text-sm">
              Conversational clinical intelligence & health guidance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          title="Clear Conversation"
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center space-x-1 text-xs font-semibold"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="glass-card flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col space-y-4 border border-slate-800 rounded-2xl shadow-lg">
        {/* Messages List */}
        <div className="flex-1 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 animate-fade-in ${
                  isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-tr from-sky-600 to-indigo-600 text-white'
                      : 'bg-gradient-to-tr from-teal-500 to-emerald-600 text-white'
                  }`}
                >
                  {isUser ? (
                    user?.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-4 h-4" />
                    )
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-sky-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-900/90 text-slate-100 rounded-tl-none border border-slate-800 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900 text-slate-400 text-xs flex items-center space-x-2 border border-slate-800">
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>MediAssist AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Pills */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-2 font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-full text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="glass-card p-3 flex items-center space-x-2 border border-slate-800 rounded-2xl shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask MediAssist AI anything about symptoms, medication, or vitals..."
          className="flex-1 px-4 py-2.5 bg-transparent text-slate-100 text-sm focus:outline-none placeholder-slate-500"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-3 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Mandatory Clinical Disclaimer */}
      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center space-x-2 shrink-0">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          MediAssist AI outputs are for informational health support and do not replace professional medical advice.
        </span>
      </div>
    </div>
  );
};

export default AiAssistant;
