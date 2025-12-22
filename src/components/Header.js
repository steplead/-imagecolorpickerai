'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Palette } from 'lucide-react';

const LOCALES = [
    { code: 'en', name: 'English', path: '/' },
    { code: 'zh', name: '中文', path: '/zh' },
    { code: 'ja', name: '日本語', path: '/ja' },
    { code: 'es', name: 'Español', path: '/es' },
    { code: 'fr', name: 'Français', path: '/fr' },
    { code: 'de', name: 'Deutsch', path: '/de' },
    { code: 'pt', name: 'Português', path: '/pt' },
];

export default function Header() {
    const pathname = usePathname();

    const getLocalizedLinks = (pathname) => {
        let currentLocale = 'en';
        if (pathname.startsWith('/zh')) currentLocale = 'zh';
        else if (pathname.startsWith('/ja')) currentLocale = 'ja';
        else if (pathname.startsWith('/es')) currentLocale = 'es';
        else if (pathname.startsWith('/fr')) currentLocale = 'fr';
        else if (pathname.startsWith('/de')) currentLocale = 'de';
        else if (pathname.startsWith('/pt')) currentLocale = 'pt';

        const translations = {
            en: { red: 'Imperial Red', blue: 'Misty Blue', green: 'Jade Valley', scan: 'AI Analyst' },
            zh: { red: '中国红', blue: '雾霾蓝', green: '翡翠谷', scan: 'AI分析师' },
            ja: { red: '帝国赤', blue: '霧色', green: '翡翠の谷', scan: 'AIアナリスト' },
            es: { red: 'Rojo Imperial', blue: 'Azul Nebuloso', green: 'Valle de Jade', scan: 'Analista AI' },
            fr: { red: 'Rouge Impérial', blue: 'Bleu Brumeux', green: 'Vallée de Jade', scan: 'Analyste IA' },
            de: { red: 'Kaiserrot', blue: 'Nebelblau', green: 'Jadeland', scan: 'KI-Analyst' },
            pt: { red: 'Vermelho Imperial', blue: 'Azul Nevoado', green: 'Vale de Jade', scan: 'Analista AI' },
        };

        const t = translations[currentLocale] || translations.en;
        const prefix = currentLocale === 'en' ? '' : `/${currentLocale}`;

        return [
            { id: 'red', name: t.red, href: `${prefix}/colors/red` },
            { id: 'blue', name: t.blue, href: `${prefix}/colors/blue` },
            { id: 'green', name: t.green, href: `${prefix}/colors/green` },
            { id: 'scan', name: t.scan, href: `${prefix}/scan` },
        ];
    };

    const links = getLocalizedLinks(pathname);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100/50">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo Only (Proportional Size) */}
                <Link href={pathname.startsWith('/zh') ? '/zh' : pathname.startsWith('/ja') ? '/ja' : pathname.startsWith('/es') ? '/es' : pathname.startsWith('/fr') ? '/fr' : pathname.startsWith('/de') ? '/de' : pathname.startsWith('/pt') ? '/pt' : '/'} className="flex items-center group transition-all" title="Image Color Picker AI - Home">
                    <div className="relative transition-all duration-300">
                        {/* Precision Droplet Clipping */}
                        <div className="relative z-10 w-[84px] h-[84px] rounded-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.1] group-hover:rotate-[8deg]">
                            <img
                                src="/icon.png"
                                alt="Image Color Picker AI"
                                className="w-full h-full object-cover shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]"
                            />
                        </div>
                    </div>
                </Link>

                {/* Navigation & Locale */}
                <div className="flex items-center gap-2 sm:gap-6">
                    <nav className="hidden md:flex items-center gap-2">
                        {links.map((link) => {
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
                            const isExact = loc.code === 'en'
                                ? (pathname === '/' || (!pathname.startsWith('/zh') && !pathname.startsWith('/ja') && !pathname.startsWith('/es') && !pathname.startsWith('/fr') && !pathname.startsWith('/de') && !pathname.startsWith('/pt')))
                                : pathname.startsWith(loc.path);

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
