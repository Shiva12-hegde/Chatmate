import React, { useRef, useEffect } from 'react';
import { Message as MessageComponent } from './Message';
import type { Message } from '../types';
import { Role } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse"></div>
  </div>
);

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
      {messages.map((msg, index) => (
        <MessageComponent key={index} message={msg} />
      ))}
      {isLoading && messages[messages.length - 1]?.role === Role.USER && (
         <div className="flex justify-start">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl rounded-bl-none p-3 max-w-lg inline-block shadow-md">
            <TypingIndicator />
          </div>
        </div>
      )}
    </div>
  );
};
