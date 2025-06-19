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
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        const readChunk = () => {
          reader?.read().then(({ done, value }) => {
            if (done) {
              onDone();
              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
            readChunk();
          });
        };

        readChunk();
      })
      .catch(onError);
  }
}
