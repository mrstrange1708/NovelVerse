"use client";

import { Footer } from "@/components/ui/footer";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarIconButton,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import {
  IconBook,
  IconSettings,
  IconLogout,
  IconTrendingUp,
  IconAward,
  IconClock,
  IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Account() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { logout, user, isAuthenticated, isLoading } = useAuth();

  const navItems = [
    { name: "About", link: "/about" },
    { name: "Features", link: "/features" },
    { name: "Category", link: "/category" },
    { name: "Contact", link: "/contact" },
  ];

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace("/login");
    }
  }, [isAuthenticated, user, router, isLoading]);

  if (isLoading || !user) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  const recentBooks = user.readBooks?.slice(-3).reverse() || [];

  const stats = [
    {
      label: "Books Completed",
      value: user.booksRead || 0,
      icon: IconBook,
      color: "blue",
      description: "Total books finished",
    },
    {
      label: "Reading Streak",
      value: "7 days",
      icon: IconTrendingUp,
      color: "cyan",
      description: "Keep it up!",
    },
    {
      label: "Total Books",
      value: user.readBooks?.length || 0,
      icon: IconAward,
      color: "indigo",
      description: "In your library",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30",
    },
    cyan: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
    },
    indigo: {
      bg: "bg-indigo-500/20",
      text: "text-indigo-400",
      border: "border-indigo-500/30",
    },
  };

  return (
    <div className="bg-black min-h-screen pt-20">
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

      <div className="container mx-auto px-4 md:px-8 py-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {user.firstName}
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Track your reading journey and discover new books
            </p>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl"
          >

            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-md opacity-50" />
                <div className="relative w-28 h-28 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
              </div>


              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-400 mb-1 flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  {user.email}
                </p>
                <p className="text-blue-400 text-sm mb-6">Member since 2024</p>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 text-blue-300 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <IconSettings size={18} />
                    <span className="font-medium">Edit Profile</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>


          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const colors =
                colorClasses[stat.color as keyof typeof colorClasses];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl border ${colors.border} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className={`w-7 h-7 ${colors.text}`} />
                    </div>
                    <div
                      className={`text-sm ${colors.text} font-medium px-3 py-1 ${colors.bg} rounded-full`}
                    >
                      Active
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className={`text-4xl font-bold ${colors.text} mb-1`}>
                      {stat.value}
                    </p>
                    <p className="text-gray-500 text-xs">{stat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <IconClock className="text-blue-400" size={28} />
                  Recently Read
                </h2>
                <p className="text-gray-400 text-sm">
                  Your latest reading adventures
                </p>
              </div>
              {recentBooks.length > 0 && (
                <Link
                  href="/category"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  View All
                  <span>→</span>
                </Link>
              )}
            </div>

            {recentBooks.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/book/${book.id}`} className="block group">
                      <div className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 hover:border-blue-500/30">
                        <div className="flex items-start gap-3">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                              <IconBook className="text-blue-400" size={24} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors truncate mb-1">
                              {book.title}
                            </h3>
                            <p className="text-gray-400 text-sm truncate mb-2">
                              {book.author}
                            </p>
                            {book.category && (
                              <span className="inline-block text-xs text-blue-400 font-medium px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md">
                                {book.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <IconBook className="w-12 h-12 text-gray-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No books yet
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Start your reading journey today and discover amazing stories
                  waiting for you!
                </p>
                <Link
                  href="/category"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <IconStar size={20} />
                  Explore Books
                </Link>
              </div>
            )}
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 hover:scale-105 group"
            >
              <IconLogout
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              <span className="font-medium">Sign Out</span>
            </button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
