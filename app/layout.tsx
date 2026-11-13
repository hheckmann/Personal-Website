import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hailey | Software Engineer",
  description:
    "Hailey's portfolio, a software engineer focused on firmware, FPGA, and AI tools.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
