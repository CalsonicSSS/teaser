"use client";

import "./globals.css";
import { ReactElement } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/typography";

// as tested, this is the root layout component, which acts as top level entry point for the app
// any client-side navigation will render different target page-level component under this layout (this layout first runs, then the target page level component runs)
export default function RootLayout({ children }: { children: ReactElement }): ReactElement {
  console.log("Root layout runs");

  return (
    // ThemeProvider is a wrapper component we used in top root layout that provides the theme to all other page level components for all navigation of this app
    <ThemeProvider theme={theme}>
      <html lang='en'>
        <body suppressHydrationWarning={true}>{children}</body>
      </html>
    </ThemeProvider>
  );
}
