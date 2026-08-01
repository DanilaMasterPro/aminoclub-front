import AdminResourceFormScreen from "@/screens/admin/AdminResourceFormScreen";

export default async function AdminResourceEditPage({ params }: PageProps<"/admin/[resource]/[id]">) {
  const { resource, id } = await params;
  return <AdminResourceFormScreen resource={resource} id={id} />;
}
