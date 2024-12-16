'use client'

import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import {Navigation, Providers} from "@/components";
import {Provider} from "react-redux";
import store from "@/store";
import "katex/dist/katex.css"

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <head>
            <title>LetsMoveOJ</title>
            <meta name="keywords" content="LetsMoveOJ, Sui, Move, Web3"/>
            <meta name="description" content="一个提升Move语言编码能力的平台！"/>
            {/*<link rel="preload" as="image" href="/logo/logo.jpeg"/>*/}
            <link rel="icon" as="image" href="/logo/logo.jpeg"/>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}>
        <Providers>
            <Provider store={store}>
                <Navigation/>
                {children}
            </Provider>
        </Providers>
        </body>
        </html>
    );
}
