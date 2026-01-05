'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Series' },
    { href: '/films', label: 'Films' },
    { href: '/new', label: 'New & Popular' },
    { href: '/my-list', label: 'My List' },
    { href: '/browse-by-language', label: 'Browse by Language' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 px-[4%] py-3 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
                }`}
        >
            <div className="flex items-center justify-between">
                {/* Left */}
                <div className="flex items-center gap-8">
                    <Link href="/">
                        <Logo size="md" />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-gray-300 hover:text-gray-400 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Nav Dropdown */}
                    <div className="lg:hidden">
                        <button className="flex items-center gap-1 text-sm text-white">
                            Browse
                            <ChevronDown className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    {isSearchOpen ? (
                        <div className="flex items-center bg-black border border-white px-2 py-1">
                            <Search className="size-4 text-white" />
                            <input
                                type="text"
                                placeholder="Titles, people, genres"
                                className="bg-transparent text-sm text-white px-2 py-1 w-48 focus:outline-none placeholder-gray-400"
                                autoFocus
                                onBlur={() => setIsSearchOpen(false)}
                            />
                        </div>
                    ) : (
                        <button onClick={() => setIsSearchOpen(true)}>
                            <Search className="size-5 text-white hover:text-gray-300 transition-colors" />
                        </button>
                    )}

                    {/* Kids */}
                    <span className="hidden md:block text-sm text-white hover:text-gray-300 cursor-pointer">
                        Kids
                    </span>

                    {/* Notifications */}
                    <button className="relative">
                        <Bell className="size-5 text-white hover:text-gray-300 transition-colors" />
                    </button>

                    {/* Profile */}
                    <button className="flex items-center gap-1 group">
                        <div className="w-8 h-8 rounded overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-purple to-cyan" />
                        </div>
                        <ChevronDown className="size-4 text-white group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
