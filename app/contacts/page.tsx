import type { Metadata } from "next";
import ContactsScreen from "@/screens/contacts/ContactsScreen";

export const metadata: Metadata = {
  title: "Контакты — AMINOCLUB",
  description: "Связаться с AMINOCLUB: телефон, электронная почта и форма обратной связи.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() { return <ContactsScreen />; }
