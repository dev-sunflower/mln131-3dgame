import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Great Transition - Escape Room",
  description: "An immersive 3D escape room game about Socialism and the path to a Communist Society",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
