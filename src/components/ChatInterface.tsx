import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  sqlQuery?: string;
}

interface ChatInterfaceProps {
  onSQLGenerated: (query: string, description: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSQLGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm ready to help you analyze your Excel data and generate SQL queries. Try asking me about your data or request specific test scenarios!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateSQLResponse = (userMessage: string) => {
    const scenarios = [
      {
        trigger: ['select', 'all', 'data', 'records'],
        query: 'SELECT * FROM user_data ORDER BY created_date DESC;',
        description: 'This query retrieves all records from your dataset, ordered by creation date.'
      },
      {
        trigger: ['count', 'total', 'number'],
        query: 'SELECT COUNT(*) as total_records FROM user_data WHERE status = "active";',
        description: 'This query counts all active records in your dataset.'
      },
      {
        trigger: ['average', 'avg', 'mean'],
        query: 'SELECT AVG(amount) as average_amount FROM user_data WHERE amount > 0;',
        description: 'This calculates the average amount from non-zero values.'
      },
      {
        trigger: ['group', 'category', 'breakdown'],
        query: 'SELECT category, COUNT(*) as count, SUM(amount) as total FROM user_data GROUP BY category ORDER BY total DESC;',
        description: 'This groups your data by category with counts and totals.'
      },
      {
        trigger: ['duplicate', 'duplicate records'],
        query: 'SELECT email, COUNT(*) as duplicates FROM user_data GROUP BY email HAVING COUNT(*) > 1;',
        description: 'This finds duplicate records based on email address.'
      }
    ];

    const matchedScenario = scenarios.find(scenario =>
      scenario.trigger.some(trigger => userMessage.toLowerCase().includes(trigger))
    );

    return matchedScenario || {
      query: 'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = "user_data";',
      description: 'This query shows the structure of your data table.'
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const sqlResponse = generateSQLResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Based on your request, I've generated a SQL query for you. ${sqlResponse.description}`,
        timestamp: new Date(),
        sqlQuery: sqlResponse.query
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Send SQL to parent component
      onSQLGenerated(sqlResponse.query, sqlResponse.description);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQueries = [
    "Show me all the data",
    "Count total records",
    "Find duplicates",
    "Group by category",
    "Calculate averages"
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-xs lg:max-w-md space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div className={`rounded-2xl px-4 py-2 ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                {message.sqlQuery && (
                  <div className="mt-2 p-2 bg-gray-800 rounded-lg">
                    <code className="text-xs text-green-400 font-mono">{message.sqlQuery}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested queries */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Try asking:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => setInputValue(query)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors duration-200"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your data or request SQL queries..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};