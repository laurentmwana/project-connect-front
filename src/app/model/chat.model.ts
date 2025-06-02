import type { ChatType, Message } from "./message.model"
import { User } from "./project"


export interface Chat {
  id: number
  type: ChatType
  name?: string
  created_at: string
  updated_at: string
  users: User[]
  last_message?: Message
}
