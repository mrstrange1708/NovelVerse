"use client";
import React from "react";
import { BooksHero } from "./hero";
import { BooksSection } from "@/components/ui/books-section";
import { Footer } from "@/components/ui/footer";
import { apiService } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Handle Google OAuth token in URL if present
    apiService.handleGoogleCallback();

    if (!apiService.isAuthenticated()) {
      router.replace("/login");
      return;
    }
  }, []);
  return (
    <div className="bg-black min-h-screen">
      <BooksHero />
      
      <Footer />
    </div>
  );
}

