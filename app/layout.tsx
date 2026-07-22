import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import ScrollMotion from "@/components/ScrollMotion";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const helveticaNeue = localFont({
  variable: "--font-helvetica-neue",
  display: "swap",
  src: [
    {
      path: "../fonts/helvetica-neue/HelveticaNeueUltraLight.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueUltraLightItalic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueThin.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueThinItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueLightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueRoman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueMediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueHeavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueHeavyItalic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueBoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueBlack.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/helvetica-neue/HelveticaNeueBlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "AMINOCLUB — спортивное питание",
  description: "Спортивное питание для ежедневного режима.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${helveticaNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollMotion />
        {children}
      </body>
    </html>
  );
}
