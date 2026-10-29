import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const appUrl = process.env.APP_URL || "http://localhost:3000";

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NWD Agency",
  legalName: "New Direction d.o.o. Beograd",
  url: "https://nwdagency.com/",
  logo: "https://nwdagency.com/assets/logo.svg",
  email: "office@nwdagency.com",
  taxID: "113831497",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Đorđa Čutukovića 28B, Floor 2, Apartment 7",
    postalCode: "11080",
    addressLocality: "Zemun, Belgrade",
    addressCountry: "RS"
  },
  sameAs: [
    "https://www.instagram.com/nwdagency/",
    "https://www.linkedin.com/company/109484149"
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "NWD Agency",
    template: "%s | NWD Agency"
  },
  description: "Strategic clarity for growing brands.",
  // Next.js generates favicon links from icon.png and apple-icon.png.
  // Keep a single square brand mark instead of the wide header logo.
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
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BRB17Z5LDC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BRB17Z5LDC');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
