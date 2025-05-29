export interface Message {
  id: number
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  isOwn: boolean
  attachments?: Attachment[]
}

export interface Attachment {
  type: "file" | "image" | "link"
  name: string
  size?: string
  url?: string
}

export interface Conversation {
  id: string
  name: string
  initials: string
  message: string
  time: string
  unread?: boolean
  isGroup?: boolean
}
