"use client";
import React from "react";
import { BooksHero } from "./hero";
import { Footer } from "@/components/ui/footer";
import { apiService } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    apiService.handleGoogleCallback();

    if (!apiService.isAuthenticated()) {
      router.replace("/login");
      return;
    }
  }, [router]);
  return (
    <div className="bg-black min-h-screen">
      <BooksHero />

      <Footer />
    </div>
  );
}
