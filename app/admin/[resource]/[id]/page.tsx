import AdminResourceFormScreen from "@/screens/admin/AdminResourceFormScreen";
import AdminTrainerApplicationScreen from "@/screens/admin/AdminTrainerApplicationScreen";
import AdminTrainerScreen from "@/screens/admin/AdminTrainerScreen";

export default async function AdminResourceEditPage({ params }: PageProps<"/admin/[resource]/[id]">) {
  const { resource, id } = await params;
  if (resource === "trainer-applications") return <AdminTrainerApplicationScreen id={id} />;
  if (resource === "trainers") return <AdminTrainerScreen id={id} />;
  return <AdminResourceFormScreen resource={resource} id={id} />;
}
