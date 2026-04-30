import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import bgSilkCream from "@/assets/site/img5.jpg";
import heroHands from "@/assets/hero-hands.jpg";

// Локальные шрифты — не зависят от Google Fonts (важно для России без VPN)
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            search={{ name: "" }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Сергей & Ангелина · 06.06.2026" },
      { name: "description", content: "A digital wedding invitation and memory keeper for your special day." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Сергей & Ангелина · 06.06.2026" },
      { property: "og:description", content: "A digital wedding invitation and memory keeper for your special day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Сергей & Ангелина · 06.06.2026" },
      { name: "twitter:description", content: "A digital wedding invitation and memory keeper for your special day." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preload", as: "image", href: bgSilkCream, fetchPriority: "high" },
      { rel: "preload", as: "image", href: heroHands, fetchPriority: "high" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" style={{ background: "oklch(0.975 0.005 80)" }}>
      <head>
        <HeadContent />
      </head>
      <body style={{ background: "oklch(0.975 0.005 80)", margin: 0 }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
