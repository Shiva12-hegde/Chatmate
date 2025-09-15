import React, { useState, useEffect } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const { 
    isRecording, 
    transcript, 
    isSupported, 
    startRecognition, 
    stopRecognition,
    error: voiceError,
  } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRecognition();
    }
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="p-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="container mx-auto flex items-center gap-3">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Listening..." : "Share your thoughts..."}
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none resize-none transition-all duration-200 disabled:opacity-50 custom-scrollbar"
        />
        {isSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            className={`p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-black disabled:opacity-50 ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse focus:ring-red-500'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-blue-500'
            }`}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-blue-600 focus:outline-none"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
       {voiceError && <p className="text-xs text-red-500 text-center mt-1">{voiceError}</p>}
    </div>
  );
};