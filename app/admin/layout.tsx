import AdminShell from "@/screens/admin/components/AdminShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Административная панель — AMINOCLUB",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
