import { User } from "./project"


export interface Message {
  id: number
  chat_id: number
  sender_id: number
  message: string
  created_at: string
  updated_at: string
  sender: User
}

export enum ChatType {
  Private = "private",
  Group = "group",
}
