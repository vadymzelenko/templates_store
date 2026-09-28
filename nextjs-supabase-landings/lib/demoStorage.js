// lib/demoStorage.js
// Демо-хранилище в памяти процесса — реализует тот же контракт IBookingStorage
// (см. src/types.ts), что и AppsScriptAdapter. Используется автоматически,
// когда для сайта не заданы <PREFIX>_SHEETS_WEBAPP_URL/<PREFIX>_SHEETS_SECRET —
// именно это поведение уже описано в .env, но нигде не было реализовано.
//
// ВАЖНО: данные живут только в памяти текущего Node-процесса и пропадают при
// перезапуске сервера. Для продакшена настройте Google Sheets (см. README).

import { randomUUID } from "crypto";

export class DemoMemoryStorage {
  constructor(seed = {}) {
    this.users = new Map();
    this.resources = new Map();
    this.bookings = new Map();
    this.logs = [];

    for (const u of seed.users ?? []) {
      this.users.set(u.email, { createdAt: new Date().toISOString(), ...u });
    }
    for (const r of seed.resources ?? []) {
      this.resources.set(r.id, { ...r });
    }
  }

  // --- Users ---
  async findUserByEmail(email) {
    return this.users.get(email) ?? null;
  }
  async createUser(input) {
    const record = { id: input.email, createdAt: new Date().toISOString(), ...input };
    this.users.set(input.email, record);
    return record;
  }
  async listUsers() {
    return [...this.users.values()];
  }

  // --- Resources ---
  async listResources() {
    return [...this.resources.values()];
  }
  async createResource(input) {
    const id = input.id ?? randomUUID();
    const record = { id, ...input };
    this.resources.set(id, record);
    return record;
  }
  async deleteResource(id) {
    this.resources.delete(id);
  }

  // --- Bookings ---
  async findBookingById(id) {
    return this.bookings.get(id) ?? null;
  }
  async findBookingsInRange(startTime, endTime) {
    const s = new Date(startTime).getTime();
    const e = new Date(endTime).getTime();
    return [...this.bookings.values()].filter((b) => {
      const bs = new Date(b.startTime).getTime();
      const be = new Date(b.endTime).getTime();
      return bs < e && s < be;
    });
  }
  async createBooking(record) {
    const id = record.id ?? randomUUID();
    const full = { ...record, id, createdAt: new Date().toISOString() };
    this.bookings.set(id, full);
    return full;
  }
  async updateBookingStatus(id, status) {
    const b = this.bookings.get(id);
    if (b) this.bookings.set(id, { ...b, status });
  }
  async updateBookingTime(id, startTime, endTime) {
    const b = this.bookings.get(id);
    if (b) this.bookings.set(id, { ...b, startTime, endTime });
  }
  async listBookingsByUser(email) {
    return [...this.bookings.values()].filter((b) => b.userEmail === email);
  }
  async listBookings() {
    return [...this.bookings.values()];
  }
  async deleteBooking(id) {
    this.bookings.delete(id);
  }

  /** Атомарность не нужна в однопроцессном dev-хранилище — просто проверяем и пишем. */
  async reserveSlot(input) {
    const overlapping = await this.findBookingsInRange(input.startTime, input.endTime);
    const blocked = overlapping.some((b) => {
      if (b.resourceId !== input.resourceId) return false;
      if (b.status === "CANCELLED") return false;
      if (b.status === "PENDING" && b.createdAt < input.staleBefore) return false;
      return true;
    });
    if (blocked) return { reserved: false, reason: "SLOT_TAKEN" };

    const booking = await this.createBooking({
      id: input.id,
      userEmail: input.userEmail,
      resourceId: input.resourceId,
      startTime: input.startTime,
      endTime: input.endTime,
      serviceData: input.serviceData,
      status: "PENDING",
      token: input.token,
    });
    return { reserved: true, booking };
  }

  // --- Logs ---
  async appendLog(log) {
    this.logs.push(log);
  }
  async listLogs() {
    return [...this.logs].reverse();
  }

  async rebuildReport() {
    // нет физического листа "Отчёт" в памяти — no-op, метод опционален в IBookingStorage.
  }
}
