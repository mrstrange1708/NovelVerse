"use client";

import Link from "next/link";
import Image from "next/image";
import { IconBook, IconClock } from "@tabler/icons-react";
import { motion } from "motion/react";
import { ContinueReadingBook } from "@/lib/api";

interface ContinueReadingCardProps {
  book: ContinueReadingBook;
  index?: number;
}

export function ContinueReadingCard({
  book,
  index = 0,
}: ContinueReadingCardProps) {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/reader/${book.slug}`} className="block group">
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 hover:from-gray-900 hover:to-gray-800 border border-gray-700/50 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10">
          <div className="flex gap-4">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  width={64}
                  height={96}
                  className="w-16 h-24 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-16 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                  <IconBook className="text-blue-400" size={28} />
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors truncate mb-1">
                {book.title}
              </h3>
              <p className="text-gray-400 text-sm truncate mb-2">
                {book.author}
              </p>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>{Math.round(book.progressPercent)}% complete</span>
                  <span>
                    Page {book.currentPage} of {book.totalPages}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${book.progressPercent}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>

              {/* Last Read */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <IconClock size={14} />
                <span>{getTimeAgo(book.lastReadAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
