import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Duolingo — The world's best way to learn a language",
  description: "Learn Spanish with fun, bite-sized lessons. Science-based and gamified.",
  icons: {
    icon: "/mascot/duo-happy.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
