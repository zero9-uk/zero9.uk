import type { Metadata } from "next";
import Header from '@/components/Header';
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "ZERO9",
  description: "Official website of ZERO9 — label, releases, and creative platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-founders bg-zero9-background text-zero9-text antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
