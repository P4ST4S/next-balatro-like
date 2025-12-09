import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balatro | Rogue Deck Landing",
  description: "A stylish landing page inspired by Balatro's neon roguelike card runs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
