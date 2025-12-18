import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Tag } from 'lucide-react';
import chineseColors from '../../../data/chineseColors.json';
import WallpaperGenerator from '../../../components/WallpaperGenerator';

// 1. Generate Static Params for all 500+ colors
export async function generateStaticParams() {
    return chineseColors.map((color) => ({
        slug: color.id,
    }));
}

// 2. Generate SEO Metadata
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const color = chineseColors.find((c) => c.id === slug);
    if (!color) return {};

    return {
        title: `${color.name} Hex Code ${color.hex} - Meaning & Wallpaper | ImageColorPickerAI`,
        description: `Discover the meaning of ${color.name} (${color.chinese}), a traditional Chinese color with Hex Code ${color.hex}. Generate aesthetic wallpapers and see conversions.`,
        alternates: {
            canonical: `https://imagecolorpickerai.com/color/${slug}`,
        },
    };
}

// 3. The Page Component
export default async function Page({ params }) {
    const { slug } = await params;
    const color = chineseColors.find((c) => c.id === slug);

    if (!color) {
        notFound();
    }

    // Calculate RGB for display
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color.hex);
    const rgb = result
        ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
        : 'rgb(0,0,0)';

    return (
        <div className="min-h-screen bg-neutral-50 flex justify-center p-4 py-12 font-sans">
            <div className="max-w-3xl w-full">
                <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-neutral-900 mb-8 transition">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tool
                </Link>

                {/* Hero Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100">
                    <div className="h-64 w-full relative group">
                        {/* Fallback color background */}
                        <div
                            className="absolute inset-0 z-0"
                            style={{ backgroundColor: color.hex }}
                        />
                        {/* Optimized Texture Image */}
                        <img
                            src={`/images/colors/${color.id}.webp`}
                            alt={`${color.name} - Traditional Chinese Color Texture`}
                            className="w-full h-full object-cover relative z-10 transition-opacity duration-500 hover:opacity-90"
                            loading="eager"
                        />
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-neutral-900 mb-2">{color.name}</h1>
                                <p className="text-xl font-serif text-neutral-500 italic">{color.chinese} ({color.pinyin})</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-3xl font-mono font-bold text-neutral-800 tracking-wider">{color.hex}</span>
                                <span className="text-sm font-mono text-neutral-400 mt-1">{rgb}</span>
                            </div>
                        </div>

                        <div className="prose prose-neutral max-w-none">
                            <h3 className="text-sm font-bold uppercase text-neutral-400 tracking-wider mb-2">Cultural Meaning</h3>
                            <p className="text-lg leading-relaxed text-neutral-700">
                                {color.meaning}
                            </p>
                        </div>

                        {/* Tags (Classification Strategy) */}
                        <div className="mt-8 flex flex-wrap gap-2">
                            {color.tags && color.tags.map(tag => (
                                <Link
                                    key={tag}
                                    href={`/colors/${tag}`}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-lg text-sm hover:bg-neutral-200 transition"
                                >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </Link>
                            ))}
                        </div>

                        {/* AI Generator */}
                        <div className="border-t mt-8 pt-8">
                            <WallpaperGenerator colorName={color.name} hex={color.hex} chinese={color.chinese} />
                        </div>
                    </div>
                </div>

                {/* Affiliate / Upsell Placeholder (Monetization Protocol) */}
                <div className="mt-12 p-8 bg-sky-50 rounded-2xl border border-sky-100 text-center">
                    <h3 className="text-lg font-bold text-sky-900 mb-2">Love this color?</h3>
                    <p className="text-sky-700 mb-4">Get the complete Traditional Chinese Color Swatch Guide for Designers.</p>
                    <button className="px-6 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition">
                        View Design Guide
                    </button>
                </div>
            </div>
        </div>
    );
}
