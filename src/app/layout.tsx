import {Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin']
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${inter.className}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
