
import { GoogleGenAI, Chat } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const startChatSession = (): Chat => {
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
      topP: 0.95,
    },
  });
  return chat;
};
