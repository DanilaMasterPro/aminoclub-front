import PublicPageShell from "@/components/PublicPageShell";
import Benefits from "@/screens/home/components/Benefits";
import CatalogContent from "./components/CatalogContent";

export default function CatalogScreen({ initialCategory }: { initialCategory?: string }) {
  return <PublicPageShell><CatalogContent initialCategory={initialCategory} /><Benefits /></PublicPageShell>;
}
