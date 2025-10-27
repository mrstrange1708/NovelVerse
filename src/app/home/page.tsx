"use client";
import React from "react";
import { BooksHero } from "./hero";
import { BooksSection } from "@/components/ui/books-section";
import { Footer } from "@/components/ui/footer";

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <BooksHero />
      <div className="container mx-auto px-8 py-12">
        <BooksSection title="Featured Books" showFeatured={true} />
        <BooksSection title="Popular Books" showFeatured={false} />
      </div>
      <Footer />
    </div>
  );
}

