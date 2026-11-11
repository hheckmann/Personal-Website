import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hailey | Systems & Software Engineer",
  description:
    "Portfolio of Hailey, a systems and software engineer building high-performance software, firmware, and digital tools.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
