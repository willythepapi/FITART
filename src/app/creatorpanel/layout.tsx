import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Creator Panel | Zzelix",
    description: "Create interactive visual novel stories with Zzelix Creator Panel",
};

export default function CreatorPanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Creator Panel has its own layout without Navbar/Footer
    return <>{children}</>;
}
