import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Sle8p | Smart 8-Hour Sleep Tracker",
  description:
    "Aplicación de sueño centrada en el cumplimiento dinámico de 8 horas, auto-pausa de podcast/ASMR y despertar en fase ligera.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sle8p",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#05050A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#05050A] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-orange-500/30 selection:text-orange-200">
        <main className="flex-1 pb-24 max-w-md mx-auto w-full relative">
          {children}
        </main>
        <BottomNav />
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
