import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Provider } from "@/lib/trpc/trpc-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog CMS",
  description: "A web-based content management system for blogging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="silk" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster
          containerStyle={{ zIndex: 100, top: "2rem" }}
          position="top-center"
        />
        <Provider>
          {children}
          <footer className="w-full border-t border-base-200 mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-base-content/60">
              Developed by{" "}
              <a
                href="https://github.com/esisss"
                target="_blank"
                rel="noreferrer"
                className="link link-hover"
              >
                @esisss
              </a>
            </div>
          </footer>
        </Provider>
      </body>
    </html>
  );
}
