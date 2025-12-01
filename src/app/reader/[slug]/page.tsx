"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService, Book } from "@/lib/api";
import { IconArrowLeft } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const bookFlipRef = useRef<PageFlipBookRef>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const stateRef = useRef({ user, book, manifest, currentPage });
  useEffect(() => {
    stateRef.current = { user, book, manifest, currentPage };
  }, [user, book, manifest, currentPage]);

  useEffect(() => {
    async function load() {
      if (!slug || Array.isArray(slug)) return;

      setLoading(true);
      const b = await apiService.getBookBySlug(slug);
      const m = await apiService.getManifest(slug);

      setBook(b);
      setManifest(m);

      if (user && b) {
        apiService.trackBookOpen(user.id.toString(), b.id);
      }
      if (user && b) {
        const progress = await apiService.getBookProgress(b.id);
        if (progress && progress.currentPage > 1) {
          setCurrentPage(progress.currentPage);
          toast.info(`Resuming from page ${progress.currentPage}`, {
            position: "top-right",
            autoClose: 2000,
          });
        }
      }

      setLoading(false);
    }
    load();
  }, [slug, user]);

  const saveProgress = async (page: number) => {
    const { user, book, manifest } = stateRef.current;
    if (!user || !book || !manifest) return;

    try {
      setIsSaving(true);
      const result = await apiService.updateProgress(
        user.id.toString(),
        book.slug,
        page,
        manifest.pages.length
      );

      if (result && (result as { data?: { completed: boolean } }).data?.completed) {
        toast.success("🎉 Congratulations! You've completed this book!", {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (currentPage > 0 && user && book) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress(currentPage);
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentPage, user, book]);

  useEffect(() => {
    return () => {
      const { currentPage, user, book, manifest } = stateRef.current;
      if (currentPage > 0 && user && book && manifest) {
        saveProgress(currentPage);
      }
    };

  }, []);

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

      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg backdrop-blur-md transition-all"
      >
        <IconArrowLeft size={20} />
        <span>Back</span>
      </button>


      {isSaving && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-500/80 text-white rounded-lg backdrop-blur-md text-sm">
          Saving progress...
        </div>
      )}

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
