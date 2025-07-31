import {
  Component,
  type OnInit,
  type OnDestroy,
  ViewChild,
  type ElementRef,
  type AfterViewChecked,
  inject,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import {ActivatedRoute, Router, RouterLink} from "@angular/router"
import { Subject, takeUntil, interval } from "rxjs"
import { ChatService } from "../../services/chat.service"
import { UserLocalService } from "../../services/user-local.service"
import { AuthenticatedUser } from "@/model/auth"
import { Chat } from "@/model/chat.model"
import { ChatType, Message } from "@/model/message.model"


@Component({
  selector: "app-message",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./message.component.html",
  styleUrl: "./message.component.css",
})
export class MessageComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild("messagesContainer") messagesContainer!: ElementRef

  private chatService = inject(ChatService)
  private userService = inject(UserLocalService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  chats: Chat[] = []
  selectedChat: Chat | null = null
  messages: Message[] = []
  newMessage = ""
  isLoading = false
  isLoadingMessages = false
  isLoadingChats = false
  error: string | null = null
  searchQuery = ""
  activeTab: "all" | "unread" | "projects" = "all"
  currentUser: AuthenticatedUser | null = null

  private destroy$ = new Subject<void>()
  private shouldScrollToBottom = false

  ngOnInit() {
    this.currentUser = this.userService.getUser()
    this.loadChats()

    // Écouter les changements de route pour sélectionner le bon chat
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const chatId = params["chatId"]
      if (chatId) {
        this.selectChatById(Number.parseInt(chatId))
      } else {
        // Route /message sans chatId - afficher la liste des chats
        this.selectedChat = null
      }
    })

    // Polling pour les nouveaux messages (optionnel)
    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.selectedChat) {
          this.loadMessages(this.selectedChat.id, false)
        }
      })
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
  }

  loadChats() {
    this.isLoadingChats = true
    this.error = null

    this.chatService
      .getChats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.chats = response.data || response
          this.isLoadingChats = false

          // Si on a un chatId dans l'URL, sélectionner ce chat
          const chatId = this.route.snapshot.params["chatId"]
          if (chatId) {
            this.selectChatById(Number.parseInt(chatId))
          } else if (this.chats.length > 0 && !this.selectedChat) {
            // Sinon, sélectionner le premier chat par défaut
            this.selectChat(this.chats[0])
          }
        },
        error: (error) => {
          console.error("Erreur lors du chargement des chats:", error)
          this.error = "Impossible de charger les conversations"
          this.isLoadingChats = false
        },
      })
  }

  selectChat(chat: Chat) {
    this.selectedChat = chat
    this.loadMessages(chat.id)

    // Naviguer vers la route avec le chatId
    this.router.navigate(["/message", chat.id])
  }

  selectChatById(chatId: number) {
    const chat = this.chats.find((c) => c.id === chatId)
    if (chat) {
      this.selectedChat = chat
      this.loadMessages(chat.id)
    }
  }

  loadMessages(chatId: number, showLoading = true) {
    if (showLoading) {
      this.isLoadingMessages = true
    }

    this.chatService
      .getMessages(chatId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const newMessages = response.data || response

          // Si c'est un refresh silencieux, vérifier s'il y a de nouveaux messages
          if (!showLoading && this.messages.length > 0) {
            const lastMessageId = this.messages[this.messages.length - 1]?.id
            const hasNewMessages = newMessages.some((msg: Message) => msg.id > lastMessageId)
            if (hasNewMessages) {
              this.shouldScrollToBottom = true
            }
          } else {
            this.shouldScrollToBottom = true
          }

          this.messages = newMessages
          this.isLoadingMessages = false
        },
        error: (error) => {
          console.error("Erreur lors du chargement des messages:", error)
          this.error = "Impossible de charger les messages"
          this.isLoadingMessages = false
        },
      })
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedChat || this.isLoading) {
      return
    }

    const messageText = this.newMessage.trim()
    this.newMessage = ""
    this.isLoading = true

    this.chatService
      .sendMessage(this.selectedChat.id, messageText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          // Recharger les messages pour voir le nouveau message
          this.loadMessages(this.selectedChat!.id, false)
          this.isLoading = false
          this.shouldScrollToBottom = true
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi du message:", error)
          this.error = "Impossible d'envoyer le message"
          this.newMessage = messageText // Restaurer le message en cas d'erreur
          this.isLoading = false
        },
      })
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      this.sendMessage()
    }
  }

  setActiveTab(tab: "all" | "unread" | "projects") {
    this.activeTab = tab
  }

  get filteredChats(): Chat[] {
    let filtered = this.chats

    // Filtrer par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (chat) =>
          chat.name?.toLowerCase().includes(query) ||
          chat.users.some((user) => user.name?.toLowerCase().includes(query)) ||
          chat.last_message?.message.toLowerCase().includes(query),
      )
    }

    // Filtrer par onglet
    switch (this.activeTab) {
      case "unread":
        // Logique pour les messages non lus (à implémenter selon votre backend)
        break
      case "projects":
        filtered = filtered.filter((chat) => chat.type === ChatType.Group)
        break
      default:
        break
    }

    return filtered
  }

  getChatDisplayName(chat: Chat): string {
    if (chat.name) {
      return chat.name
    }

    // Pour les chats privés, afficher le nom de l'autre utilisateur
    if (chat.type === ChatType.Private && chat.users.length > 0) {
      const otherUser = chat.users.find((user) => user.id !== this.currentUser?.id)
      return otherUser?.name || "Utilisateur"
    }

    return "Conversation"
  }

  getChatInitials(chat: Chat): string {
    const name = this.getChatDisplayName(chat)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  getLastMessagePreview(chat: Chat): string {
    if (!chat.last_message) {
      return "Aucun message"
    }

    const message = chat.last_message.message
    return message.length > 50 ? message.substring(0, 50) + "..." : message
  }

  getMessageTime(message: Message): string {
    const date = new Date(message.created_at)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // 7 jours
      return date.toLocaleDateString("fr-FR", { weekday: "short" })
    } else {
      return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    }
  }

  getChatTime(chat: Chat): string {
    if (!chat.last_message) {
      return ""
    }
    return this.getMessageTime(chat.last_message)
  }

  isOwnMessage(message: Message): boolean {
    return this.currentUser ? message.sender_id === this.currentUser.id : false
  }

  getUserInitials(user: any): string {
    if (!user?.name) return "U"
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement
        element.scrollTop = element.scrollHeight
      }
    } catch (err) {
      console.error("Erreur lors du scroll:", err)
    }
  }

  retryLoadChats() {
    this.error = null
    this.loadChats()
  }

  retryLoadMessages() {
    if (this.selectedChat) {
      this.error = null
      this.loadMessages(this.selectedChat.id)
    }
  }

  // Méthodes TrackBy pour optimiser les performances
  trackByChat(index: number, chat: Chat): number {
    return chat.id
  }

  trackByMessage(index: number, message: Message): number {
    return message.id
  }
}
