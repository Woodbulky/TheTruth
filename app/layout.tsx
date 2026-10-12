import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SATYA · Forward it to Lumi before you forward it to family",
  description: "Lumi checks forwarded messages against reliable sources and explains the verdict in English, Hindi and Marathi.",
  openGraph: {
    title: "SATYA · Forward it to Lumi before you forward it to family",
    description: "Send Lumi any forward. She finds dated evidence, gives a clear verdict and writes a polite reply for your group.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#008069",
};

// Applies saved theme (default: light) and language before first paint.
const PREFS_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem('satya-theme'),l=localStorage.getItem('satya-lang');d.classList.toggle('dark',t==='dark');if(l==='hi'||l==='mr')d.lang=l}catch(e){}})()`;

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
