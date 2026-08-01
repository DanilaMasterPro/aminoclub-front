import AdminResourceFormScreen from "@/screens/admin/AdminResourceFormScreen";

export default async function AdminResourceNewPage({ params }: PageProps<"/admin/[resource]/new">) {
  const { resource } = await params;
  return <AdminResourceFormScreen resource={resource} />;
}
