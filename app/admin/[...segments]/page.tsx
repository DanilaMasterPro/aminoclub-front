import { notFound } from "next/navigation";

import AdminReferralScreen from "@/screens/admin/AdminReferralScreen";
import AdminResourceFormScreen from "@/screens/admin/AdminResourceFormScreen";
import AdminResourceListScreen from "@/screens/admin/AdminResourceListScreen";
import AdminSettingsScreen from "@/screens/admin/AdminSettingsScreen";
import AdminTrainerApplicationScreen from "@/screens/admin/AdminTrainerApplicationScreen";
import AdminTrainerScreen from "@/screens/admin/AdminTrainerScreen";

export default async function AdminResourcePage({ params }: PageProps<"/admin/[...segments]">) {
  const { segments } = await params;

  if (segments.length > 2) notFound();

  const [resource, id] = segments;

  if (!id) {
    if (resource === "referral") return <AdminReferralScreen />;
    if (resource === "settings") return <AdminSettingsScreen />;
    return <AdminResourceListScreen key={resource} resource={resource} />;
  }

  if (id === "new") return <AdminResourceFormScreen resource={resource} />;
  if (resource === "trainer-applications") return <AdminTrainerApplicationScreen id={id} />;
  if (resource === "trainers") return <AdminTrainerScreen id={id} />;
  return <AdminResourceFormScreen resource={resource} id={id} />;
}
