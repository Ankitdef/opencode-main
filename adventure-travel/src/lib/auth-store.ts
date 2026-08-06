export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface Booking {
  id: string;
  userId: string;
  trekName: string;
  trekSlug: string;
  date: string;
  groupSize: string;
  message: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface ActivityBooking {
  id: string;
  userId: string;
  activityName: string;
  activityType: string;
  date: string;
  groupSize: string;
  message: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

const USERS_KEY = "eht_users";
const SESSION_KEY = "eht_session";
const BOOKINGS_KEY = "eht_bookings";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Users ───
export function getUsers(): User[] { return read<User>(USERS_KEY); }

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: Omit<User, "id">): User {
  const users = getUsers();
  const user: User = { ...data, id: crypto.randomUUID() };
  users.push(user);
  write(USERS_KEY, users);
  return user;
}

// ─── Session ───
export function setSession(user: User) {
  const { password: _, ...safe } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
}

export function getSession(): Omit<User, "password"> | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
}

export function clearSession() { localStorage.removeItem(SESSION_KEY); }

// ─── Bookings ───
export function getBookings(userId: string): Booking[] {
  return read<Booking>(BOOKINGS_KEY).filter((b) => b.userId === userId);
}

export function createBooking(data: Omit<Booking, "id" | "status" | "createdAt">): Booking {
  const bookings = read<Booking>(BOOKINGS_KEY);
  const booking: Booking = { ...data, id: crypto.randomUUID(), status: "pending", createdAt: new Date().toISOString() };
  bookings.push(booking);
  write(BOOKINGS_KEY, bookings);
  return booking;
}

// ─── Activity Bookings ───
const ACTIVITY_BOOKINGS_KEY = "eht_activity_bookings";

export function getActivityBookings(userId: string): ActivityBooking[] {
  return read<ActivityBooking>(ACTIVITY_BOOKINGS_KEY).filter((b) => b.userId === userId);
}

export function createActivityBooking(data: Omit<ActivityBooking, "id" | "status" | "createdAt">): ActivityBooking {
  const bookings = read<ActivityBooking>(ACTIVITY_BOOKINGS_KEY);
  const booking: ActivityBooking = { ...data, id: crypto.randomUUID(), status: "pending", createdAt: new Date().toISOString() };
  bookings.push(booking);
  write(ACTIVITY_BOOKINGS_KEY, bookings);
  return booking;
}
