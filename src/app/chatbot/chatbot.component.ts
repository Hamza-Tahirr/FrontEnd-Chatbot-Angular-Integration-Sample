import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Replace with the URL of your deployed Dialogflow gateway function
const dialogflowURL = 'https://YOUR-CLOUDFUNCTION/dialogflowGateway';

interface ChatMessage {
  text: string;
  sender: string;
  reply: boolean;
  avatar: string;
  date: Date;
}

interface DialogflowResponse {
  fulfillmentText: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  messages: ChatMessage[] = [];
  loading = false;
  botAvatar = '/assets/bot.jpeg';

  // Random ID to maintain session with server
  sessionId = Math.random().toString(36).slice(-5);

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.addBotMessage('Human presence detected. How can I help you?');
  }

  handleUserMessage(event: { message: string }): void {
    const text = event.message;
    this.addUserMessage(text);

    this.loading = true;

    this.http.post<DialogflowResponse>(
      dialogflowURL,
      {
        sessionId: this.sessionId,
        queryInput: {
          text: {
            text,
            languageCode: 'en-US'
          }
        }
      }
    )
    .subscribe({
      next: res => {
        this.addBotMessage(res.fulfillmentText);
        this.loading = false;
      },
      error: () => {
        this.addBotMessage('Sorry, I could not reach the server. Please try again.');
        this.loading = false;
      }
    });
  }

  addUserMessage(text: string): void {
    this.messages.push({
      text,
      sender: 'You',
      reply: true,
      avatar: '',
      date: new Date()
    });
  }

  addBotMessage(text: string): void {
    this.messages.push({
      text,
      sender: 'Bot',
      reply: false,
      avatar: this.botAvatar,
      date: new Date()
    });
  }

}
