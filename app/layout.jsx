// app/layout.jsx
import "./globals.css";
import config from "@/site/config.js";

export const metadata = {
  title: config.meta?.title || "Запись",
  description: config.meta?.description || "",
};

export const viewport = {
  themeColor: config.theme?.bg || "#0c0a09",
  width: "device-width",
  initialScale: 1,
};

// app/layout.jsx
export default function RootLayout({ children }) {
    return (
        <html lang="ru">
        <body
            suppressHydrationWarning
            style={{
                margin: 0,
                background: config.theme?.bg || "#0c0a09",
                color: config.theme?.fg || "#f5f0ea",
            }}
        >
        {children}
        </body>
        </html>
    );
}