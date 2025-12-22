'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Palette } from 'lucide-react';

const ARCHETYPE_LINKS = [
    { id: 'red', name: 'Imperial Red', href: '/colors/red' },
    { id: 'blue', name: 'Misty Blue', href: '/colors/blue' },
    { id: 'green', name: 'Jade Valley', href: '/colors/green' },
    { id: 'scan', name: 'AI Analyst', href: '/scan' },
];

const LOCALES = [
    { code: 'en', name: 'English', path: '/' },
    { code: 'zh', name: '中文', path: '/zh' },
    { code: 'ja', name: '日本語', path: '/ja' },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100/50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group transition-all" title="Image Color Picker AI - Home">
                    <div className="bg-neutral-900 p-1.5 rounded-lg text-white group-hover:bg-red-600 transition-colors">
                        <Palette className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-neutral-900 tracking-tight hidden sm:block">
                        ImageColorPicker<span className="text-red-600 italic">AI</span>
                    </span>
                </Link>

                {/* Navigation & Locale */}
                <div className="flex items-center gap-2 sm:gap-6">
                    <nav className="hidden md:flex items-center gap-2">
                        {ARCHETYPE_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.id}
                                    href={link.href}
                                    title={`Explore ${link.name} Colors`}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isActive
                                        ? 'bg-neutral-900 text-white shadow-lg'
                                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="h-4 w-[1px] bg-neutral-200 hidden md:block" />

                    <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-full">
                        {LOCALES.map((loc) => {
                            const isActive = pathname.startsWith(loc.path) && (loc.path !== '/' || pathname === '/');
                            // Precise check for root vs others
                            const isExact = loc.code === 'en' ? pathname === '/' || (!pathname.startsWith('/zh') && !pathname.startsWith('/ja')) : pathname.startsWith(loc.path);

                            return (
                                <Link
                                    key={loc.code}
                                    href={loc.path}
                                    className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${isExact
                                        ? 'bg-white text-neutral-900 shadow-sm'
                                        : 'text-neutral-400 hover:text-neutral-600'
                                        }`}
                                >
                                    {loc.code.toUpperCase()}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </header>
    );
}
