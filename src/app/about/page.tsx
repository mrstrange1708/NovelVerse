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
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { User, BookOpen, Globe, Lightbulb, Shield } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { LampContainer } from "@/components/ui/lamp";

export default function About() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "About", link: "/about" },
    { name: "Features", link: "/features" },
    { name: "Category", link: "/category" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <div className=" min-h-screen bg-slate-950">
      {/* Navbar */}
      <Navbar>
        {/* Desktop Navigation */}
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
                <NavbarButton variant="primary" className="w-full">
                  Account
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Hero Section with Lamp */}
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 200 }}
          whileInView={{ opacity: 1, y: -100 }}
          transition={{
            delay: 0.5,
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="bg-gradient-to-br from-cyan-200 via-cyan-400 to-teal-400 bg-clip-text text-white text-center text-6xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          About <br />
          <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text">
            NovelVerse
          </span>
        </motion.h1>
      </LampContainer>

      {/* Mission Section */}
      <div className="container mx-auto px-4 md:px-8 py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          {/* Main Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Mission
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              NovelVerse is a free, accessible digital library dedicated to
              providing readers worldwide with high-quality books across various
              genres. We believe knowledge should be free and available to
              everyone, regardless of location or financial means.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 p-8 hover:border-cyan-400/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Free Access
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  All books are completely free to read. No subscriptions, no
                  hidden fees.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 p-8 hover:border-cyan-400/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Global Reach
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Accessible worldwide. Read from anywhere, at any time, on any
                  device.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 p-8 hover:border-cyan-400/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Curated Selection
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Carefully selected books across multiple categories to suit
                  every reader.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 p-8 hover:border-cyan-400/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">No Ads</h3>
                <p className="text-gray-400 leading-relaxed">
                  Distraction-free reading experience. No advertisements, no
                  interruptions.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Who We Are Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/5 to-teal-500/5 border border-cyan-500/20 p-12 mb-20"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
                Who{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  We Are
                </span>
              </h2>
              <div className="max-w-3xl mx-auto space-y-4 text-center">
                <p className="text-lg text-gray-300 leading-relaxed">
                  NovelVerse was founded with a simple vision: to make knowledge
                  and literature accessible to everyone, everywhere. We believe
                  in the transformative power of reading and are committed to
                  breaking down barriers to education.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our team of dedicated book lovers curates a diverse collection
                  spanning from timeless classics to modern bestsellers,
                  ensuring that there&apos;s something for every reader on their
                  journey through the literary universe.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Container Scroll Section */}

      <Footer />
    </div>
  );
}
