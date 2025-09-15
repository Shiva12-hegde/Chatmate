import React from 'react';
import { ThemeToggle } from './ThemeToggle';

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 6 5.7V4.5A2.5 2.5 0 0 1 8.5 2h1Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v1.2a2.5 2.5 0 0 0 2.5 2.5h1A2.5 2.5 0 0 0 18 5.7V4.5A2.5 2.5 0 0 0 15.5 2h-1Z" />
    <path d="M6 10a2.5 2.5 0 0 1 2.5 2.5v4.3a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 2.5 17v-4.3A2.5 2.5 0 0 1 5 10h1Z" />
    <path d="M18 10a2.5 2.5 0 0 0-2.5 2.5v4.3a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5v-4.3A2.5 2.5 0 0 0 19 10h-1Z" />
    <path d="M12 7.2a2.5 2.5 0 0 1 2.5 2.5v7.6a2.5 2.5 0 0 1-2.5 2.5h0a2.5 2.5 0 0 1-2.5-2.5V9.7a2.5 2.5 0 0 1 2.5-2.5h0Z" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-xl p-4 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrainIcon className="text-blue-600 dark:text-blue-500" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Chatmate
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};