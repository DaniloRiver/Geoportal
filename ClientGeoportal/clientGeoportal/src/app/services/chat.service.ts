import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private state: any = {}; // Estado interno para seguimiento de la conversación

  constructor(private http: HttpClient) {}

async sendMessage(message: string) {
  // Si es la primera llamada y mensaje vacío, inicializamos estado para que backend responda con bienvenida
  if (!message.trim() && Object.keys(this.state).length === 0) {
    this.state = { next: 'inicio' };
  }

  console.log('Enviando al backend:', { message, state: this.state });

  const payload = { message, state: this.state };

  const res = await lastValueFrom(this.http.post<any>('http://localhost:8000/chat', payload));

  if (res && res.state && typeof res.state === 'object') {
    console.log('Estado recibido:', res.state);
    this.state = res.state;
  } else {
    console.warn('Estado inválido recibido, reseteando estado.');
    this.resetState();
  }

  return res;
}

  resetState() {
    this.state = {};
  }
}
