import type { Metadata } from "next";
import { RouteShell } from "../../components/RouteShell";
export const metadata: Metadata = { robots: { index: false, follow: true }, title: "Work" };
export default function WorkPage() { return <RouteShell title="Selected work" index="01" />; }
