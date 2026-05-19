import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Projector Bach | Park City Electric Metal Auditions",
  description:
    "Projector Bach is recruiting masked electric metal bandmates in Park City, Utah. Upload an audition or send a link.",
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
