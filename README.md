# Ticket Tracker (Angular)

A lightweight ticket-tracking dashboard built with **modern Angular** to demonstrate core framework fundamentals alongside a comparable React implementation.

This app intentionally runs **without a backend** and uses a seeded in-memory store so functionality is visible immediately on load.

---

## ✨ Features

- 📋 Ticket list with live counters (All / Open / In Progress / Done)
- ➕ Create tickets using **Reactive Forms** with validation
- 👁 View ticket details
- ✏️ Edit ticket status, priority, and content
- 🗑 Delete tickets
- 🔄 Reset demo data or clear all tickets
- ⚡ Instant UI updates via RxJS state

---

## 🧠 Architecture Overview

### Standalone Components
- Uses Angular’s **standalone component** model (no NgModules)
- Each page declares its own dependencies explicitly

### Routing
- Router-first architecture
- Clean route structure:
  - `/tickets`
  - `/tickets/new`
  - `/tickets/:id`
  - `/tickets/:id/edit`

### State Management
- Central `TicketsService` using `BehaviorSubject`
- Acts as a simple client-side store
- Derived state (filters, counters) computed via RxJS pipelines

### Forms
- **Reactive Forms** for Create and Edit workflows
- Built-in validation and clean submit handling

---

## 🧪 Seeded Demo Data

The app initializes with a small set of demo tickets so the UI is usable immediately without setup.

This mirrors common real-world practice where:
- Development uses mock data
- The service interface later connects to a real API

The store can be:
- Reset to demo data
- Cleared entirely

---

## 🛠 Tech Stack

- Angular (standalone components)
- Angular Router
- RxJS
- Reactive Forms
- TypeScript
- Minimal CSS (glassmorphic dashboard style)

---

## 🎯 Purpose

This project exists to **demonstrate Angular fundamentals** and contrast them with an equivalent React implementation, showing the ability to:

- Switch frameworks confidently
- Apply idiomatic patterns
- Build real CRUD flows, not just demos

---

## ▶️ Running Locally

```bash
npm install
npm start
