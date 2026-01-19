import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { Ticket, TicketPriority, TicketStatus } from '../models/ticket.model';

const STORAGE_KEY = 'ttng_tickets_v1';

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function seedTickets(): Ticket[] {
  const t = nowIso();
  return [
    {
      id: uid(),
      title: 'Wire TicketService (RxJS store)',
      description: 'BehaviorSubject + CRUD + localStorage persistence',
      status: 'in_progress',
      priority: 'high',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: uid(),
      title: 'Build tickets list UI',
      description: 'Filters, count badges, delete action',
      status: 'open',
      priority: 'medium',
      createdAt: t,
      updatedAt: t,
    },
    {
      id: uid(),
      title: 'Create ticket form',
      description: 'Reactive form with validation',
      status: 'open',
      priority: 'high',
      createdAt: t,
      updatedAt: t,
    },
  ];
}

function loadFromStorage(): Ticket[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Ticket[]) : null;
  } catch {
    return null;
  }
}

function saveToStorage(list: Ticket[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly _tickets = new BehaviorSubject<Ticket[]>(
    loadFromStorage() ?? seedTickets()
  );

  readonly tickets$ = this._tickets.asObservable();

  constructor() {
    // persist changes
    this._tickets.subscribe((list) => saveToStorage(list));
  }

  getSnapshot(): Ticket[] {
    return this._tickets.value;
  }

  getById(id: string): Ticket | undefined {
    return this._tickets.value.find((t) => t.id === id);
  }

  create(input: {
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
  }): Ticket {
    const t = nowIso();
    const ticket: Ticket = {
      id: uid(),
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      priority: input.priority,
      createdAt: t,
      updatedAt: t,
    };

    this._tickets.next([ticket, ...this._tickets.value]);
    return ticket;
  }

  update(
    id: string,
    patch: Partial<Omit<Ticket, 'id' | 'createdAt'>>
  ): Ticket | null {
    const list = this._tickets.value;
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    const updated: Ticket = { ...list[idx], ...patch, updatedAt: nowIso() };
    const next = [...list];
    next[idx] = updated;
    this._tickets.next(next);
    return updated;
  }

  remove(id: string): boolean {
    const before = this._tickets.value.length;
    const next = this._tickets.value.filter((t) => t.id !== id);
    this._tickets.next(next);
    return next.length !== before;
  }

  resetSeed() {
    this._tickets.next(seedTickets());
  }

  clearAll() {
    this._tickets.next([]);
  }
}
