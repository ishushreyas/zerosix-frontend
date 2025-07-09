import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send, Smile } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws');

    ws.current.onopen = () => {
      console.log('connected');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onclose = () => {
      console.log('disconnected');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      text: newMessage,
      sender: user.uid,
      time: new Date().toISOString(),
    };

    ws.current.send(JSON.stringify(message));
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-12rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Messages
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Stay connected with your team
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <Smile className="h-8 w-8 text-white" />
              </div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm mt-1">Start a conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === user.uid ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.sender === user.uid 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-2 ${
                  msg.sender === user.uid 
                    ? 'text-blue-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {new Date(msg.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="relative">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border-none bg-transparent focus:ring-0 focus:ring-offset-0 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <Button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-600 dark:disabled:to-gray-600 text-white rounded-xl px-4 py-2 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:transform-none shadow-lg shadow-blue-500/25 disabled:shadow-none"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;