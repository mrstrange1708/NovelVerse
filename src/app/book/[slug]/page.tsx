"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Book, apiService } from "@/lib/api";
import { Footer } from "@/components/ui/footer";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  NavbarIconButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { IconArrowLeft, IconBookDownload } from "@tabler/icons-react";
import { User as UserIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const fetchBook = async () => {
      if (!slug) {
        console.error("No book slug found in URL");
        return;
      }

      console.log("Fetching book with slug:", slug);
      try {
        setLoading(true);
        const data = await apiService.getBookBySlug(slug);
        console.log("Received book data:", data);
        if (!data) {
          console.error("No book data returned from API");
          setError("Book not found");
        } else {
          setBook(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch book");
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [slug, router]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <div className="container mx-auto px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-[2/3] bg-gray-800 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-800 rounded w-3/4"></div>
                <div className="h-6 bg-gray-800 rounded w-1/2"></div>
                <div className="h-24 bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Book Not Found</h1>
          <p className="text-gray-400 mb-8">
            {error || "The book you're looking for doesn't exist."}
          </p>
          <Link
            href="/category"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors inline-block"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

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

      <div className="container mx-auto px-4 md:px-8 py-26">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <IconArrowLeft size={20} />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          <div className="flex justify-center md:justify-start">
            <div className="relative w-full max-w-md aspect-[2/3] rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                  <div className="text-white text-9xl font-bold opacity-50">
                    {book.title.charAt(0)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {book.title}
                  </h1>
                  <p className="text-xl text-gray-300 mb-4">by {book.author}</p>
                  <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                    {book.category}
                  </span>
                </div>
                <FavoriteButton bookId={book.id} size={32} className="mt-2" />
              </div>
            </div>

            {book.description && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  Description
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
              <div>
                <p className="text-gray-400 text-sm mb-1">Language</p>
                <p className="text-white font-semibold">{book.language}</p>
              </div>
              {book.pageCount && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Pages</p>
                  <p className="text-white font-semibold">{book.pageCount}</p>
                </div>
              )}
              {book.fileSize && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">File Size</p>
                  <p className="text-white font-semibold">
                    {formatFileSize(Number(book.fileSize))}
                  </p>
                </div>
              )}
              {book.publishedAt && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Published</p>
                  <p className="text-white font-semibold">
                    {formatDate(book.publishedAt)}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push(`/reader/${book.slug}`)}
                className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
              >
                <IconBookDownload size={24} />
                <span>Read Now</span>
              </button>

              {book.pdfUrl && (
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-600/30"
                >
                  <IconBookDownload size={24} />
                  <span>Download PDF</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
