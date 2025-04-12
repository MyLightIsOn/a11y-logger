import type { Metadata } from "next";
import { Header } from "@/components/custom/header";
import { Footer } from "@/components/custom/footer";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "sonner";

import { getGlobalData, getGlobalPageMetadata } from "@/data/loaders";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getGlobalPageMetadata();

  return {
    title: metadata?.data?.title ?? "Epic Next Course",

    description: metadata?.data?.description ?? "Epic Next Course",
  };
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalData = await getGlobalData();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header data={globalData.data.header} />
          <Toaster richColors />
          <div>{children}</div>
          <Footer data={globalData.data.footer} />
        </ThemeProvider>
      </body>
    </html>
  );
}
