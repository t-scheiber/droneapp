import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drone Documents",
  description: "Authority-ready access to your drone documentation",
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
