
import Link from 'next/link';
import JsonLd from '../../../components/JsonLd';
import { notFound } from 'next/navigation';
import { ArrowLeft, Copy, Download, Share2, Palette, Info, Tag } from 'lucide-react';
import { getColorById, getAllColors, getCollectionMetadata, getRelatedColors } from '../../../utils/colorData';
import WallpaperGenerator from '../../../components/WallpaperGenerator';
import ColorHarmony from '../../../components/ColorHarmony';
import ColorActions from '../../../components/ColorActions';
import ColorTexture from '../../../components/ColorTexture';
import ColorComparison from '../../../components/ColorComparison';
import PaletteDisplay from '../../../components/PaletteDisplay';
import Visualizer from '../../../components/Visualizer';

// 1. Generate Static Params for all 500+ colors (Global)
export async function generateStaticParams() {
    const colors = getAllColors();
    return colors.map((color) => ({
        slug: color.id,
    }));
}

export async function generateMetadata({ params }) {
    const color = getColorById(params.slug);
    if (!color) return { title: 'Color Not Found' };

    const meta = getCollectionMetadata(color.collectionId);

    return {
        title: `${color.name} (${color.nativeName}) - ${meta.name} | Image Color Picker AI`,
        description: `${color.name} (${color.nativeName}, ${color.hex}) - ${color.meaning} Part of the ${meta.name} collection.`,
        alternates: {
            canonical: `/ color / ${color.id} `,
        },
    };
}

export default function ColorDetail({ params }) {
    const color = getColorById(params.slug);

    if (!color) {
        notFound();
    }

    // Get Metadata for UI labels
    const collectionMeta = getCollectionMetadata(color.collectionId);

    // Dynamic Labels based on collection
    const nativeLabel = color.collectionId === 'japanese' ? 'Kanji' : 'Chinese';

    // Find related colors using Service
    const relatedColors = getRelatedColors(color);

    // Calculate RGB for display
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color.hex);
    const rgb = result
        ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
        : 'rgb(0,0,0)';

    // Generate Structured Data (Product Schema)
    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": `${color.name} (Traditional Chinese Color)`,
        "image": [
            `https://imagecolorpickerai.com/api/og/color?id=${color.id}`
        ],
        "description": color.meaning,
        "brand": {
            "@type": "Brand",
            "name": "ImageColorPickerAI"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://imagecolorpickerai.com/color/${color.id}`,
            "priceCurrency": "USD",
            "price": "0.00",
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <>
            <JsonLd data={productSchema} />
            <div className="bg-neutral-50 min-h-screen pb-20 flex justify-center p-4 py-12 font-sans">
                <div className="max-w-3xl w-full">

                    {/* Hero Section */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100">
                        <div className="h-64 w-full relative group">
                            {/* Fallback color background */}
                            <div
                                className="absolute inset-0 z-0"
                                style={{ backgroundColor: color.hex }}
                            />
                            {/* Optimized Texture Image - Guarded Client Component */}
                            <ColorTexture
                                src={`/images/colors/${color.id}.webp`}
                                alt={`${color.name} - ${collectionMeta.name} Texture`}
                            />
                        </div>

                        <div className="p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                <div>
                                    <h1 className="text-4xl font-bold text-neutral-900 mb-2">{color.name}</h1>
                                    <p className="text-xl font-serif text-neutral-500 italic">{color.nativeName} ({color.phoneticName})</p>
                                </div>
                                <div className="flex flex-col md:items-end">
                                    <span className="text-3xl font-mono font-bold text-neutral-800 tracking-wider">{color.hex}</span>
                                    <span className="text-sm font-mono text-neutral-400 mt-1">{rgb}</span>
                                </div>
                            </div>

                            {/* Interactive Actions */}
                            <ColorActions hex={color.hex} rgb={rgb} colorName={color.name} />

                            <div className="prose prose-neutral max-w-none mt-10">
                                <h3 className="text-sm font-bold uppercase text-neutral-400 tracking-wider mb-2">Cultural Meaning ({nativeLabel})</h3>
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

                            {/* Color Harmonies */}
                            <ColorHarmony hex={color.hex} />

                            {/* Palette Generator (Phase 17) */}
                            <PaletteDisplay baseColor={color.hex} />

                            {/* Visual Studio (Phase 19) */}
                            <Visualizer colorHex={color.hex} />

                            {/* AI Generator */}
                            <div className="border-t mt-12 pt-12">
                                <WallpaperGenerator
                                    colorName={color.name}
                                    hex={color.hex}
                                    chinese={color.nativeName}
                                />
                            </div>

                            {/* Color Comparison (SEO Hub Strategy) */}
                            <ColorComparison currentColor={color} relatedColors={relatedColors} />
                        </div>
                    </div>

                    {/* Affiliate / Upsell Placeholder (Monetization Protocol) */}
                    <div className="mt-12 p-8 bg-sky-50 rounded-2xl border border-sky-100 text-center">
                        <h3 className="text-lg font-bold text-sky-900 mb-2">Love this color?</h3>
                        <p className="text-sky-700 mb-4">Get the complete {collectionMeta.name} Swatch Guide.</p>
                        <button className="px-6 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition">
                            View Design Guide
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

