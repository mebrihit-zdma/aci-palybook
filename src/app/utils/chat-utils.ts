// chat-utils.ts
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { AnswerSource } from '../models/chat.model';

export function extractAnswerText(raw: string): string {
  const match = raw.match(/<answer>([\s\S]*?)<\/answer>/);
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
