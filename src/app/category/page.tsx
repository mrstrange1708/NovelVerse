"use client";

import { useEffect, useState } from "react";
import { BookCard } from "@/components/ui/book-card";
import { Book, apiService } from "@/lib/api";
import { Footer } from "@/components/ui/footer";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";
import Squares from "@/components/ui/Squares_background";

const CATEGORIES = [
  "All",
  "Self-Help & Personal Development",
  "Finance & Business",
  "Fiction & Literature",
  "Science & Technology",
  "Philosophy & Spirituality",
  "Fantasy & Adventure",
];

export default function Category() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "About", link: "/about" },
    { name: "Features", link: "/features" },
    { name: "Category", link: "/category" },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await apiService.getBooks();
        // Ensure data is an array
        const booksArray = Array.isArray(data) ? data : [];
        console.log("Fetched books:", booksArray);
        setBooks(booksArray);
        setFilteredBooks(booksArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch books");
        console.error("Error fetching books:", err);
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) => book.category === selectedCategory);
      setFilteredBooks(filtered);
    }
  }, [selectedCategory, books]);

  const categoryGroups = CATEGORIES.slice(1).reduce((acc, category) => {
    const booksInCategory = books.filter((book) => book.category === category);
    if (booksInCategory.length > 0) {
      acc[category] = booksInCategory;
    }
    return acc;
  }, {} as Record<string, Book[]>);

  return (
    <div className="bg-black min-h-screen">
      
      {/* Navbar */}
      <Navbar>
        <NavBody className="py-0">
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <Link href="/account">
              <IconUser size={20} />
            </Link>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <div className="container mx-auto px-4 py-36">
        <h1 className="text-5xl font-bold mb-8 text-white">Book Categories</h1>

        {/* Category Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 whitespace-nowrap ${selectedCategory === category
                ? "bg-emerald-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col gap-8">
            {[...Array(3)].map((_, sectionIdx) => (
              <div key={sectionIdx}>
                <h2 className="text-2xl font-bold mb-6 text-white">Loading...</h2>
                <div className="flex gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[160px] h-[240px] bg-gray-900 border border-gray-800 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="py-8">
            <p className="text-red-400 text-xl">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {selectedCategory === "All" ? (
              <div className="flex flex-col gap-12">
                {Object.entries(categoryGroups).map(([category, categoryBooks]) => (
                  <div key={category}>
                    <h2 className="text-2xl font-bold mb-6 text-white">{category}</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {categoryBooks.map((book) => (
                        <div key={book.id} className="flex-shrink-0 w-[160px]">
                          <BookCard
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            coverImage={book.coverImage}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">
                  {selectedCategory} ({filteredBooks.length})
                </h2>
                {filteredBooks.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {filteredBooks.map((book) => (
                      <div key={book.id} className="flex-shrink-0 w-[160px]">
                        <BookCard
                          id={book.id}
                          title={book.title}
                          author={book.author}
                          coverImage={book.coverImage}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-lg">No books found in this category.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
