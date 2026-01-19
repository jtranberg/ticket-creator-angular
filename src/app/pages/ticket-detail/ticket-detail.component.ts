import { Component, inject } from '@angular/core';
import { NgIf, DatePipe, AsyncPipe  } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [NgIf, DatePipe, RouterLink,AsyncPipe],
  template: `
    <div *ngIf="(ticket$ | async) as ticket; else missing">
      <div class="row">
        <div>
          <h1>{{ ticket.title }}</h1>
          <p class="muted">Created {{ ticket.createdAt | date:'medium' }}</p>
        </div>

        <div class="actions">
          <a class="btn ghost" routerLink="/tickets">Back</a>
          <a class="btn" [routerLink]="['/tickets', ticket.id, 'edit']">Edit</a>
          <button class="btn danger" (click)="del(ticket.id)">Delete</button>
        </div>
      </div>

      <div class="card">
        <div class="meta">
          <span class="pill">Status: {{ ticket.status }}</span>
          <span class="pill">Priority: {{ ticket.priority }}</span>
          <span class="muted">Updated {{ ticket.updatedAt | date:'medium' }}</span>
        </div>

        <p class="desc" *ngIf="ticket.description; else noDesc">
          {{ ticket.description }}
        </p>

        <ng-template #noDesc>
          <p class="muted">No description.</p>
        </ng-template>
      </div>
    </div>

    <ng-template #missing>
      <div class="card">
        <h2>Ticket not found</h2>
        <a class="btn" routerLink="/tickets">Go back</a>
      </div>
    </ng-template>
  `,
  styles: [`
    h1 { margin: 0 0 6px; }
    .muted { opacity: .7; margin: 0; }
    .row { display:flex; justify-content: space-between; gap:16px; align-items:flex-start; margin-bottom:14px; }
    .actions { display:flex; gap:10px; flex-wrap:wrap; }

    .btn {
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.08);
      color: inherit;
      padding: 10px 12px;
      border-radius: 12px;
      cursor: pointer;
      text-decoration: none;
      font-weight: 700;
    }
    .btn.ghost { background: transparent; }
    .btn.danger { border-color: rgba(255,80,80,.35); background: rgba(255,80,80,.12); }

    .card {
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.06);
      border-radius: 16px;
      padding: 14px;
      max-width: 860px;
    }
    .meta { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom: 10px; }
    .pill {
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(0,0,0,.25);
      text-transform: capitalize;
    }
    .desc { margin: 8px 0 0; line-height: 1.35; }
  `],
})
export class TicketDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tickets = inject(TicketsService);

  ticket$ = this.route.paramMap.pipe(
    map((p) => p.get('id') || ''),
    map((id) => this.tickets.getById(id) ?? null)
  );

  del(id: string) {
    this.tickets.remove(id);
    this.router.navigateByUrl('/tickets');
  }
}
