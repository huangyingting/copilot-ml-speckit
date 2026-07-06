import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Weather Map",
  description: "Explore current weather around the world on an interactive map.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}