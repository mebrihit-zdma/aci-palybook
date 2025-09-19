import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  constructor() { }

  streamChatResponse(payload: any, onChunk: (chunk: string) => void, onDone: () => void, onError: (err: any) => void): void {
    fetch('https://aci-playbook-peerai.azurewebsites.net/api/v1/chat_stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        if (!response.body) {
          throw new Error('Response body is null');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        
        const readChunk = (): void => {
          reader.read().then(({ done, value }) => {
            if (done) {
              onDone();
              return;
            }

            try {
              const chunk = decoder.decode(value, { stream: true });
              if (chunk.trim()) { // Only process non-empty chunks
                onChunk(chunk);
              }
              readChunk();
            } catch (decodeError) {
              console.error('Error decoding chunk:', decodeError);
              onError(decodeError);
            }
          }).catch(readError => {
            console.error('Error reading chunk:', readError);
            onError(readError);
          });
        };

        readChunk();
      })
      .catch(fetchError => {
        console.error('Fetch error:', fetchError);
        onError(fetchError);
      });
  }
}
