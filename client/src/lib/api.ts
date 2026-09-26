const API = (
    (import.meta.env.VITE_API_URL as string | undefined) ||
    "http://localhost:8000/api"
).replace(/\/+$/, "");

export type Role = "user" | "owner" | "admin";
export type CafeStatus = "pending" | "approved" | "rejected";

export interface Cafe {
  id: number;
  owner_id: number | null;
  name: string;
  slug: string;
  address: string;
  phone: string | null;
  description: string | null;
  cuisine: string | null;
  price_range: string | null;
  image_url: string | null;
  opening_time: string;
  closing_time: string;
  status: CafeStatus;
}

export interface CafeCreate {
  name: string;
  address: string;
  phone?: string;
  description?: string;
  cuisine?: string;
  price_range?: string;
  image_url?: string;
  opening_time: string;
  closing_time: string;
  slug?: string;
}

export interface Table {
  id: number;
  cafe_id: number;
  table_number: string;
  capacity: number;
}

export interface TableCreate {
  cafe_id: number;
  table_number: string;
  capacity: number;
}

export interface Reservation {
  id: number;
  user_id: number;
  table_id: number;
  reservation_time: string;
  party_size: number;
  status: string;
  created_at: string;
}

export interface OwnerReservation {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  table_id: number;
  table_number: string;
  cafe_id: number;
  cafe_name: string;
  reservation_time: string;
  party_size: number;
  status: string;
  created_at: string;
}

export interface ReservationCreate {
  table_id: number;
  reservation_time: string;
  party_size: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  created_at: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "user" | "owner";
}

export interface Review {
  id: number;
  cafe_id: number;
  user_id: number;
  user_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ReviewCreate {
  cafe_id: number;
  rating: number;
  comment?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  let res: Response;

  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
  } catch {
    throw new Error(
      "Can't reach the server. Make sure the API is running on " + API
    );
  }

  if (res.status === 401 && token) {
    clearToken();
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;

    try {
      const body = await res.json();

      if (body?.detail) {
        if (typeof body.detail === "string") {
          message = body.detail;
        } else if (Array.isArray(body.detail)) {
          message = body.detail
            .map((item: { msg?: string }) => item?.msg)
            .filter(Boolean)
            .join(" ");
        }
      }
    } catch {
      message = `Request failed (${res.status})`;
    }

    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

export const checkHealth = () => request<{ status: string }>("/health");

export const API_ORIGIN = API.replace(/\/api$/, "");

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (/^(https?:)?\/\//.test(url)) return url;
  if (url.startsWith("/uploads/")) return `${API_ORIGIN}${url}`;
  return url;
}

export async function uploadImage(file: File): Promise<string> {
  const token = getToken();
  const body = new FormData();
  body.append("file", file);

  let res: Response;

  try {
    res = await fetch(`${API}/uploads/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });
  } catch {
    throw new Error("Can't reach the server to upload the image.");
  }

  if (!res.ok) {
    let message = `Upload failed (${res.status})`;

    try {
      const payload = await res.json();

      if (typeof payload?.detail === "string") {
        message = payload.detail;
      }
    } catch {
      message = `Upload failed (${res.status})`;
    }

    throw new Error(message);
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}

export const getFavoriteIds = () => request<number[]>("/favorites/");

export const getFavoriteCafes = () => request<Cafe[]>("/favorites/cafes");

export const addFavorite = (cafeId: number) =>
  request<{ cafe_id: number }>(`/favorites/${cafeId}`, { method: "POST" });

export const removeFavorite = (cafeId: number) =>
  request<{ cafe_id: number }>(`/favorites/${cafeId}`, { method: "DELETE" });

export const login = (email: string, password: string) =>
  request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getCurrentUser = () => request<User>("/auth/me");

export const register = (data: UserCreate) =>
  request<User>("/users/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getUsers = () => request<User[]>("/users/");

export const getCafes = () => request<Cafe[]>("/cafes/");

export const getCafe = (id: number) => request<Cafe>(`/cafes/${id}`);

export const getCafeBySlug = (slug: string) =>
  request<Cafe>(`/cafes/slug/${slug}`);

export const getMyCafes = () => request<Cafe[]>("/cafes/mine");

export const getPendingCafes = () => request<Cafe[]>("/cafes/pending");

export const getAllCafesAdmin = () => request<Cafe[]>("/cafes/all");

export const createCafe = (data: CafeCreate) =>
  request<Cafe>("/cafes/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCafe = (id: number, data: Partial<CafeCreate>) =>
  request<Cafe>(`/cafes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const approveCafe = (id: number) =>
  request<Cafe>(`/cafes/${id}/approve`, { method: "PATCH" });

export const rejectCafe = (id: number) =>
  request<Cafe>(`/cafes/${id}/reject`, { method: "PATCH" });

export const getTables = (cafeId?: number) =>
  request<Table[]>(cafeId ? `/tables/?cafe_id=${cafeId}` : "/tables/");

export const createTable = (data: TableCreate) =>
  request<Table>("/tables/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getReservations = () => request<Reservation[]>("/reservations/");

export const getOwnerReservations = () =>
  request<OwnerReservation[]>("/reservations/owner");

export const createReservation = (data: ReservationCreate) =>
  request<Reservation>("/reservations/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const cancelReservation = (id: number) =>
  request<void>(`/reservations/${id}`, { method: "DELETE" });

export const updateReservationStatus = (
  id: number,
  status: "confirmed" | "completed" | "cancelled"
) =>
  request<Reservation>(`/reservations/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const getReviews = (cafeId: number) =>
  request<Review[]>(`/reviews/?cafe_id=${cafeId}`);

export const createReview = (data: ReviewCreate) =>
  request<Review>("/reviews/", {
    method: "POST",
    body: JSON.stringify(data),
  });
