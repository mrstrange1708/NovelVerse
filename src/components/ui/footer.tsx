"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, BookOpen, Heart } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const navigation = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Categories", href: "/category" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
      { name: "Blog", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "License", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/mrstrange1708/" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/shaik-mohammed-junaid-sami-20885430b/" },
    { name: "Email", icon: Mail, href: "mailto:junaidsamishaik@gmail.com" },
  ];

  return (
    <footer className="w-full bg-black border-t border-slate-800">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-4">
            <Link href="/home" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 transition-transform group-hover:scale-110 duration-300">
                <Image
                  src="/logo.png"
                  alt="NovelVerse Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                NovelVerse
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your gateway to endless stories. Discover, read, and explore a
              vast collection of books across all genres, completely free.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span>50,000+ Books Available</span>
            </div>
          </div>


          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Product
                </h3>
                <ul className="space-y-3">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-white hover:bg-slate-800 px-2 py-1 -mx-2 rounded-md transition-all duration-200 inline-block"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Resources
                </h3>
                <ul className="space-y-3">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-white hover:bg-slate-800 px-2 py-1 -mx-2 rounded-md transition-all duration-200 inline-block"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>


              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Legal
                </h3>
                <ul className="space-y-3">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-white hover:bg-slate-800 px-2 py-1 -mx-2 rounded-md transition-all duration-200 inline-block"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>


        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>


            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>© {new Date().getFullYear()} NovelVerse. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>for book lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
