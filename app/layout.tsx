import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chuka Dele-Oyeleru | Strategy & Operations",
  description: "Chuka Dele-Oyeleru builds the systems that take ambitious ideas from first brief to repeatable execution.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
