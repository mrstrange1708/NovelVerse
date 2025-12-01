"use client";

import { motion } from "motion/react";
import React, { useState } from "react";
import Link from "next/link";
import { AuroraBackground } from "../components/ui/aurora-background";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { WorldMapDemo } from "../components/ui/WorldMapDemo";
import { Footer } from "@/components/ui/footer";
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


export function HeroSection() {
    const navItems = [
        { name: "About", link: "/about" },
        { name: "Features", link: "/features" },
        { name: "Category", link: "/category" },
        { name: "Contact", link: "/contact" },
    ];
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative w-full mt-[-40px] p-0">
            <Navbar>
                <NavBody className="py-0">
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    <div className="flex items-center gap-4">
                        <Link href="/account">
                            <NavbarButton variant="secondary">Login</NavbarButton>
                        </Link>
                        <Link href="/signin">
                            <NavbarButton variant="primary">Sign in</NavbarButton>
                        </Link>
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
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <NavbarButton
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Login
                                </NavbarButton>
                            </Link>
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

            <AuroraBackground>

                <motion.div
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",

                    }}
                    className="relative container flex flex-col gap-4 items-center justify-center px-4"
                >
                    <motion.div className=" text-white relative mx-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
                        <LayoutTextFlip
                            text="Hello,"
                            words={["Readers", "Leaders", "Writers", "Dreamers", "Explorers", "Creators", "Thinkers"]}
                        />
                    </motion.div>
                    <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                        A Free Library for Every Reader
                    </div>
                    <div className="mt-4 text-center text-base text-neutral-600 dark:text-neutral-400">
                        Discover thousands of books, save your favorites, and enjoy a distraction-free reading space.
                    </div>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <ShimmerButton>
                            Get Started
                        </ShimmerButton>
                    </Link>
                </motion.div>
            </AuroraBackground>

            <WorldMapDemo />
            <Footer />
        </div>
    );
}
