import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = (process.env.APP_URL || "https://nwdagency.com").replace(/\/$/, "");

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${appUrl}/sitemap.xml`
  };
}
