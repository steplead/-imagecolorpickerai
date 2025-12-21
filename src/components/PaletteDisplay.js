'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { generatePalettes } from '../utils/colorMetrics';

export default function PaletteDisplay({ baseColor }) {
    const [palettes, setPalettes] = useState(null);
    const [copiedHex, setCopiedHex] = useState(null);

    useEffect(() => {
        if (baseColor) {
            setPalettes(generatePalettes(baseColor));
        }
    }, [baseColor]);

    const handleCopy = (hex) => {
        navigator.clipboard.writeText(hex);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 2000);
    };

    if (!palettes) return null;

    return (
        <div className="mt-8 pt-8 border-t border-slate-100">
            <h3 className="text-lg font-serif font-bold text-slate-800 mb-6">Designed Palettes</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Analogous */}
                <PaletteGroup
                    title="Analogous"
                    desc="Harmonious and serene."
                    colors={palettes.analogous}
                    copiedHex={copiedHex}
                    onCopy={handleCopy}
                />

                {/* 2. Complementary */}
                <PaletteGroup
                    title="Complementary"
                    desc="High contrast and vibrant."
                    colors={palettes.complementary}
                    copiedHex={copiedHex}
                    onCopy={handleCopy}
                />

                {/* 3. Monochromatic */}
                <PaletteGroup
                    title="Monochromatic"
                    desc="Clean and elegant."
                    colors={palettes.monochromatic}
                    copiedHex={copiedHex}
                    onCopy={handleCopy}
                />

                {/* 4. Triadic */}
                <PaletteGroup
                    title="Triadic"
                    desc="Bold and balanced."
                    colors={palettes.triadic}
                    copiedHex={copiedHex}
                    onCopy={handleCopy}
                />
            </div>
        </div>
    );
}

function PaletteGroup({ title, desc, colors, copiedHex, onCopy }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-baseline">
                <h4 className="font-medium text-slate-700">{title}</h4>
                <span className="text-xs text-slate-400 italic">{desc}</span>
            </div>
            <div className="flex h-16 rounded-xl overflow-hidden shadow-sm ring-1 ring-slate-100">
                {colors.map((hex, i) => (
                    <button
                        key={i}
                        onClick={() => onCopy(hex)}
                        className="flex-1 h-full group relative flex items-center justify-center transition-all hover:flex-[1.5]"
                        style={{ backgroundColor: hex }}
                        title={`Copy ${hex}`}
                    >
                        <span className="sr-only">Copy {hex}</span>
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity`}>
                            {copiedHex === hex ? (
                                <Check className="w-4 h-4 text-white" />
                            ) : (
                                <Copy className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <span className="absolute bottom-1 right-1 text-[9px] text-white/80 font-mono opacity-0 group-hover:opacity-100 uppercase">
                            {hex}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
