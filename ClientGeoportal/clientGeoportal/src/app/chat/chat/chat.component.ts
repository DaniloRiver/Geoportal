import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  time: string;
  status?: '✓' | '✓✓' | '✓✓ azul';
  urls?: string[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  isOpen = false;
  userMessage = '';
  messages: ChatMessage[] = [];
  isLoading = false;


  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.messages = [];
      this.chatService.resetState(); // Resetea estado al cerrar chat
    } else if (this.messages.length === 0) {
      this.startChat();
    }
  }

async startChat() {
  this.isLoading = true;
  try {
    // Envía un mensaje vacío para que el backend inicie el flujo y envíe la primera pregunta
    const res = await this.chatService.sendMessage('');
    this.messages.push({
      from: 'bot',
      text: res.response,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (error) {
    this.messages.push({
      from: 'bot',
      text: 'Error al iniciar el chat.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }
  this.isLoading = false;
}


  async sendMessage() {
    const msg = this.userMessage.trim();
    if (!msg) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Añade mensaje del usuario al chat
    this.messages.push({
      from: 'user',
      text: msg,
      time: now,
      status: '✓'
    });

    this.isLoading = true;

    try {
      // Enviar mensaje y esperar respuesta del backend
      const res = await this.chatService.sendMessage(msg);

      // Agrega respuesta del bot
      this.messages.push({
        from: 'bot',
        text: res.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        urls: res.urls || []
      });

      // Actualiza el último mensaje de usuario como leído (doble check)
      const lastUserMessage = [...this.messages].reverse().find(m => m.from === 'user');
      if (lastUserMessage) lastUserMessage.status = '✓✓';

      // Opcional: si backend devuelve URLs de mapas, podrías mostrarlos aquí o abrir en otra sección

    } catch (error) {
      this.messages.push({
        from: 'bot',
        text: 'Error al obtener respuesta del servidor.',
        time: now
      });
    }

    this.userMessage = '';
    this.isLoading = false;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch {
      // no hacer nada si falla
    }
  }
}
