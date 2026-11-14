import "./globals.css";
export const metadata = {
  title: "Khaata Cricket | খাতা ক্রিকেট",
  description: "খাতার পাতায় জমবে ক্রিকেট!",
};
export const viewport = { width: "device-width", initialScale: 1 };
export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
