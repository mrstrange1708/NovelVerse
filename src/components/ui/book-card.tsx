"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
}

export function BookCard({ id, title, author, coverImage }: BookCardProps) {
  return (
    <Link href={`/book/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative cursor-pointer transition-transform duration-300 hover:scale-105"
      >
        <div className="relative w-full h-[240px] rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
          {/* Cover Image */}
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-80"
              sizes="160px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
              <div className="text-white text-4xl font-bold opacity-50">
                {(title || "?").charAt(0)}
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Book Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
              {title}
            </h3>
            <p className="text-gray-300 text-xs line-clamp-1">{author}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
