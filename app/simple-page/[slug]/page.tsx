import { redirect } from "next/navigation";

export default async function SimpleArticleAlias({ params }: PageProps<"/simple-page/[slug]">) {
  redirect(`/news/${encodeURIComponent((await params).slug)}`);
}
