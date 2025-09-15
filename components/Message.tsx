import React from 'react';
import type { Message as MessageType } from '../types';
import { Role } from '../types';

interface MessageProps {
  message: MessageType;
}

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
  </svg>
);

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const wrapperClasses = isUser ? 'flex justify-end items-start gap-3' : 'flex justify-start items-start gap-3';
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white rounded-xl rounded-br-none'
    : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-xl rounded-bl-none';
  
  // A simple markdown-like renderer for bold text
  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // Render newlines
      return part.split('\n').map((line, j) => (
        <React.Fragment key={`${i}-${j}`}>
          {line}
          {j < part.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  return (
    <div className={wrapperClasses}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-md">
          <BotIcon className="w-5 h-5 text-blue-600 dark:text-blue-500" />
        </div>
      )}
      <div className={`${bubbleClasses} p-4 max-w-xl prose dark:prose-invert prose-p:my-0 prose-strong:text-white dark:prose-strong:text-slate-50 shadow-md`}>
        {renderContent(message.content)}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-md">
          <UserIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </div>
      )}
    </div>
  );
};