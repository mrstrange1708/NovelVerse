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
import {
  User as UserIcon,
  Search,
  X,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  const [sortBy, setSortBy] = useState<
    "title-asc" | "title-desc" | "pages-asc" | "pages-desc"
  >("title-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const CATEGORIES_PER_PAGE = 3;

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

    if (selectedCategory !== "All") {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description?.toLowerCase().includes(query)
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      } else if (sortBy === "pages-asc") {
        return (a.pageCount || 0) - (b.pageCount || 0);
      } else if (sortBy === "pages-desc") {
        return (b.pageCount || 0) - (a.pageCount || 0);
      }
      return 0;
    });

    setFilteredBooks(filtered);
    setCurrentPage(1); 
  }, [selectedCategory, searchQuery, books, sortBy]);

  const categoryGroups = CATEGORIES.slice(1).reduce((acc, category) => {
    const booksInCategory = filteredBooks.filter(
      (book) => book.category === category
    );
    if (booksInCategory.length > 0) {
      acc[category] = booksInCategory;
    }
    return acc;
  }, {} as Record<string, Book[]>);


  const categoryEntries = Object.entries(categoryGroups);
  const totalPages = Math.ceil(categoryEntries.length / CATEGORIES_PER_PAGE);
  const startIndex = (currentPage - 1) * CATEGORIES_PER_PAGE;
  const endIndex = startIndex + CATEGORIES_PER_PAGE;
  const paginatedCategories = categoryEntries.slice(startIndex, endIndex);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar>
        <NavBody className="py-0">
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 z-99">
            <NavbarIconButton href="/account">
              <UserIcon size={20} />
            </NavbarIconButton>
          </div>
        </NavBody>

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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-5xl font-bold text-white">Book Categories</h1>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none bg-gray-900 text-white border border-gray-800 rounded-full px-6 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="pages-asc">Pages (Low-High)</option>
                <option value="pages-desc">Pages (High-Low)</option>
              </select>
              <ArrowUpDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>


            <div className="relative flex-1 md:w-96">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-900 text-white border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
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
              <>
                <div className="flex flex-col gap-12">
                  {paginatedCategories.map(([category, categoryBooks]) => (
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
                              slug={book.slug}
                              title={book.title}
                              author={book.author}
                              coverImage={book.coverImage}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(categoryGroups).length === 0 && (
                    <p className="text-gray-400 text-lg">No books available.</p>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ChevronLeft size={20} />
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                              currentPage === page
                                ? "bg-blue-500 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
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
                          slug={book.slug}
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
