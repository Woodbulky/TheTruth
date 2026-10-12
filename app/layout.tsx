import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SATYA · Forward it to Lumi before you forward it to family",
  description: "Lumi checks forwarded messages against reliable sources and explains the verdict in English, Hindi and Marathi.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#008069" },
    { media: "(prefers-color-scheme: dark)", color: "#202C33" },
  ],
};

// Applies saved theme (default: system) and language before first paint.
const PREFS_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem('satya-theme'),l=localStorage.getItem('satya-lang');d.classList.toggle('dark',t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches);if(l==='hi'||l==='mr')d.lang=l}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFS_SCRIPT }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
