import type { Metadata } from "next";
import Header from "@/components/header";


export const metadata: Metadata = {
  title: "Workflow Builder",
  description: "Dashboard Overview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <Header />
      {children}
    </body>
  );
}
