import type { Metadata } from "next";
import TrainerDashboardScreen from "@/screens/trainer/TrainerDashboardScreen";

// Service page: not for search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function TrainerPage() { return <TrainerDashboardScreen />; }
