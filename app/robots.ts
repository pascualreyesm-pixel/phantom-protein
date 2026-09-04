import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/pedido/confirmacion", "/api/"],
    },
    sitemap: "https://phantomprotein.cl/sitemap.xml",
  };
}
