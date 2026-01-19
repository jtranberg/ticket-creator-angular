import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TicketsService } from '../../services/tickets.service';
import type { TicketPriority, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <h1>New Ticket</h1>
    <p class="muted">Reactive Forms + validation</p>

    <form class="card" [formGroup]="form" (ngSubmit)="submit()">
      <label class="label">
        Title
        <input class="input" formControlName="title" placeholder="e.g. Fix login bug" />
      </label>

      <div class="error" *ngIf="titleTouched && form.controls.title.invalid">
        Title is required (min 3 chars).
      </div>

      <label class="label">
        Description
        <textarea class="input" rows="4" formControlName="description" placeholder="What needs doing?"></textarea>
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
        <button class="btn ghost" type="button" (click)="cancel()">Cancel</button>
        <button class="btn" type="submit" [disabled]="form.invalid">Create</button>
      </div>
    </form>
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
      font-weight: 700;
    }
    .btn.ghost { background: transparent; }
    .btn[disabled] { opacity: .45; cursor: not-allowed; }
    .error { color: #ffb3b3; font-weight: 650; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
  `],
})
export class TicketCreateComponent {
  private fb = inject(FormBuilder);
  private tickets = inject(TicketsService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['open' as TicketStatus],
    priority: ['medium' as TicketPriority],
  });

  get titleTouched() {
    return this.form.controls.title.touched || this.form.controls.title.dirty;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.tickets.create({
      title: v.title,
      description: v.description,
      status: v.status,
      priority: v.priority,
    });

    this.router.navigateByUrl('/tickets');
  }

  cancel() {
    this.router.navigateByUrl('/tickets');
  }
}
