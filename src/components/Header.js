'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Palette } from 'lucide-react';

const ARCHETYPE_LINKS = [
    { id: 'red', name: 'Imperial Red', href: '/colors/red' },
    { id: 'blue', name: 'Misty Blue', href: '/colors/blue' },
    { id: 'green', name: 'Jade Valley', href: '/colors/green' },
    { id: 'warm', name: 'Sunset Embers', href: '/colors/warm' },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100/50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group transition-all">
                    <div className="bg-neutral-900 p-1.5 rounded-lg text-white group-hover:bg-red-600 transition-colors">
                        <Palette className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-neutral-900 tracking-tight hidden sm:block">
                        ImageColorPicker<span className="text-red-600 italic">AI</span>
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-1 sm:gap-4">
                    {ARCHETYPE_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.id}
                                href={link.href}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isActive
                                        ? 'bg-neutral-900 text-white shadow-lg'
                                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
