import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRightLeft, Palette, Info } from 'lucide-react';
import chineseColors from '../../../data/chineseColors.json';
import ColorActions from '../../../components/ColorActions';

// 1. Generate Static Params (A few popular ones to start)
export async function generateStaticParams() {
    // For a massive SEO play, we could generate all combinations, 
    // but for now we'll do 10 popular ones or let them be dynamic (SSR).
    // Let's do a sample of combinations from the same tags.
    const params = [];
    const tags = ['red', 'blue', 'green', 'warm'];

    tags.forEach(tag => {
        const colors = chineseColors.filter(c => c.tags && c.tags.includes(tag)).slice(0, 3);
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                params.push({ comparison: `${colors[i].id}-vs-${colors[j].id}` });
            }
        }
    });
    return params;
}

// 2. Generate Metadata
export async function generateMetadata({ params }) {
    const { comparison } = await params;
    const parts = comparison.split('-vs-');
    if (parts.length !== 2) return { title: 'Color Comparison' };

    const c1 = chineseColors.find(c => c.id === parts[0]);
    const c2 = chineseColors.find(c => c.id === parts[1]);

    if (!c1 || !c2) return { title: 'Color Comparison' };

    return {
        title: `${c1.name} vs ${c2.name} - Color Comparison & Hex Codes | ImageColorPickerAI`,
        description: `Compare ${c1.name} (${c1.hex}) and ${c2.name} (${c2.hex}). Discover the differences in cultural meaning, aesthetics, and design applications for these traditional Chinese colors.`,
    };
}

// 3. Page Component
export default async function Page({ params }) {
    const { comparison } = await params;
    const parts = comparison.split('-vs-');

    if (parts.length !== 2) return notFound();

    const c1 = chineseColors.find(c => c.id === parts[0]);
    const c2 = chineseColors.find(c => c.id === parts[1]);

    if (!c1 || !c2) return notFound();

    return (
        <div className="min-h-screen bg-neutral-50 p-4 py-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-neutral-900 mb-8 transition">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tool
                </Link>

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-200 text-neutral-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <ArrowRightLeft className="w-3 h-3" /> Comparison Hub
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                        {c1.name} <span className="text-neutral-300">vs</span> {c2.name}
                    </h1>
                    <p className="text-neutral-500 max-w-xl mx-auto italic">
                        Exploring the nuances between {c1.chinese} and {c2.chinese}.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Color 1 Card */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 transition-all hover:translate-y-[-4px]">
                        <div className="h-48 w-full" style={{ backgroundColor: c1.hex }}></div>
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-neutral-900 mb-1">{c1.name}</h2>
                            <p className="text-neutral-500 font-serif italic mb-6">{c1.chinese} · {c1.hex}</p>

                            <div className="space-y-4">
                                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                                    <h4 className="text-[10px] uppercase font-bold text-neutral-400 mb-2 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> Meaning
                                    </h4>
                                    <p className="text-sm text-neutral-700 leading-relaxed">{c1.meaning}</p>
                                </div>
                                <ColorActions hex={c1.hex} rgb={c1.hex} />
                                <Link
                                    href={`/color/${c1.id}`}
                                    className="block text-center py-3 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition"
                                >
                                    Full {c1.name} Details
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Color 2 Card */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 transition-all hover:translate-y-[-4px]">
                        <div className="h-48 w-full" style={{ backgroundColor: c2.hex }}></div>
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-neutral-900 mb-1">{c2.name}</h2>
                            <p className="text-neutral-500 font-serif italic mb-6">{c2.chinese} · {c2.hex}</p>

                            <div className="space-y-4">
                                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                                    <h4 className="text-[10px] uppercase font-bold text-neutral-400 mb-2 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> Meaning
                                    </h4>
                                    <p className="text-sm text-neutral-700 leading-relaxed">{c2.meaning}</p>
                                </div>
                                <ColorActions hex={c2.hex} rgb={c2.hex} />
                                <Link
                                    href={`/color/${c2.id}`}
                                    className="block text-center py-3 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition"
                                >
                                    Full {c2.name} Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verdict Section */}
                <div className="mt-16 bg-neutral-900 rounded-3xl p-10 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Design Verdict</h3>
                    <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
                        While **{c1.name}** brings a sense of {c1.meaning.split('.')[0].toLowerCase()}, **{c2.name}** offers a more {c2.meaning.split('.')[0].toLowerCase()} atmosphere. Pair them together for a balanced traditional aesthetic, or choose the one that aligns best with your project's emotional core.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: c1.hex }} />
                            <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: c2.hex }} />
                            <span className="text-sm font-bold">Perfect Duo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
