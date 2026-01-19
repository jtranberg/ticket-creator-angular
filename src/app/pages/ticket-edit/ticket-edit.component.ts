import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { TicketsService } from '../../services/tickets.service';
import type { TicketPriority, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  template: `
    <div *ngIf="loaded; else missing">
      <h1>Edit Ticket</h1>
      <p class="muted">Update fields and save</p>

      <form class="card" [formGroup]="form" (ngSubmit)="save()">
        <label class="label">
          Title
          <input class="input" formControlName="title" />
        </label>

        <div class="error" *ngIf="titleTouched && form.controls.title.invalid">
          Title is required (min 3 chars).
        </div>

        <label class="label">
          Description
          <textarea class="input" rows="4" formControlName="description"></textarea>
        </label>

        <div class="grid">
          <label class="label">
            Status
            <select class="input" formControlName="status">
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          <label class="label">
            Priority
            <select class="input" formControlName="priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <div class="actions">
          <a class="btn ghost" [routerLink]="['/tickets', id]">Cancel</a>
          <button class="btn" type="submit" [disabled]="form.invalid">Save</button>
        </div>
      </form>
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
    .muted { opacity: .7; margin: 0 0 14px; }
    .card {
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.06);
      border-radius: 16px;
      padding: 14px;
      display: grid;
      gap: 12px;
      max-width: 760px;
    }
    .label { display: grid; gap: 6px; font-weight: 650; }
    .input {
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(0,0,0,.25);
      color: inherit;
      outline: none;
    }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px; }
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
    .btn[disabled] { opacity: .45; cursor: not-allowed; }
    .error { color: #ffb3b3; font-weight: 650; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
  `],
})
export class TicketEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tickets = inject(TicketsService);
  private fb = inject(FormBuilder);

  id = this.route.snapshot.paramMap.get('id') || '';
  loaded = false;

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['open' as TicketStatus],
    priority: ['medium' as TicketPriority],
  });

  get titleTouched() {
    return this.form.controls.title.touched || this.form.controls.title.dirty;
  }

  constructor() {
    const t = this.tickets.getById(this.id);
    if (!t) return;

    this.form.patchValue({
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
    });

    this.loaded = true;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.tickets.update(this.id, {
      title: v.title,
      description: v.description,
      status: v.status,
      priority: v.priority,
    });

    this.router.navigate(['/tickets', this.id]);
  }
}
