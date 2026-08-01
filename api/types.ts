export type UserRole = "ADMIN" | "TRAINER";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "BLOCKED";
}

export interface Paginated<T = Record<string, unknown>> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CatalogCategory {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
}

export interface CatalogProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface CatalogProduct {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  flavor: string | null;
  price: string;
  stockQuantity: number;
  category: CatalogCategory;
  images: CatalogProductImage[];
}

export interface TrainerDashboard {
  trainer: {
    id: string;
    name: string;
    surname: string;
    status: string;
    referralCode: string;
    commissionRate: string;
  };
  referralClicks: number;
  orders: { _count: number; _sum: { finalAmount: string | null } };
  commissions: Array<{ status: string; _sum: { amount: string | null } }>;
  promoCodes: Array<{ id: string; code: string; value: string }>;
}
