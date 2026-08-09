import type { Metadata } from "next";
import { RouteShell } from "../../components/RouteShell";
export const metadata: Metadata = { robots: { index: false, follow: true }, title: "Library" };
export default function LibraryPage() { return <RouteShell title="Library" index="03" />; }
