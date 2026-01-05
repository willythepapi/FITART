'use client';

import Link from 'next/link';

const footerLinks = [
    { label: 'Audio Description', href: '#' },
    { label: 'Help Centre', href: '#' },
    { label: 'Gift Cards', href: '#' },
    { label: 'Media Centre', href: '#' },
    { label: 'Investor Relations', href: '#' },
    { label: 'Jobs', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Legal Notices', href: '#' },
    { label: 'Cookie Preferences', href: '#' },
    { label: 'Corporate Information', href: '#' },
    { label: 'Contact Us', href: '#' },
];

export function Footer() {
    return (
        <footer className="bg-[#141414] px-[4%] py-12">
            <div className="max-w-[980px]">
                {/* Social icons row - placeholder */}
                <div className="flex gap-4 mb-6">
                    <div className="w-6 h-6 bg-white/20 rounded" />
                    <div className="w-6 h-6 bg-white/20 rounded" />
                    <div className="w-6 h-6 bg-white/20 rounded" />
                    <div className="w-6 h-6 bg-white/20 rounded" />
                </div>

                {/* Links grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-xs text-gray-400 hover:underline"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Service code button */}
                <button className="px-4 py-1.5 border border-gray-500 text-xs text-gray-400 mb-6 hover:text-white transition-colors">
                    Service Code
                </button>

                {/* Copyright - static year to avoid hydration mismatch */}
                <p className="text-xs text-gray-500">
                    © 2024-2026 Zzelix, Inc.
                </p>
            </div>
        </footer>
    );
}
