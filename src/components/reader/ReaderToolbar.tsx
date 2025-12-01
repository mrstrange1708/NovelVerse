"use client";

import React from "react";
import { IconZoomIn, IconZoomOut, IconZoomReset } from "@tabler/icons-react";

interface ReaderToolbarProps {
  title: string;
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export default function ReaderToolbar({
  title,
  page,
  totalPages,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: ReaderToolbarProps) {
  return (
    <div className="h-14 bg-black/70 text-white fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 backdrop-blur-md z-50">
      <div className="font-medium">{title}</div>

      <div className="flex items-center gap-6">
        {onZoomOut && onZoomIn && onResetZoom && (
          <div className="flex items-center gap-2">
            <button
              onClick={onZoomOut}
              className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              title="Zoom Out"
            >
              <IconZoomOut size={18} />
            </button>
            <button
              onClick={onResetZoom}
              className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              title="Reset Zoom"
            >
              <IconZoomReset size={18} />
            </button>
            <button
              onClick={onZoomIn}
              className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
              title="Zoom In"
            >
              <IconZoomIn size={18} />
            </button>
          </div>
        )}


        <div className="w-40 bg-white/20 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-white h-full"
            style={{ width: `${(page / totalPages) * 100}%` }}
          />
        </div>

        <div className="opacity-80 text-sm">
          {page} / {totalPages}
        </div>

        <button
          onClick={onPrev}
          className="px-3 py-1 bg-white/20 rounded hover:bg-white/30"
        >
          Prev
        </button>
        <button
          onClick={onNext}
          className="px-3 py-1 bg-white/20 rounded hover:bg-white/30"
        >
          Next
        </button>
      </div>
    </div>
  );
}
