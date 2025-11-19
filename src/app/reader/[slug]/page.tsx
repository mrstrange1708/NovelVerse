"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService, Book } from "@/lib/api";
import { IconArrowLeft } from "@tabler/icons-react";

import PageFlipBook, {
  PageFlipBookRef,
} from "@/components/reader/PageFlipBook";
import ReaderToolbar from "@/components/reader/ReaderToolbar";
import LoadingScreen from "@/components/reader/LoadingScreen";

interface Manifest {
  pages: Array<{ page: number; image: string }>;
}

export default function ReaderPage() {
  const { slug } = useParams();
  const router = useRouter();
  const bookFlipRef = useRef<PageFlipBookRef>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function load() {
      if (!slug || Array.isArray(slug)) return;

      setLoading(true);
      const b = await apiService.getBookBySlug(slug);
      const m = await apiService.getManifest(slug);

      setBook(b);
      setManifest(m);
      setLoading(false);
    }
    load();
  }, [slug]);

  function nextPage() {
    bookFlipRef.current?.nextPage();
  }

  function prevPage() {
    bookFlipRef.current?.prevPage();
  }

  function zoomIn() {
    bookFlipRef.current?.zoomIn();
  }

  function zoomOut() {
    bookFlipRef.current?.zoomOut();
  }

  function resetZoom() {
    bookFlipRef.current?.resetZoom();
  }

  if (loading) return <LoadingScreen />;

  if (!book || !manifest) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Book not found
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg backdrop-blur-md transition-all"
      >
        <IconArrowLeft size={20} />
        <span>Back</span>
      </button>

      <PageFlipBook
        ref={bookFlipRef}
        manifest={manifest}
        onPageChange={(p) => setCurrentPage(p)}
      />

      <ReaderToolbar
        title={book.title}
        page={currentPage}
        totalPages={manifest.pages.length}
        onPrev={prevPage}
        onNext={nextPage}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
      />
    </div>
  );
}
