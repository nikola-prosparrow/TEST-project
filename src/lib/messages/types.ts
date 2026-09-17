export type Message = {
  id: string;
  listingId: string;
  ownerId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string | null;
  body: string;
  createdAt: string;
};

export type CreateMessageInput = {
  listingId: string;
  ownerId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  body: string;
};

export interface MessagesRepository {
  create(input: CreateMessageInput): Promise<Message>;
  listByOwner(ownerId: string): Promise<Message[]>;
}
