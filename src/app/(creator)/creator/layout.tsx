import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell on Scriptly | Developer Marketplace & Creator Platform",
  description: "Turn your code, boilerplates, UI kits, and dev tools into a recurring software income. Keep 95% of direct sales.",
};

export default function CreatorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
