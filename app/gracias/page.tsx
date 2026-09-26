import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYouContent from "@/components/ThankYouContent";

export const metadata: Metadata = {
  title: "Confirmación de Proyecto | Alan López - Sistemas Web B2B",
  description:
    "Tu información técnica ha sido recibida y Alan López revisará tu proyecto para coordinar tu propuesta técnica.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function GraciasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-liquid-abyss flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-bioluminescent-lime border-t-transparent animate-spin" />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
