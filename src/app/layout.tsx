import "./globals.css";
import "leaflet/dist/leaflet.css";

import { Inter, Sora } from "next/font/google";
import ThemeProvider from "@/providers/theme-provider";
import Navbar from "@/components/layout/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable}`}
    >
      <body>
        <ThemeProvider>
          <div className="min-h-screen">
            <Navbar />

            <main className="pt-4">
              <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
