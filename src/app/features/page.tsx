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
import { User, BookOpen, Zap, Search, Star, Globe, Smartphone, Moon, Filter, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export default function Features() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "About", link: "/about" },
    { name: "Features", link: "/features" },
    { name: "Category", link: "/category" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Vast Digital Library",
      description: "Access over 50,000+ curated books spanning fiction, non-fiction, self-help, business, science fiction, and academic literature."
    },
    {
      icon: Search,
      title: "AI-Powered Search",
      description: "Lightning-fast search engine with intelligent filters. Find books by title, author, genre, or even mood and reading level."
    },
    {
      icon: Star,
      title: "Personalized Curation",
      description: "Discover hand-picked recommendations based on your reading history. Our experts select the finest literature just for you."
    },
    {
      icon: Globe,
      title: "Cross-Platform Sync",
      description: "Seamlessly continue reading across all your devices. Your bookmarks and progress sync automatically in real-time."
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description: "Sophisticated category system with multi-level filters. Sort by popularity, release date, ratings, or reading time."
    },
    {
      icon: Shield,
      title: "Zero Commitment",
      description: "100% free forever. No subscriptions, no trials, no credit cards. Pure unrestricted access to knowledge and entertainment."
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Pixel-perfect responsive interface optimized for every screen size. Native app experience in your browser."
    },
    {
      icon: Zap,
      title: "Blazing Performance",
      description: "Sub-second load times powered by edge CDN. Optimized caching ensures instant page transitions and smooth scrolling."
    },
    {
      icon: Moon,
      title: "Adaptive Theming",
      description: "Automatic dark mode with customizable reading themes. Reduce eye strain with adjustable brightness and sepia tones."
    }
  ];

  return (
    <div className="bg-black min-h-screen relative">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    
      
      {/* Navbar */}
      <Navbar>
        <NavBody className="py-0">
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 z-99">
            <NavbarIconButton href="/account">
              <User size={20} />
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

      {/* Container Scroll Section */}
      <div className="pb-20 relative z-10">
        <ContainerScroll
          titleComponent={
            <>
              <h2 className="text-4xl font-semibold text-white text-center mb-4">
                Experience the future of <br />
                <span className="text-5xl md:text-[5rem] font-bold mt-1 leading-none bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Digital Reading
                </span>
              </h2>
              <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto mt-6">
                Seamlessly browse, discover, and immerse yourself in thousands of books
                with our intuitive and beautiful interface
              </p>
            </>
          }
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10"></div>
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1400"
              alt="NovelVerse Library Interface"
              className="w-full h-full object-cover object-center opacity-90"
              draggable={false}
            />
          </div>
        </ContainerScroll>
      </div>


      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-8 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-semibold">
              ✨ Next-Gen Reading Platform
            </span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Powerful{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              Features
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Built for readers who demand excellence in every detail
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-2xl" />
                  
                  {/* Card */}
                  <div className="relative bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 h-full hover:transform hover:scale-[1.02]">
                    {/* Icon Container */}
                    <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="relative overflow-hidden bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-12">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Transform Your Reading?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of readers who&#39;ve discovered their next favorite book on NovelVerse
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/category"
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Explore Library</span>
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-300 border border-slate-700 hover:border-slate-600"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      
      <Footer />
    </div>
  );
}