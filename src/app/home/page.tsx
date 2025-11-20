"use client";
import React from "react";
import { BooksHero } from "./hero";
import { Footer } from "@/components/ui/footer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { handleGoogleCallback, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      // Check if there's a token in the URL (Google callback)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        // Handle Google OAuth callback
        await handleGoogleCallback();
      }
    };

    handleAuth();
  }, [handleGoogleCallback]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="bg-black min-h-screen">
      <BooksHero />

      <Footer />
    </div>
  );
}
