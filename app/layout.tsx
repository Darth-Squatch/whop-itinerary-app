import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whop Itinerary Builder",
  description: "Creator-only itinerary builder with customer read-only access."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
