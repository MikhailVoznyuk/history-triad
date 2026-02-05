import React from "react"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {AppProviders} from "@/app/providers";
import {cormorant} from "@/shared/config/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Historical Triad",
  description: "\n" +
      "A web demonstration of a history project created by students of the Russian State Agrarian University – Moscow Agricultural Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable}`}>
      <body
        className={`antialiased`}
      >
          <AppProviders>
              {children}
          </AppProviders>

      </body>
    </html>
  );
}
