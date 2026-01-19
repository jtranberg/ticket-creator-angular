import { Routes } from '@angular/router';

import { TicketsListComponent } from './pages/tickets-list/tickets-list.component';
import { TicketCreateComponent } from './pages/ticket-create/ticket-create.component';
import { TicketDetailComponent } from './pages/ticket-detail/ticket-detail.component';
import { TicketEditComponent } from './pages/ticket-edit/ticket-edit.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tickets' },

  { path: 'tickets', component: TicketsListComponent },
  { path: 'tickets/new', component: TicketCreateComponent },
  { path: 'tickets/:id', component: TicketDetailComponent },
  { path: 'tickets/:id/edit', component: TicketEditComponent },

  { path: '**', redirectTo: 'tickets' },
];
