import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "CorpOps Dashboard",
  description: "Full-stack internal operations dashboard",
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-paper text-ink dark:bg-night dark:text-paper min-h-screen font-body transition-colors">
        {children}
      </body>
    </html>
  );
}