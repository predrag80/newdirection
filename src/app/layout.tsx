import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "New Direction",
  description: "Landing page and selected project views for New Direction."
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
