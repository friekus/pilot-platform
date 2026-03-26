import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vectored — Get vectored to your flying career",
  description: "The study platform built for Australian student pilots. Adaptive practice exams, progress tracking, and a career hub to land your first flying job.",
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
