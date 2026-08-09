import type { Metadata } from "next";
import { RouteShell } from "../../components/RouteShell";
export const metadata: Metadata = { robots: { index: false, follow: true }, title: "Résumé | Chuka Dele-Oyeleru" };
export default function ResumePage() { return <RouteShell title="Résumé" index="05" />; }
