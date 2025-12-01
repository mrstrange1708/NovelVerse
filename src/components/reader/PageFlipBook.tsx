"use client";

import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

interface Page {
  page: number;
  image: string;
}

interface Props {
  manifest: { pages: Page[] };
  onPageChange: (p: number) => void;
}

export interface PageFlipBookRef {
  nextPage: () => void;
  prevPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const PageFlipBook = forwardRef<PageFlipBookRef, Props>(
  ({ manifest, onPageChange }, ref) => {

    const bookRef = useRef<any>(null);
    const [pages, setPages] = useState<Page[]>([]);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
      if (manifest?.pages) setPages(manifest.pages);
    }, [manifest]);

    useImperativeHandle(ref, () => ({
      nextPage: () => {
        bookRef.current?.pageFlip()?.flipNext();
      },
      prevPage: () => {
        bookRef.current?.pageFlip()?.flipPrev();
      },
      zoomIn: () => {
        setZoom((prev) => Math.min(prev + 0.2, 2));
      },
      zoomOut: () => {
        setZoom((prev) => Math.max(prev - 0.2, 0.6));
      },
      resetZoom: () => {
        setZoom(1);
      },
    }));

    function handleFlip(e: { data: number }) {
      onPageChange(e.data + 1);
    }

    return (
      <div className="w-full h-screen flex items-center justify-center bg-black pb-20 overflow-hidden">
        <div
          style={{
            transform: `scale(${zoom})`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <HTMLFlipBook
            ref={bookRef}
            className="novel-book"
            width={450}
            height={window.innerHeight * 0.85}
            minWidth={300}
            maxWidth={800}
            minHeight={window.innerHeight * 0.8}
            maxHeight={window.innerHeight * 1}
            size="stretch"
            showCover={true}
            usePortrait={false}
            drawShadow={true}
            flippingTime={800}
            maxShadowOpacity={0.5}
            autoSize={false}
            clickEventForward={true}
            swipeDistance={10}
            onFlip={handleFlip}
            startPage={0}
            startZIndex={0}
            mobileScrollSupport={true}
            useMouseEvents={true}
            disableFlipByClick={false}
            showPageCorners={true}
            style={{
              boxShadow: "0 0 60px rgba(0,0,0,0.8)",
            }}
          >
            {pages.map((p) => (
              <div
                key={p.page}
                className="bg-white flex justify-center items-start overflow-hidden relative"
              >
                <Image
                  src={p.image}
                  alt={`Page ${p.page}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>
    );
  }
);

PageFlipBook.displayName = "PageFlipBook";

export default PageFlipBook;
