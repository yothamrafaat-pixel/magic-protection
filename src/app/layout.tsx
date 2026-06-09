import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Sidebar from "@/components/Sidebar";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Magic Protection",
  description: "Magic Protection car protection company ERP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.className} bg-slate-950 text-slate-100 min-h-screen`}
      >
        <div className="flex min-h-screen">
          <Sidebar />

          {/* 🟢 Main Content */}
          <main className="flex-1 ml-64 p-6">
            <div className="bg-zinc-950 min-h-screen rounded-xl p-6 shadow-lg">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}