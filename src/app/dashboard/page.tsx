"use client"
import { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Header } from "@/components/header"
import axios from "axios";

const BACKEND_URL = 'http://localhost:8080'; 

export default function AIChat() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('United States');
  const [showCompareForm, setShowCompareForm] = useState(false);
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  type ChatMessage = {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    action?: string;
  };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const countries = [
    'United States', 'India', 'United Kingdom', 'China', 'Japan', 'Germany',
    'Canada', 'Australia', 'Brazil', 'South Africa', 'Singapore', 'United Arab Emirates'
  ];

  useEffect(() => {
    fetchChatHistory();
  }, []);


  useEffect(() => {
    console.log('Messages state updated:', messages);
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/chats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJkMjg2YTk2Yy00ZjU2LTRmYmMtYWEyMS1kN2RhZGNlYWZjYTAiLCJpYXQiOjE3NTgxMzY4MjJ9.69WNiS6khu6T4MxEusi508JNhb6dsuNUw780FqxUaGg'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();

      // Transform backend data to display format
      const formattedMessages:any = [];
      if (data.chats && Array.isArray(data.chats)) {
        data.chats.forEach((chat: { id: any; prompt: any; created_at: string | number | Date; action: any; response: any; updated_at: string | number | Date; }) => {
          // Add user message
          formattedMessages.push({
            id: `${chat.id}-user`,
            type: 'user',
            content: chat.prompt,
            timestamp: new Date(chat.created_at),
            action: chat.action
          });

          // Add bot response
          formattedMessages.push({
            id: `${chat.id}-bot`,
            type: 'bot',
            content: chat.response,
            timestamp: new Date(chat.updated_at),
            action: chat.action
          });
        });
      }

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);

      // Set a default welcome message if fetch fails
      setMessages([{
        id: 'welcome',
        type: 'bot',
        content: "Hello! I'm your AI trading assistant. I can help you analyze stocks, suggest trades, and answer market questions. What would you like to know?",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (userMessage:any) => {
    try {
      setSending(true);

      // First, analyze the prompt
      const analyzeResponse = await fetch(`${BACKEND_URL}/prompt/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userMessage
        })
      });

      if (!analyzeResponse.ok) {
        throw new Error('Failed to analyze prompt');
      }

      const analyzeData = await analyzeResponse.json();
      const action = analyzeData.res;

      // Then generate the response
      const generateResponse = await fetch(`${BACKEND_URL}/template/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJkMjg2YTk2Yy00ZjU2LTRmYmMtYWEyMS1kN2RhZGNlYWZjYTAiLCJpYXQiOjE3NTgxMzY4MjJ9.69WNiS6khu6T4MxEusi508JNhb6dsuNUw780FqxUaGg'
        },
        body: JSON.stringify({
          prompt: userMessage,
          action: action
        })
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate response');
      }

      const generateData = await generateResponse.json();

      console.log('Generate Data:', generateData);

      // Extract the response content based on the actual structure
      let responseContent = "I've processed your request. Please check for any updates.";
      
      if (generateData.stock_report) {
        responseContent = generateData.stock_report;
      } else if (generateData.portfolio_report) {
        responseContent = generateData.portfolio_report;
      } else if (generateData.message) {
        responseContent = generateData.message;
      } else if (typeof generateData === 'string') {
        responseContent = generateData;
      }

      // Add AI response to messages
      const aiResponse: ChatMessage = {
        id: `response-${Date.now()}`,
        type: 'bot',
        content: responseContent,
        timestamp: new Date(),
        action: action
      };

      setMessages(prev => {
        const newMessages = [...prev, aiResponse];
        console.log('Updated messages:', newMessages);
        return newMessages;
      });
      
      // Force re-render
      setForceUpdate(prev => prev + 1);

      // Optionally refresh chat history to ensure sync with backend
      // await fetchChatHistory();

    } catch (error) {
      console.error('Error sending request:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: "I apologize, but I encountered an error processing your request. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  const sendUserMessage = async (text: string) => {
    if (!text.trim() || sending) return;
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setForceUpdate(prev => prev + 1);
    await sendRequest(text);
  };

  const handleSendMessage = async (e:any) => {
    e.preventDefault();
    const currentMessage = message;
    setMessage('');
    await sendUserMessage(currentMessage);
  };

  const handleQuickPrompt = async (prompt: string) => {
    await sendUserMessage(prompt);
  };

  const handleStockCompareSubmit = async () => {
    const a = compareA.trim().toUpperCase();
    const b = compareB.trim().toUpperCase();
    if (!a || !b || a === b) return;
    setShowCompareForm(false);
    setCompareA('');
    setCompareB('');
    const prompt = `Compare two stocks: ${a} vs ${b} over 1 year. Include revenue growth, margins, valuation (P/E, EV/EBITDA), price performance, volatility, and a concise verdict.`;
    await handleQuickPrompt(prompt);
  };


  const getActionBadge = (action: string) => {
    if (!action) return null;

    const actionColors: { [key: string]: string } = {
      'place order': 'bg-green-600',
      'analyze stock': 'bg-blue-600',
      'analyze portfolio': 'bg-purple-600',
      'cancel order': 'bg-red-600'
    };

    const color = actionColors[action as keyof typeof actionColors] || 'bg-gray-600';

    return (
      <span className={`inline-block px-2 py-1 text-xs rounded-full ${color} text-white mb-2`}>
        {action}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="dark-card h-[600px] flex items-center justify-center m-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">Loading chat history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="flex flex-col h-screen">
    <Header />
    <div className="dark-card flex flex-col flex-1 m-6">
      {/* Chat Header removed per request */}

      {/* Messages Container */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm" key={forceUpdate}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <p className="text-lg">Start a conversation by typing a message below</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isLongAIResponse = msg.type === 'bot' && (msg.action === 'analyze stock' || msg.action === 'analyze portfolio') && msg.content.length > 500;
            const isExpanded = expandedIds.includes(msg.id);
            return (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${msg.type === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    {msg.type === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                  </div>
                  <div className={`p-4 rounded-lg ${msg.type === 'user' ? 'bg-blue-600/60 text-white' : 'bg-gray-800/50 text-gray-100'} backdrop-blur-md shadow-md border border-white/10`}>
                    {msg.action && msg.type === 'bot' && getActionBadge(msg.action)}
                    <p className="text-sm whitespace-pre-line">
                      {isLongAIResponse && !isExpanded
                        ? msg.content.substring(0, 497) + '...'
                        : msg.content}
                    </p>
                    {isLongAIResponse && (
                      <button
                        className="text-xs text-blue-400 underline mt-2 focus:outline-none hover:text-blue-300 transition-colors"
                        onClick={() => {
                          setExpandedIds((prev) =>
                            isExpanded
                              ? prev.filter((id) => id !== msg.id)
                              : [...prev, msg.id]
                          );
                        }}
                      >
                        {isExpanded ? 'See less' : 'See more'}
                      </button>
                    )}
                    <p className="text-xs mt-2 opacity-70">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Show sending indicator */}
        {sending && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-[80%]">
              <div className="p-2 rounded-full bg-gray-700">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-md shadow-md border border-white/10">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span className="text-sm text-gray-400">Processing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions above input (separate) */}
      <div className="p-6">
        <div className="bg-black text-white border border-white/10 rounded-xl px-4 py-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              className="rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-colors duration-200 bg-black text-white border border-white/20 hover:bg-white hover:text-black cursor-pointer"
              disabled={sending}
              onClick={() => handleQuickPrompt('Summarize today\'s top world market news in 10 concise bullet points with tickers if relevant.')}
            >
              World News
            </button>
            <button
              className="rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-colors duration-200 bg-black text-white border border-white/20 hover:bg-white hover:text-black cursor-pointer"
              disabled={sending}
              onClick={() => handleQuickPrompt('List 5 current mega trends impacting global markets, each with a brief explanation and 2-3 representative tickers.')}
            >
              Mega Trend
            </button>
            <button
              className="rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-colors duration-200 bg-black text-white border border-white/20 hover:bg-white hover:text-black cursor-pointer"
              disabled={sending}
              onClick={() => handleQuickPrompt('Which major FX pairs show the strongest momentum this week? Provide brief technical and macro context and 1 risk per idea.')}
            >
              Best Currency
            </button>
            <div className="relative">
              <button
                type="button"
                className="rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-colors duration-200 bg-black text-white border border-white/20 hover:bg-white hover:text-black cursor-pointer"
                disabled={sending}
                onClick={() => setShowCountryDropdown(v => !v)}
              >
                Country Economic Cycle
              </button>
              {showCountryDropdown && (
                <div className="absolute mt-2 bg-gray-800 border border-gray-700 rounded-md p-2 z-20 max-h-64 overflow-y-auto w-64">
                  {countries.map((c) => (
                    <button
                      key={c}
                      className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700 text-gray-100"
                      onClick={() => {
                        setSelectedCountry(c);
                        setShowCountryDropdown(false);
                        handleQuickPrompt(`Analyze the current economic cycle position of ${c}. Include GDP trend, inflation, rates, PMI, employment, and likely equity/FX/bond implications in brief bullets.`);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className="rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-colors duration-200 bg-black text-white border border-white/20 hover:bg-white hover:text-black cursor-pointer"
                disabled={sending}
                onClick={() => setShowCompareForm(v => !v)}
              >
                Stock Comparison
              </button>
              {showCompareForm && (
                <div className="absolute mt-2 bg-gray-800 border border-gray-700 rounded-lg p-3 z-20 w-[340px] shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      value={compareA}
                      onChange={(e) => setCompareA(e.target.value)}
                      placeholder="Ticker 1 (e.g., AAPL)"
                      className="input-field flex-1"
                      disabled={sending}
                    />
                    <input
                      value={compareB}
                      onChange={(e) => setCompareB(e.target.value)}
                      placeholder="Ticker 2 (e.g., MSFT)"
                      className="input-field flex-1"
                      disabled={sending}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      className="rounded-full px-4 py-2 bg-black text-white border border-white/20 hover:bg-black/90"
                      onClick={() => setShowCompareForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-full px-4 py-2 bg-black text-white border border-white/20 hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={sending || !compareA.trim() || !compareB.trim() || compareA.trim().toUpperCase() === compareB.trim().toUpperCase()}
                      onClick={handleStockCompareSubmit}
                    >
                      Compare
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              className="rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-colors duration-200 bg-black text-white border border-white/20 hover:bg-white hover:text-black cursor-pointer"
              disabled={sending}
              onClick={() => handleQuickPrompt('List upcoming IPO/stock listings over the next 2 weeks with exchange, expected size (if available), sector, and a one-line thesis.')}
            >
              Upcoming Listings
            </button>
          </div>
        </div>
      </div>

      {/* Input - sticks to bottom */}
      <div className="p-6 border-t border-gray-800 sticky bottom-0 bg-gray-900 z-10">

        {/* Input */}
        <div className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Ask about stocks, market trends, or trading strategies..."
            className="input-field flex-1"
            disabled={sending}
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !message.trim()}
            className="primary-button disabled:opacity-50 disabled:cursor-not-allowed p-3"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}