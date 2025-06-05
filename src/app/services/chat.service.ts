import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import type { Observable } from "rxjs";
import { UserLocalService } from "./user-local.service"; // Utiliser votre service
import { Chat } from "@/model/chat.model";
import { Message } from "@/model/message.model";
import { Environment } from "environments/environment";

@Injectable({ providedIn: "root" })
export class ChatService {
  private apiUrl = Environment.apiUrl; // Remplacez par votre URL d'API
  private userService = inject(UserLocalService);

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.userService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/chats`, {
      headers: this.getAuthHeaders(),
    });
  }

  createChat(data: { type: string; user_ids: number[]; name?: string }): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}/chats`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getMessages(chatId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/chats/${chatId}/messages`, {
      headers: this.getAuthHeaders(),
    });
  }

  sendMessage(chatId: number, message: string): Observable<Message> {
    return this.http.post<Message>(
      `${this.apiUrl}/messages`,
      { chat_id: chatId, message },
      { headers: this.getAuthHeaders() }
    );
  }

  getCurrentUser() {
    return this.userService.getUser();
  }
}
