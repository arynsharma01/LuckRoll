
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CashProvider, useCash } from "./context/CashContext";
import Cash from "./components/Cash";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luck Roll ",
  description: "Try your Luck ",
   
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <CashProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex lg:justify-evenly justify-between bg-slate-700 w-full min-h-16  p-2 max-h-24 items-center shadow-md shadow-black  " > 
              <div className="flex size-16 ">
              <img src="/dice.png" alt="" /> 
              </div>
              <div className="flex "  >
                <div className=" flex p-4 border border-white rounded-xl text-white gap-1">
                  ₹  <div>
                  <Cash/>
                  </div>
                </div>
                <div className=" bg-blue-500 py-4 px-2 border border-white rounded-xl text-white">
                  recaharge 
                </div>
              </div>

              <div>
                profile 
              </div>
            </div>
        {children}
      </body>
    </html>
    </CashProvider>
  );
}
