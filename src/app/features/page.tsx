"use client";

import { Footer } from "@/components/ui/footer";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarIconButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton
} from "@/components/ui/resizable-navbar";
import { User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

export default function Features() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "About", link: "/about" },
    { name: "Features", link: "/features" },
    { name: "Category", link: "/category" },
  ];

  const features = [
    {
      icon: "📚",
      title: "Extensive Library",
      description: "Thousands of books across multiple categories including Fiction, Self-Help, Business, Science, and more."
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description: "Find books quickly with our intuitive search and filter system. Search by title, author, or category."
    },
    {
      icon: "⭐",
      title: "Featured Selection",
      description: "Discover hand-picked featured books selected by our team of literary experts."
    },
    {
      icon: "📖",
      title: "Read Anywhere",
      description: "Access your books from any device, anywhere, anytime. No downloads required."
    },
    {
      icon: "🎯",
      title: "Category Filtering",
      description: "Browse books by category with our easy-to-use filter system. Find exactly what you're looking for."
    },
    {
      icon: "🆓",
      title: "Completely Free",
      description: "All books are free to read. No subscriptions, no credit card required, no hidden fees."
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description: "Beautiful, responsive interface that works perfectly on desktop, tablet, and mobile devices."
    },
    {
      icon: "⚡",
      title: "Fast Loading",
      description: "Optimized performance ensures fast page loads and smooth reading experience."
    },
    {
      icon: "🌙",
      title: "Dark Mode",
      description: "Built-in dark mode for comfortable reading in any lighting condition."
    }
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Navbar */}
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

        {/* Mobile Navigation */}
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
                <NavbarButton
                  variant="primary"
                  className="w-full"
                >
                  Account
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Powerful <span className="text-emerald-500">Features</span>
          </h1>
          <p className="text-xl text-gray-400">
            Everything you need for an amazing reading experience
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-6 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/50 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Reading?
            </h2>
            <p className="text-gray-400 mb-6">
              Explore our extensive library and discover your next favorite book
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/category"
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Browse Books
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
