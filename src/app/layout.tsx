import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import { Viewport } from "next";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Reginald Ojunga | Compiler Engineer",
    description:
        "Professional portfolio of Reginald Ojunga - Software Engineering practitioner, compiler engineer and budding chip architect.",
    // icons: {
    //     icon: [
    //         { url: "/favicon.svg", type: "image/svg+xml" },
    //         { url: "/favicon.ico", sizes: "" },
    //     ],
    //     apple: "/favicon.svg",
    // },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
            >
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
