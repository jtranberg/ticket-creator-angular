export type TicketStatus = 'open' | 'in_progress' | 'done';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
