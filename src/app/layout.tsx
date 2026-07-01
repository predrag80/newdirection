import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "NWD Agency",
    template: "%s | NWD Agency"
  },
  description: "Strategic clarity for growing brands.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png"
  },
  openGraph: {
    title: "NWD Agency",
    description: "Strategic clarity for growing brands.",
    url: "/",
    siteName: "NWD Agency",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NWD Agency logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "NWD Agency",
    description: "Strategic clarity for growing brands.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body>{children}</body>
    </html>
  );
}
