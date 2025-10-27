"use client";
import { motion } from "motion/react";
import React, { useState } from "react";
import Link from "next/link";
import { ImagesSlider } from "../../components/ui/images-slider";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { IconUser } from "@tabler/icons-react"

export function BooksHero() {
  const images = [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2000&auto=format&fit=crop",
  ];
  const navItems = [
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Features",
      link: "/features",
    },
    {
      name: "Category",
      link: "/category",
    },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="relative w-full mt-[-40px] p-0">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody className="py-0">
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <Link href="/account">
              <IconUser size={20} />
            </Link>
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
              <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                <NavbarButton
                  variant="primary"
                  className="w-full"
                >
                  Sign in
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <ImagesSlider className="w-screen h-[80vh]" images={images}>
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="z-50 flex flex-col justify-center items-center"
        >
          <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
            Discover Timeless <br /> Books & Classics Novels
          </motion.p>
          <Link
            href="/category"
            className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4 inline-block transition-all hover:bg-emerald-300/20"
          >
            <span>Start Reading →</span>
            <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
          </Link>
        </motion.div>
      </ImagesSlider>
    </div>
  );
}
