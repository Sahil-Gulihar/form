import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "APWD Data entry Portal",
  description: "APWD Data entry Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="">{children}</div>
        <a
          href="https://chat.navdyut.com"
          className="fixed flex right-4 bottom-4"
        >
          Powered by{" "}
          <div className="underline pl-1 pt">
            Navdyut AI
            {/* <Image src="/logo.png" width={80} height={25} alt="Navdyut_AI" /> */}
          </div>
        </a>
      </body>
    </html>
  );
}
