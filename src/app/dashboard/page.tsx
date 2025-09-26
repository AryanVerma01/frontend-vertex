"use client"
import { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
// import Header from './Header';


const BACKEND_URL = 'http://localhost:3000'; 

export default function AIChat() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
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

  const handleSendMessage = async (e:any) => {
    e.preventDefault();
    if (message.trim() && !sending) {
      // Add user message immediately
      const newMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Force re-render
      setForceUpdate(prev => prev + 1);

      // Store message before clearing
      const currentMessage = message;
      setMessage('');

      // Send request to backend
      await sendRequest(currentMessage);
    }
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
        {/* <Header /> */}
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
    {/* <Header /> */}
    <div className="dark-card flex flex-col flex-1 m-6">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">AI Trading Assistant</h3>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4" key={forceUpdate}>
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
                  <div className={`p-4 rounded-lg ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
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
              <div className="p-4 rounded-lg bg-gray-800">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span className="text-sm text-gray-400">Processing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form - sticks to bottom */}
      <div className="p-6 border-t border-gray-800 sticky bottom-0 bg-gray-900 z-10">
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