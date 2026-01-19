import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="brand" routerLink="/tickets">🎫 Ticket Tracker</div>

      <nav class="nav">
        <a routerLink="/tickets" routerLinkActive="active">Tickets</a>
        <a routerLink="/tickets/new" routerLinkActive="active">New</a>
      </nav>
    </header>

    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    * { box-sizing: border-box; }
    :host { display: block; }
    .topbar {
      position: sticky; top: 0;
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px;
      background: rgba(255,255,255,0.06);
      border-bottom: 1px solid rgba(255,255,255,0.10);
      backdrop-filter: blur(10px);
    }
    .brand { font-weight: 800; letter-spacing: 0.3px; cursor: pointer; }
    .nav { display: flex; gap: 14px; }
    .nav a { opacity: 0.75; text-decoration: none; color: inherit; }
    .nav a.active { opacity: 1; font-weight: 700; }
    .container { max-width: 980px; margin: 0 auto; padding: 18px; }
  `],
})
export class AppComponent {}
