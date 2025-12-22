import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import JsonLd from '../../../components/JsonLd';
import { IDEA_CATEGORIES, getColorsForCategory } from '../../../utils/ideaUtils';

// 1. Generate Static Paths for all Categories
export async function generateStaticParams() {
    return IDEA_CATEGORIES.map((cat) => ({
        category: cat.id,
    }));
}

// 2. Dynamic SEO Metadata
export async function generateMetadata({ params }) {
    const { category } = await params;
    const catData = IDEA_CATEGORIES.find(c => c.id === category);

    if (!catData) return { title: 'Ideas' };

    return {
        title: `Best Traditional Chinese Colors for ${catData.title} | ImageColorPickerAI`,
        description: `Looking for ${catData.title} color inspiration? Explore our curated collection of ${getColorsForCategory(category).length} auspicious and harmonious traditional colors perfect for your project.`,
        alternates: {
            canonical: `/ideas/${category}`,
        },
    };
}

export default async function IdeaCategoryPage({ params }) {
    const { category } = await params;
    const catData = IDEA_CATEGORIES.find(c => c.id === category);

    if (!catData) return notFound();

    const curatedColors = getColorsForCategory(category);

    // Generate FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What are the best traditional colors for ${catData.title}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Some of the best traditional colors for ${catData.title} include ${curatedColors[0].name}, ${curatedColors[1].name}, and ${curatedColors[2].name}. These colors traditionally symbolize ${curatedColors[0].meaning.split('.')[0].toLowerCase()}.`
                }
            },
            {
                "@type": "Question",
                "name": `How do I use traditional Chinese colors for ${catData.title}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `You can use these colors to bring meaning and harmony to your ${catData.title.toLowerCase()} projects. For example, use ${curatedColors[0].name} (${curatedColors[0].hex}) as a primary accent color.`
                }
            }
        ]
    };

    return (
        <>
            <JsonLd data={faqSchema} />
            <main className="min-h-screen bg-neutral-50 p-4 py-12 font-sans">
                <div className="max-w-6xl mx-auto">
                    <Link href="/ideas" className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-900 mb-8 transition">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Inspiration Hub
                    </Link>

                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
                            <span className="text-indigo-600 block text-lg font-bold tracking-widest uppercase mb-2">Curated Collection</span>
                            For {catData.title}
                        </h1>
                        <p className="text-xl text-neutral-600 font-serif italic max-w-2xl">
                            {catData.desc}. carefully selected from history to bring meaning and harmony to your modern projects.
                        </p>
                    </div>

                    {/* The "Board" Layout */}
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {curatedColors.map(color => (
                            <div key={color.id} className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-neutral-100">
                                {/* Color Preview */}
                                <div
                                    className="h-48 w-full relative"
                                    style={{ backgroundColor: color.hex }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <span className="text-white font-mono text-sm">{color.hex}</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-neutral-900 mb-1">{color.name}</h3>
                                    <p className="text-neutral-500 text-sm font-serif italic mb-4">{color.nativeName} ({color.phoneticName})</p>

                                    <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 mb-6">
                                        {color.meaning}
                                    </p>

                                    <Link
                                        href={`/color/${color.id}`}
                                        className="block w-full text-center py-3 bg-neutral-50 hover:bg-neutral-900 hover:text-white rounded-xl font-medium text-sm transition-colors"
                                    >
                                        View Palette & Meaning
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
