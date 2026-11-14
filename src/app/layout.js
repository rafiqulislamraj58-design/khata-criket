import "./globals.css";

const SITE_URL = "https://khata-criket.vercel.app";

// আলাদা ইমেজ ফাইল ছাড়াই ব্রাউজার ট্যাবে Next.js-এর লোগো দেখানোর জন্য ইনলাইন SVG
const NEXT_LOGO_ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r="90" fill="#000000"/>
      <path d="M149.5 157.5L69.1 54H54v72h12.1V69.4l73.9 95.5c3.3-2.2 6.5-4.7 9.5-7.4z" fill="#ffffff"/>
      <rect x="115" y="54" width="12" height="72" fill="#ffffff"/>
    </svg>`
  );

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Khaata Cricket | খাতা ক্রিকেট — স্কুলের লাস্ট বেঞ্চের ক্রিকেট গেম",
  description:
    "খাতার পাতায় জমবে ক্রিকেট! ছোটবেলার স্কুলের নস্টালজিক স্পিনার ক্রিকেট গেম খেলুন অনলাইনে, ৪-৬ হাঁকান এবং বন্ধুদের চ্যালেঞ্জ জানান।",
  keywords: [
    "Khaata Cricket",
    "Khata Cricket",
    "খাতা ক্রিকেট",
    "Book Cricket Game",
    "Bangla Cricket Game",
    "Spinner Cricket",
  ],
  icons: {
    icon: NEXT_LOGO_ICON,
    shortcut: NEXT_LOGO_ICON,
    apple: NEXT_LOGO_ICON,
  },
  openGraph: {
    title: "Khaata Cricket | খাতা ক্রিকেট 🏏",
    description:
      "খাতার পাতায় জমবে ক্রিকেট! স্কুলের লাস্ট বেঞ্চের সেই নস্টালজিক খেলা এখন অনলাইনে।",
    url: SITE_URL,
    siteName: "Khaata Cricket",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khaata Cricket Game Preview",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khaata Cricket | খাতা ক্রিকেট 🏏",
    description:
      "খাতার পাতায় জমবে ক্রিকেট! স্কুলের লাস্ট বেঞ্চের সেই নস্টালজিক খেলা।",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}