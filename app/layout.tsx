import type { Metadata } from "next";
import { SoundProvider } from "../components/sound/SoundProvider";
import { SoundToggle } from "../components/sound/SoundToggle";
import { siteUrl } from "../lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl ?? undefined,
  title: {
    default: "Chuka Dele-Oyeleru | Strategy & Operations",
    template: "%s | Chuka Dele-Oyeleru",
  },
  description: "Chuka Dele-Oyeleru builds the systems that take ambitious ideas from first brief to repeatable execution.",
  applicationName: "Chuka Dele-Oyeleru",
  authors: [{ name: "Chuka Dele-Oyeleru" }],
  creator: "Chuka Dele-Oyeleru",
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
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SoundProvider>
          {children}
          <SoundToggle />
        </SoundProvider>
      </body>
    </html>
  );
}
