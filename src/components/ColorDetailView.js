import Link from 'next/link';
import JsonLd from './JsonLd';
import { notFound } from 'next/navigation';
import { Copy, Download, Share2, Palette, Info, Tag } from 'lucide-react';
import { getColorById, getCollectionMetadata, getRelatedColors } from '../utils/colorData';
import WallpaperGenerator from './WallpaperGenerator';
import ColorHarmony from './ColorHarmony';
import ColorActions from './ColorActions';
import ColorTexture from './ColorTexture';
import ColorComparison from './ColorComparison';
import PaletteDisplay from './PaletteDisplay';
import Visualizer from './Visualizer';

export function ColorDetailView({ params, locale = 'en' }) {
    const color = getColorById(params.slug);

    if (!color) {
        notFound();
    }

    // Get Metadata for UI labels
    const collectionMeta = getCollectionMetadata(color.collectionId);

    // Dynamic Labels based on locale and collection
    const labels = {
        en: {
            meaning: `Cultural Meaning (${color.collectionId === 'japanese' ? 'Kanji' : 'Chinese'})`,
            related: 'Related Harmony',
            love: 'Love this color?',
            guide: `Get the complete ${collectionMeta.name} Swatch Guide.`,
            view: 'View Design Guide',
            back: 'Back to Collection',
            cluster: 'More colors in this category'
        },
        zh: {
            meaning: `文化背景 (${color.collectionId === 'japanese' ? '日文' : '中文'})`,
            related: '相关配色',
            love: '喜欢这个颜色吗？',
            guide: `获取完整的 ${collectionMeta.name} 设计指南。`,
            view: '查看设计指南',
            back: '返回集合',
            cluster: '此类别的更多颜色'
        },
        ja: {
            meaning: `文化的背景 (${color.collectionId === 'japanese' ? '漢字' : '中国語'})`,
            related: '関連配色',
            love: 'この色が気に入りましたか？',
            guide: `完全な ${collectionMeta.name} スウォッチガイドを入手。`,
            view: 'デザインガイドを見る',
            back: 'コレクションに戻る',
            cluster: 'このカテゴリーの他の色'
        }
    };

    const t = labels[locale] || labels.en;

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
                                <h3 className="text-sm font-bold uppercase text-neutral-400 tracking-wider mb-2">{t.meaning}</h3>
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
                                        title={`See all ${tag} colors`}
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
                        <h3 className="text-lg font-bold text-sky-900 mb-2">{t.love}</h3>
                        <p className="text-sky-700 mb-4">{t.guide}</p>
                        <button className="px-6 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition">
                            {t.view}
                        </button>
                    </div>

                    {/* Topic Cluster Footer (Phase 30: Link Authority) */}
                    <div className="mt-16 pt-8 border-t border-neutral-200">
                        <h3 className="text-sm font-bold uppercase text-neutral-400 tracking-wider mb-6 flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            {t.cluster}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {relatedColors.slice(0, 12).map(c => (
                                <Link
                                    key={c.id}
                                    href={`${locale === 'en' ? '' : `/${locale}`}/color/${c.id}`}
                                    title={`View details for ${c.name}`}
                                    className="group block"
                                >
                                    <div
                                        className="h-12 w-full rounded-lg shadow-sm border border-neutral-100 group-hover:scale-105 transition-transform"
                                        style={{ backgroundColor: c.hex }}
                                    />
                                    <span className="text-[10px] text-neutral-400 mt-1 block truncate font-mono">
                                        {c.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
