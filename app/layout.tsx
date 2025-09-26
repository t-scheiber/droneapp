import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🚁 Drone Document Wallet - Police Ready",
  description: "Instant access to drone insurance, registration, and aviation documents for police verification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
