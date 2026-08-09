import type { Metadata } from "next";
import { RouteShell } from "../../components/RouteShell";
export const metadata: Metadata = { robots: { index: false, follow: true }, title: "Notes | Chuka Dele-Oyeleru" };
export default function NotesPage() { return <RouteShell title="Notes" index="02" />; }
