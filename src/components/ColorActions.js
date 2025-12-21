'use client';

import React, { useState } from 'react';
import { Copy, Check, FileJson, Download } from 'lucide-react';
import { generateFigmaCopy, downloadASE } from '../utils/exportUtils';

const ColorActions = ({ hex, rgb, colorName = "Color" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFigmaCopy = () => {
        const text = generateFigmaCopy(colorName, hex);
        handleCopy(text, 'figma');
    };

    return (
        <div className="flex flex-wrap gap-3 mt-4">
            <button
                onClick={() => handleCopy(hex, 'hex')}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition shadow-sm"
            >
                {copied === 'hex' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy HEX
            </button>
            <button
                onClick={() => handleCopy(rgb, 'rgb')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition shadow-sm"
            >
                {copied === 'rgb' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy RGB
            </button>

            {/* Phase 18: Pro Exports */}
            <div className="w-px h-8 bg-neutral-200 mx-1 hidden sm:block"></div>

            <button
                onClick={handleFigmaCopy}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-sm font-medium hover:bg-purple-100 transition shadow-sm"
                title="Copy as CSS/Figma JSON"
            >
                {copied === 'figma' ? <Check className="w-4 h-4" /> : <FileJson className="w-4 h-4" />}
                Figma
            </button>

            <button
                onClick={() => downloadASE(colorName, hex)}
                className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 border border-sky-100 rounded-lg text-sm font-medium hover:bg-sky-100 transition shadow-sm"
                title="Download Adobe Swatch Exchange file"
            >
                <Download className="w-4 h-4" />
                .ASE
            </button>
        </div>
    );
};

export default ColorActions;
