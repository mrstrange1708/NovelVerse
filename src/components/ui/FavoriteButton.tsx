"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { apiService } from "@/lib/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface FavoriteButtonProps {
  bookId: string;
  className?: string;
  size?: number;
}

export function FavoriteButton({
  bookId,
  className = "",
  size = 24,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkFavoriteStatus = async () => {
    try {
      setIsChecking(true);
      const status = await apiService.checkIsFavorite(bookId);
      setIsFavorite(status);
    } catch (error) {
      console.error("Failed to check favorite status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkFavoriteStatus();
  }, [bookId, checkFavoriteStatus]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await apiService.toggleFavorite(bookId);

      if (response.success) {
        setIsFavorite(response.isFavorite);
        toast.success(response.message, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button
        className={`p-2 rounded-full transition-colors bg-gray-800/50 ${className}`}
        disabled
      >
        <Heart size={size} className="text-gray-400 animate-pulse" />
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-300 ${
        isFavorite
          ? "bg-red-500/20 hover:bg-red-500/30"
          : "bg-gray-800/50 hover:bg-gray-700/50"
      } ${className}`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size}
        className={`transition-all duration-300 ${
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-400"
        } ${isLoading ? "animate-pulse" : ""}`}
      />
    </motion.button>
  );
}
