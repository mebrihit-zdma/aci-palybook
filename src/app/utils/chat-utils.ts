// chat-utils.ts
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { AnswerSource } from '../models/chat.model';

export function extractAnswerText(raw: string): string {
  const match = raw.match(/<answer>([\s\S]*?)<\/answer>/);
  return match ? match[1].trim() : '';
}
export function extractfollowUpQuestions(raw: string): string {
  const match = raw.match(/<follow_up_questions>([\s\S]*?)<\/follow_up_questions>/);
  return match ? match[1].trim() : '';
}
export async function convertMarkdown(md: string, sanitizer: DomSanitizer): Promise<SafeHtml> {
  const html = await marked(md || '');
  return sanitizer.bypassSecurityTrustHtml(html);
}

export function extractSources(raw: string): AnswerSource[] {
  const sourcePattern = /- \*\*File Name:\*\* (.+?)\s+\*\*Page Number:\*\* (.+?)\s+\*\*URL:\*\* ([^\s]+)/g;
  const matches = [...raw.matchAll(sourcePattern)];

  return matches.map(m => ({
    fileName: m[1],
    pageNumber: m[2],
    url: m[3]
  }));
}

// export function extractResponseSources(markdown: string): { label: string; url: string; pageNumber?: number }[] {
//   const regex = /\[(.*?)\]\((https?:\/\/.*?)\)/g;
//   const sources: { label: string; url: string; pageNumber?: number }[] = [];

//   let match;
//   while ((match = regex.exec(markdown)) !== null) {
//     sources.push({ label: match[1], url: match[2] });
//   }

//   return sources;
// }
export function extractResponseSources(markdown: string): { label: string; url: string; page?: number }[] {
  const regex = /\[(.*?)\]\((https?:\/\/.*?)\)/g;
  const sources: { label: string; url: string; page?: number }[] = [];

  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const fullLabel = match[1]; 
    const url = match[2];

    let label = fullLabel.trim();
    let page: number | undefined = undefined;

    // Extract page if format contains "| Page: xxx"
    const pipeParts = fullLabel.split('|');
    if (pipeParts.length === 2) {
      label = pipeParts[0].trim();

      const pageMatch = pipeParts[1].match(/Page:\s*(\d+)/i);
      if (pageMatch) {
        page = parseInt(pageMatch[1], 10);
      }
    }

    sources.push({ label, url, page });
  }

  return sources;
}


