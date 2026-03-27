export type MessageState = 'SENT' | 'SEEN';
export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO';

export interface Message {
  id?: number;
  chatId?: string;
  senderId: string;
  receiverId: string;
  content?: string;
  type: MessageType;
  state?: MessageState;
  mediaFilePath?: string;
  createdDate?: string;
}

export interface MessageDto {
  chatId: string;
  senderId: string;
  receiverId: string;
  content?: string;
  type: MessageType;
  mediaFilePath?: string;
  createdDate?: string;
}

export interface Chat {
  id: string;
  senderId: string;
  recipientId: string;
  messages?: Message[];
  createdDate?: string;
  lastModifiedDate?: string;
  unreadMessages?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  chatName?: string;
  avatarInitials?: string;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
