import { Component, signal, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

import type { TicketStatus } from '../../models/ticket.model';
import { TicketsService } from '../../services/tickets.service';

type Filter = 'all' | TicketStatus;

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, DatePipe, RouterLink],
  template: `
    <div class="row">
      <div>
        <h1>Tickets</h1>
        <p class="muted">Angular + RxJS store (no backend)</p>
      </div>

      <div class="actions">
        <a class="btn" routerLink="/tickets/new">+ New Ticket</a>
        <button class="btn ghost" (click)="reset()">Reset seed</button>
        <button class="btn ghost" (click)="clear()">Clear all</button>
      </div>
    </div>

    <div class="filters">
      <button class="chip" [class.active]="filter() === 'all'" (click)="setFilter('all')">
        All <span class="badge">{{ (counts$ | async)?.all ?? 0 }}</span>
      </button>

      <button class="chip" [class.active]="filter() === 'open'" (click)="setFilter('open')">
        Open <span class="badge">{{ (counts$ | async)?.open ?? 0 }}</span>
      </button>

      <button class="chip" [class.active]="filter() === 'in_progress'" (click)="setFilter('in_progress')">
        In Progress <span class="badge">{{ (counts$ | async)?.in_progress ?? 0 }}</span>
      </button>

      <button class="chip" [class.active]="filter() === 'done'" (click)="setFilter('done')">
        Done <span class="badge">{{ (counts$ | async)?.done ?? 0 }}</span>
      </button>
    </div>

    <div class="list" *ngIf="(visible$ | async) as tickets">
      <div class="empty" *ngIf="tickets.length === 0">
        No tickets. Create one.
      </div>

      <article class="card" *ngFor="let t of tickets">
        <div class="cardTop">
          <div class="title">
            <a [routerLink]="['/tickets', t.id]">{{ t.title }}</a>
            <div class="meta">
              <span class="pill" [attr.data-status]="t.status">{{ labelStatus(t.status) }}</span>
              <span class="pill" [attr.data-priority]="t.priority">{{ t.priority }}</span>
              <span class="muted">Updated {{ t.updatedAt | date:'medium' }}</span>
            </div>
          </div>

          <div class="cardActions">
            <a class="btn small ghost" [routerLink]="['/tickets', t.id, 'edit']">Edit</a>
            <button class="btn small danger" (click)="del(t.id)">Delete</button>
          </div>
        </div>

        <p class="desc">{{ t.description }}</p>
      </article>
    </div>
  `,
  styles: [`
    h1 { margin: 0; }
    .muted { opacity: .7; margin: 6px 0 0; }
    .row { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
    .actions { display: flex; gap: 10px; flex-wrap: wrap; }

    .btn {
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.08);
      color: inherit;
      padding: 10px 12px;
      border-radius: 12px;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
    }
    .btn.ghost { background: transparent; }
    .btn.small { padding: 7px 10px; font-size: 13px; }
    .btn.danger { border-color: rgba(255, 80, 80, 0.42); background: rgba(255,80,80,.12); }

    .filters { display: flex; gap: 10px; margin: 14px 0 16px; }
    .chip {
      border: 1px solid rgba(102, 83, 83, 0.25);
      background: rgba(78, 232, 243, 0.84);
      padding: 8px 10px;
      border-radius: 999px;
      cursor: pointer;
      font-weight: 650;
    }
    .chip.active {
     background: rgba(177, 238, 235, 0.88); 
     }

    .badge {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(125, 234, 241, 0.77);
    }

    .list { display: grid; gap: 12px; }
    .card {
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.06);
      border-radius: 16px;
      padding: 14px;
    }
    .cardTop { display: flex; justify-content: space-between; gap: 12px; }
    .title a { font-weight: 800; text-decoration: none; color: inherit; }
    .meta { display: flex; gap: 8px; margin-top: 8px; }
    .desc { margin-top: 10px; opacity: .9; }

    .pill {
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(24, 156, 233, 0.69);
      text-transform: capitalize;
    }

    .empty {
      opacity: .75;
      padding: 18px;
      border: 1px dashed rgba(255,255,255,.22);
      border-radius: 16px;
    }
  `],
})
export class TicketsListComponent {
  private tickets = inject(TicketsService);

  filter = signal<Filter>('all');

  counts$ = this.tickets.tickets$.pipe(
    map((list) => ({
      all: list.length,
      open: list.filter((t) => t.status === 'open').length,
      in_progress: list.filter((t) => t.status === 'in_progress').length,
      done: list.filter((t) => t.status === 'done').length,
    }))
  );

  visible$ = this.tickets.tickets$.pipe(
    map((list) => {
      const f = this.filter();
      return f === 'all' ? list : list.filter((t) => t.status === f);
    })
  );

  setFilter(f: Filter) {
    this.filter.set(f);
  }

  del(id: string) {
    this.tickets.remove(id);
  }

  reset() {
    this.tickets.resetSeed();
  }

  clear() {
    this.tickets.clearAll();
  }

  labelStatus(s: TicketStatus) {
    return s === 'in_progress' ? 'In Progress' : s === 'open' ? 'Open' : 'Done';
  }
}
