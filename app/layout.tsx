import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wiki Club SATI | Learn • Contribute • Lead",
  description:
    "Official student community of Wiki Club at Samrat Ashok Technological Institute (SATI), Vidisha. Learn technologies, build open-source projects, and lead community initiatives.",
  keywords: [
    "Wiki Club SATI",
    "SATI Vidisha",
    "Student Club",
    "Open Source",
    "Wikipedia",
    "Engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-white selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
