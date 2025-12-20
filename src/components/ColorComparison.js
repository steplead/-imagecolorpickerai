'use client';

import Link from 'next/link';
import { ArrowRightLeft, Palette } from 'lucide-react';

export default function ColorComparison({ currentColor, relatedColors }) {
    if (!relatedColors || relatedColors.length === 0) return null;

    return (
        <div className="mt-12 border-t pt-12">
            <h3 className="text-sm font-bold uppercase text-neutral-400 tracking-wider mb-6 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" />
                Color Comparisons
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedColors.slice(0, 4).map((related) => (
                    <Link
                        key={related.id}
                        href={`/compare/${currentColor.id}-vs-${related.id}`} // Programmatic comparison slug
                        className="group p-4 bg-white border border-neutral-100 rounded-xl hover:border-neutral-300 transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <div
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm z-10"
                                    style={{ backgroundColor: currentColor.hex }}
                                />
                                <div
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                    style={{ backgroundColor: related.hex }}
                                />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-neutral-900 leading-tight">
                                    {currentColor.name} <span className="text-neutral-300 font-normal mx-1">vs</span> {related.name}
                                </div>
                                <div className="text-[10px] text-neutral-400 uppercase tracking-tighter">Compare Aesthetics</div>
                            </div>
                        </div>
                        <Palette className="w-4 h-4 text-neutral-200 group-hover:text-neutral-900 transition-colors" />
                    </Link>
                ))}
            </div>

            <p className="mt-4 text-[11px] text-neutral-400 text-center italic">
                Compare these shades to choose the perfect balance for your next project.
            </p>
        </div>
    );
}
