import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  OnChanges,
  SimpleChanges,
  inject,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Subject, takeUntil } from "rxjs"
import { ChatService } from "../../services/chat.service"
import { UserLocalService } from "../../services/user-local.service"
import { AuthenticatedUser } from "@/model/auth"
import { Message } from "@/model/message.model"
import { Chat } from "@/model/chat.model"

interface MessageGroup {
  sender: AuthenticatedUser
  messages: Message[]
  isOwn: boolean
}

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./chat.component.html",
  styleUrl: "./chat.component.css",
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges {
  @Input() selectedChat: Chat | null = null
  @ViewChild("messagesContainer") messagesContainer?: ElementRef
  @ViewChild("messageInput") messageInput?: ElementRef

  private chatService = inject(ChatService)
  private userService = inject(UserLocalService)

  messages: Message[] = []
  newMessage = ""
  isLoadingMessages = false
  isSending = false
  error: string | null = null

  // Typing indicator
  isTyping = false
  typingUser = ""
  typingUserName = ""
  private typingTimeout?: any

  private destroy$ = new Subject<void>()
  private shouldScrollToBottom = false
  private currentUser: AuthenticatedUser | null = null

  ngOnInit() {
    this.currentUser = this.userService.getUser()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["selectedChat"] && this.selectedChat) {
      this.loadMessages()
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom()
      this.shouldScrollToBottom = false
    }
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }
  }

  loadMessages() {
    if (!this.selectedChat) return

    this.isLoadingMessages = true
    this.error = null

    this.chatService
      .getMessages(this.selectedChat.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.messages = response.data || response
          this.isLoadingMessages = false
          this.shouldScrollToBottom = true
        },
        error: (error) => {
          console.error("Erreur lors du chargement des messages:", error)
          this.error = "Impossible de charger les messages"
          this.isLoadingMessages = false
        },
      })
  }

  sendMessage() {
    if (!this.canSendMessage()) return

    const messageText = this.newMessage.trim()
    this.newMessage = ""
    this.isSending = true

    this.chatService
      .sendMessage(this.selectedChat!.id, messageText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const newMessage = response.data || response
          this.messages.push(newMessage)
          this.isSending = false
          this.shouldScrollToBottom = true
          this.focusInput()
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi du message:", error)
          this.error = "Impossible d'envoyer le message"
          this.newMessage = messageText // Restaurer le message
          this.isSending = false
        },
      })
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      this.sendMessage()
    }
  }

  onTyping() {
    // TODO: Implémenter via WebSocket ou SignalR
  }

  canSendMessage(): boolean {
    return !!(this.newMessage.trim() && this.selectedChat && !this.isSending)
  }

  get groupedMessages(): MessageGroup[] {
    const groups: MessageGroup[] = []
    let currentGroup: MessageGroup | null = null

    for (const message of this.messages) {
      const isOwn = this.isOwnMessage(message)

      if (
        !currentGroup ||
        currentGroup.sender.id !== message.sender.id ||
        this.shouldStartNewGroup(currentGroup.messages.at(-1)!, message)
      ) {
        currentGroup = {
          sender: message.sender as AuthenticatedUser,
          messages: [message],
          isOwn,
        }
        groups.push(currentGroup)
      } else {
        currentGroup.messages.push(message)
      }
    }

    return groups
  }

  private shouldStartNewGroup(lastMessage: Message, currentMessage: Message): boolean {
    const timeDiff = new Date(currentMessage.created_at).getTime() - new Date(lastMessage.created_at).getTime()
    return timeDiff > 5 * 60 * 1000 // 5 minutes
  }

  isOwnMessage(message: Message): boolean {
    return this.currentUser ? message.sender_id === this.currentUser.id : false
  }

  getChatDisplayName(chat: Chat): string {
    if (chat.name) return chat.name
    if (chat.type === "private") {
      const otherUser = chat.users.find((u) => u.id !== this.currentUser?.id)
      return otherUser?.name || "Utilisateur"
    }
    return "Conversation"
  }

  getChatInitials(chat: Chat): string {
    return this.initialsFromName(this.getChatDisplayName(chat))
  }

  getUserInitials(user: AuthenticatedUser): string {
    return this.initialsFromName(user?.name ?? "U")
  }

  private initialsFromName(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("fr-FR", { weekday: "short" })
    } else {
      return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    }
  }

  private scrollToBottom(): void {
    const element = this.messagesContainer?.nativeElement
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }

  private focusInput(): void {
    setTimeout(() => {
      this.messageInput?.nativeElement?.focus()
    }, 100)
  }

  trackByMessage(index: number, message: Message): number {
    return message.id
  }

  trackByMessageGroup(index: number, group: MessageGroup): string {
    return `${group.sender.id}-${group.messages[0].id}`
  }
}
