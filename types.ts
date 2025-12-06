export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string;
  isThinking?: boolean;
}

export interface ThesisSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
}

export interface GeminiConfig {
  useThinking: boolean;
}