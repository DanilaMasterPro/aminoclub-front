import AdminReferralScreen from "@/screens/admin/AdminReferralScreen";
import AdminResourceListScreen from "@/screens/admin/AdminResourceListScreen";
import AdminSettingsScreen from "@/screens/admin/AdminSettingsScreen";

export default async function AdminResourcePage({ params }: PageProps<"/admin/[resource]">) {
  const { resource } = await params;
  if (resource === "referral") return <AdminReferralScreen />;
  if (resource === "settings") return <AdminSettingsScreen />;
  return <AdminResourceListScreen resource={resource} />;
}
