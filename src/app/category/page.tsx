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
  NavbarIconButton,
} from "@/components/ui/resizable-navbar";
import { User as UserIcon, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: "About", link: "/about" },
    { name: "Features", link: "/features" },
    { name: "Category", link: "/category" },
    { name: "Contact", link: "/contact" },
  ];

  useEffect(() => {
    if (!apiService.isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await apiService.getBooks();
        const booksArray = Array.isArray(data) ? data : [];
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
  }, [router]);

  useEffect(() => {
    let filtered = books;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description?.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  }, [selectedCategory, searchQuery, books]);

  const categoryGroups = CATEGORIES.slice(1).reduce((acc, category) => {
    const booksInCategory = filteredBooks.filter(
      (book) => book.category === category
    );
    if (booksInCategory.length > 0) {
      acc[category] = booksInCategory;
    }
    return acc;
  }, {} as Record<string, Book[]>);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Navbar */}
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody className="py-0">
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 z-99">
            <NavbarIconButton href="/account">
              <UserIcon size={20} />
            </NavbarIconButton>
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
            <div className="flex w-full flex-col gap-4">
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                <NavbarButton variant="primary" className="w-full">
                  Account
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <div className="container mx-auto px-4 py-36">
        {/* Header Row (Title + Search Bar) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-5xl font-bold text-white">Book Categories</h1>

          {/* Search Bar */}
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search books by title, author, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-gray-900 text-white border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category
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
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Loading...
                </h2>
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
            {selectedCategory === "All" && !searchQuery ? (
              <div className="flex flex-col gap-12">
                {Object.entries(categoryGroups).map(
                  ([category, categoryBooks]) => (
                    <div key={category}>
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        {category}
                      </h2>
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {categoryBooks.map((book) => (
                          <div
                            key={book.id}
                            className="flex-shrink-0 w-[160px]"
                          >
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
                  )
                )}
                {Object.keys(categoryGroups).length === 0 && (
                  <p className="text-gray-400 text-lg">No books available.</p>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">
                  {searchQuery
                    ? `Search Results`
                    : `${selectedCategory} (${filteredBooks.length})`}
                </h2>
                {filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredBooks.map((book) => (
                      <div key={book.id}>
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
                  <p className="text-gray-400 text-lg">
                    {searchQuery
                      ? `No books found matching "${searchQuery}"`
                      : "No books found in this category."}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}