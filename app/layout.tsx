import type { Metadata } from "next";
import { SoundProvider } from "../components/sound/SoundProvider";
import { SoundToggle } from "../components/sound/SoundToggle";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://chuka-personal-site.thebredge.workers.dev"),
  alternates: { canonical: "/" },
  title: {
    default: "Chuka Dele-Oyeleru | Strategy & Operations",
    template: "%s | Chuka Dele-Oyeleru",
  },
  description: "Chuka Dele-Oyeleru builds the systems that take ambitious ideas from first brief to repeatable execution.",
  applicationName: "Chuka Dele-Oyeleru",
  authors: [{ name: "Chuka Dele-Oyeleru" }],
  creator: "Chuka Dele-Oyeleru",
  openGraph: {
    type: "website",
    title: "Chuka Dele-Oyeleru | Strategy & Operations",
    description: "I build the systems that take ambitious ideas from first brief to repeatable execution.",
    url: "/",
    siteName: "Chuka Dele-Oyeleru",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Chuka Dele-Oyeleru, Strategy & Operations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chuka Dele-Oyeleru | Strategy & Operations",
    description: "I build the systems that take ambitious ideas from first brief to repeatable execution.",
    images: ["/og-image.png"],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Chuka Dele-Oyeleru",
              jobTitle: "Strategy & Operations",
              sameAs: ["https://www.linkedin.com/in/chuka1"],
            }),
          }}
        />
        <SoundProvider>
          {children}
          <SoundToggle />
        </SoundProvider>
      </body>
    </html>
  );
}
