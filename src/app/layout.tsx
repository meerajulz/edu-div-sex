import { Inter } from "next/font/google";
import "./globals.css";
import LandscapeLayout from "./LandscapeLayout";

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
      <head>
        {/* These meta tags encourage landscape orientation */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="screen-orientation" content="landscape" />
        <meta name="x5-orientation" content="landscape" />
        <meta name="msapplication-orientation" content="landscape" />
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        <LandscapeLayout>
          {children}
        </LandscapeLayout>
      </body>
    </html>
  );
}