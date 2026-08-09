import type { Metadata } from "next";
import { RouteShell } from "../../components/RouteShell";
export const metadata: Metadata = { robots: { index: false, follow: true }, title: "About | Chuka Dele-Oyeleru" };
export default function AboutPage() { return <RouteShell title="About" index="04" />; }
