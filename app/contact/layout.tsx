import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — ManaHumanizeAI",
  description: "Get in touch with the ManaHumanizeAI team for inquiries, support, and feedback.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
