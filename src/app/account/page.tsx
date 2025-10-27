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
} from "@/components/ui/resizable-navbar";
import { IconUser, IconBook, IconSettings, IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

export default function Account() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "About", link: "/about" },
        { name: "Features", link: "/features" },
        { name: "Category", link: "/category" },
    ];

    // These would be fetched from context/API in production
    const user = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        booksRead: 12,
    };

    const recentBooks = [
        { id: "1", title: "Think Like a Monk", author: "Jay Shetty", progress: 65 },
        { id: "2", title: "Atomic Habits", author: "James Clear", progress: 40 },
        { id: "3", title: "Sapiens", author: "Yuval Noah Harari", progress: 100 },
    ];

    const stats = [
        { label: "Books Read", value: user.booksRead, icon: IconBook },
        { label: "Reading Streak", value: "7 days", icon: IconBook },
        { label: "Favorite Category", value: "Self-Help", icon: IconSettings },
    ];

    return (
        <div className="bg-black min-h-screen">
            {/* Navbar */}
            <Navbar>
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
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>

            {/* Main Content */}
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-8 mb-8"
                    >
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-gray-400 mb-4">{user.email}</p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg transition-all"
                                >
                                    <IconSettings size={18} />
                                    <span>Edit Profile</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                        <stat.icon className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">{stat.label}</p>
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Books */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Recently Read</h2>
                        <div className="space-y-4">
                            {recentBooks.map((book, index) => (
                                <Link
                                    key={book.id}
                                    href={`/book/${book.id}`}
                                    className="block group"
                                >
                                    <div className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h3 className="text-white font-semibold group-hover:text-emerald-300 transition-colors">
                                                    {book.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm">{book.author}</p>
                                            </div>
                                            <span className="text-emerald-500 font-semibold">
                                                {book.progress}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-emerald-500 h-2 rounded-full transition-all"
                                                style={{ width: `${book.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Logout Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 text-center"
                    >
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                        >
                            <IconLogout size={18} />
                            <span>Logout</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

