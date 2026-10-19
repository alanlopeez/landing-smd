import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/gracias"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-SearchBot",
          "Google-Extended",
          "GoogleOther",
          "Applebot-Extended",
          "cohere-ai",
        ],
        allow: ["/", "/precios-servicios", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/gracias"],
      },
    ],
    sitemap: "https://serviciodemarketingdigital.com/sitemap.xml",
  };
}
