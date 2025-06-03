// chat.model.ts
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
    chatId: string;
}
export interface promptsLibrarylist {
    prompt: string;
}

