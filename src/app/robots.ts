import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/api/",
        "/purchase-success",
        "/cart"
      ],
    },
    sitemap: "https://scriptly.store/sitemap.xml",
  };
}
