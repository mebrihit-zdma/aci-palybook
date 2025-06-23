// chat.model.ts
export interface ResponseSource {
    label: string;
    url: string;
}
export interface ChatResponse {
    question: string; 
    answer: any;
    sources?: ResponseSource[];
    loading?: boolean;
}
export interface ResponseMessage {
    sender: 'bot' | 'user';
    text: any;
    sources?: ResponseSource[];
    loading?: boolean;
}
export interface AnswerSource {
    fileName: string;
    pageNumber: string;
    url: string;
}
export interface ChatMessage {
    sender: 'bot' | 'user';
    text: any;
    sources?: AnswerSource[];
    loading?: boolean;
}

export interface ChatHistory {
    question: string;
    chatId: string;
}
export interface SavedChats {
    question: string;
    sessionId: string;
}
export interface promptsLibrarylist {
    prompt: string;
}
export interface ChatSessions {
    session_id: string;
    summary:string;
}

