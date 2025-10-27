"use client";

import React from "react";

export function Footer() {
    return (
        <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:dark:bg-black/30">
            <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-3">
                        <div className="text-xl font-bold dark:text-white">NovelVerse</div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">
                            A free library for every reader. Discover, save, and enjoy books without distractions.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">Product</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li><a href="#features" className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">Features</a></li>
                            <li><a href="#pricing" className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">Pricing</a></li>
                            <li><a href="#" className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">Changelog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">Resources</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li><a href="#" className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">Docs</a></li>
                            <li><a href="#" className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">Community</a></li>
                            <li><a href="#" className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">Support</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">Company</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li><a href="#" className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">About</a></li>
                            <li><a href="#" className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">Blog</a></li>
                            <li><a href="#" className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800 md:flex-row">
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        © {new Date().getFullYear()} NovelVerse. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                        <a href="#" className="hover:text-black dark:hover:text-white">Privacy</a>
                        <span className="text-neutral-300 dark:text-neutral-700">•</span>
                        <a href="#" className="hover:text-black dark:hover:text-white">Terms</a>
                        <span className="text-neutral-300 dark:text-neutral-700">•</span>
                        <a href="#" className="hover:text-black dark:hover:text-white">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;


