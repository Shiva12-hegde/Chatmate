import React, { useState, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { startChatSession } from './services/geminiService';
import type { Message } from './types';
import { Role } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const session = startChatSession();
      setChat(session);
      setMessages([
        {
          role: Role.MODEL,
          content: "Hello! I'm Chatmate, your empathetic AI companion. How are you feeling today?",
        },
      ]);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to initialize AI session: ${e.message}. Please check your API key.`);
      } else {
        setError("An unknown error occurred during initialization.");
      }
      console.error(e);
    }
  }, []);

  const handleSendMessage = useCallback(async (newMessage: string) => {
    if (!chat || isLoading || !newMessage.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { role: Role.USER, content: newMessage };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Add a placeholder for the streaming response
    setMessages(prevMessages => [...prevMessages, { role: Role.MODEL, content: '' }]);

    try {
      const stream = await chat.sendMessageStream({ message: newMessage });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === Role.MODEL) {
            lastMessage.content += chunkText;
          }
          return newMessages;
        });
      }
    } catch (e) {
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      setError(errorMessage);
       setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === Role.MODEL && lastMessage.content === '') {
            lastMessage.content = errorMessage;
          } else {
             newMessages.push({ role: Role.MODEL, content: errorMessage });
          }
          return newMessages;
        });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header />
      <ChatWindow messages={messages} isLoading={isLoading} />
      {error && <div className="text-center text-red-500 dark:text-red-400 p-2 text-sm">{error}</div>}
       <div className="text-center text-xs text-slate-500 dark:text-slate-400 p-1">
        💡 Tip: Click the microphone to use voice input! You may need to grant permission.
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;