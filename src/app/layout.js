import {
  Playfair_Display,
  Noto_Serif_Bengali,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-en-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerifBn = Noto_Serif_Bengali({
  variable: "--font-bn-serif",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Subnex",
  description: "Digital subscription platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${notoSerifBn.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
