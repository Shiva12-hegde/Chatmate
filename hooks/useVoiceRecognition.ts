import { useState, useEffect, useRef, useCallback } from 'react';

// FIX: Add types for the Web Speech API to fix TypeScript errors.
// These types are necessary because they may not be included in all tsconfig lib options.
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

// Define the interface for the SpeechRecognition API for TypeScript
declare global {
  interface Window {
    // FIX: Use a constructor signature to avoid circular reference and type errors.
    SpeechRecognition: { new(): SpeechRecognition; };
    webkitSpeechRecognition: { new(): SpeechRecognition; };
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSupported = !!SpeechRecognition;

export const useVoiceRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  // FIX: Provide the correct type for the ref.
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isSupported) {
      setError("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // FIX: Use the correct event type 'SpeechRecognitionEvent'.
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
          setTranscript(prev => (prev ? prev + finalTranscript : finalTranscript).trim());
      }
    };
    
    // FIX: Use the correct event type 'SpeechRecognitionErrorEvent'.
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event);
        setError(`Error: ${event.error}. Please ensure microphone access is allowed.`);
        setIsRecording(false);
    };

    recognition.onend = () => {
      // FIX: Fix stale closure bug. The original check on `isRecording` would always be
      // false. Calling setIsRecording(false) ensures the state is correctly updated
      // when recognition ends for any reason (e.g., timeout).
      setIsRecording(false);
    };

    return () => {
      // FIX: Use the ref to access the recognition object in cleanup.
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecognition = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Could not start recognition:", e);
        setError("Could not start voice recognition.");
      }
    }
  }, [isRecording]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return { isRecording, transcript, error, isSupported, startRecognition, stopRecognition };
};
