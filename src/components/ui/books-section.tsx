"use client";

import { useEffect, useState } from "react";
import { BookCard } from "./book-card";
import { Book, apiService } from "@/lib/api";

interface BooksSectionProps {
  title: string;
  showFeatured?: boolean;
}

export function BooksSection({ title, showFeatured = false }: BooksSectionProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = showFeatured
          ? await apiService.getFeaturedBooks()
          : await apiService.getBooks();


        const booksArray = Array.isArray(data) ? data : [];
        console.log("Fetched books:", booksArray);
        setBooks(booksArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch books");
        console.error("Error fetching books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [showFeatured]);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-[160px] h-[240px] bg-gray-900 border border-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {books.map((book) => (
          <div key={book.id} className="flex-shrink-0 w-[160px]">
            <BookCard
              slug={book.slug}
              title={book.title}
              author={book.author}
              coverImage={book.coverImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

