'use client';

import { useState } from 'react';
import { Image as ImageIcon, Loader2, Sparkles, Share2 } from 'lucide-react';

export default function WallpaperGenerator({ colorName, hex, chinese }) {
    const [style, setStyle] = useState('ink');
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(null);
    const [pinning, setPinning] = useState(false);
    const [pinned, setPinned] = useState(false);

    const STYLES = {
        ink: {
            name: 'Ink Painting',
            promptAlt: 'traditional chinese ink painting style, fluid brushwork, zen atmosphere',
            desc: 'Classic brush & ink aesthetics'
        },
        silk: {
            name: 'Silk Luxury',
            promptAlt: 'premium silk fabric texture, intricate weaving patterns, soft sheen',
            desc: 'Tactile high-end textures'
        },
        watercolor: {
            name: 'Watercolor',
            promptAlt: 'ethereal watercolor mist, bleeding colors, dreamy atmospheric perspective',
            desc: 'Soft and dreamy gradients'
        },
        minimal: {
            name: 'Minimalist',
            promptAlt: 'ultra-minimalist architectural geometry, clean lines, flat color fields',
            desc: 'Modern and clean design'
        }
    };

    const generateWallpaper = async () => {
        setLoading(true);
        setError(null);
        try {
            const stylePrompt = STYLES[style].promptAlt;
            const prompt = `Full page minimalist aesthetic wallpaper, featuring the color ${colorName} (${hex}), ${stylePrompt}, balanced composition, high quality, 8k, editorial photography style`;

            const res = await fetch('/api/generate-wallpaper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            const data = await res.json();
            console.log('Wallpaper API Response:', data);

            if (data.error) throw new Error(data.error);

            // Robust URL extraction
            let finalUrl = null;
            if (data.images && data.images[0]) {
                const img = data.images[0];
                finalUrl = typeof img === 'string' ? img : img.url;
            } else if (data.url) {
                finalUrl = data.url;
            } else if (typeof data === 'string' && data.startsWith('http')) {
                finalUrl = data;
            }

            if (typeof finalUrl === 'string' && finalUrl.startsWith('http')) {
                setImageUrl(finalUrl);
            } else {
                console.error('Invalid image data:', data);
                throw new Error("Could not extract a valid image URL. Please try again.");
            }
        } catch (err) {
            setError(err.message || 'Failed to generate');
        } finally {
            setLoading(false);
        }
    };

    const shareToPinterest = async () => {
        setPinning(true);
        setError(null);
        try {
            const pageUrl = window.location.href;
            const res = await fetch('/api/pinterest/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageUrl,
                    title: `${chinese} (${colorName}) - Traditional Chinese Color Art`,
                    description: `An aesthetic ${STYLES[style].name} wallpaper inspired by the traditional Chinese color ${chinese} (${colorName}). Generated with AI on ImageColorPickerAI.com`,
                    link: pageUrl
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setPinned(true);
        } catch (err) {
            setError(err.message || 'Failed to pin');
        } finally {
            setPinning(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-neutral-100 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Wallpaper Generator
                </h3>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Pro Feature</span>
            </div>

            <p className="text-sm text-neutral-500 mb-6 font-serif italic">
                Create a unique masterpiece inspired by the soul of {chinese} ({colorName}).
            </p>

            {/* Style Selector */}
            <div className="mb-6">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Select Artistic Style</label>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STYLES).map(([id, info]) => (
                        <button
                            key={id}
                            onClick={() => {
                                setStyle(id);
                                setPinned(false); // Reset pinned status if style changes
                            }}
                            className={`p-3 text-left rounded-lg border transition-all ${style === id
                                ? 'bg-white border-neutral-900 shadow-sm'
                                : 'bg-white/50 border-neutral-200 hover:border-neutral-400 text-neutral-500'}`}
                        >
                            <div className={`text-xs font-bold mb-0.5 ${style === id ? 'text-neutral-900' : 'text-neutral-600'}`}>
                                {info.name}
                            </div>
                            <div className="text-[10px] opacity-70 leading-tight">{info.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="text-red-500 text-xs mb-4 bg-red-50 p-2 rounded border border-red-100">{error}</div>}

            {!imageUrl ? (
                <button
                    onClick={generateWallpaper}
                    disabled={loading}
                    className="w-full py-4 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-neutral-200 transition-all active:scale-[0.98]"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {loading ? 'Generating Art...' : 'Generate 8K Wallpaper'}
                </button>
            ) : (
                <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                    {typeof imageUrl === 'string' && imageUrl && (
                        <>
                            <div className="relative group">
                                <img
                                    src={imageUrl}
                                    alt={`Wallpaper for ${colorName}`}
                                    className="w-full rounded-xl shadow-2xl border-4 border-white"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur text-[10px] text-white rounded-md uppercase tracking-tighter font-bold">
                                    {STYLES[style].name}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <a
                                    href={imageUrl}
                                    download={`wallpaper-${colorName}.jpg`}
                                    className="text-center py-3 bg-white border border-neutral-200 rounded-xl text-xs font-bold hover:bg-neutral-50 transition-colors shadow-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download
                                </a>
                                <button
                                    onClick={shareToPinterest}
                                    disabled={pinning || pinned}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${pinned
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'}`}
                                >
                                    {pinning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                                    {pinned ? 'Shared!' : pinning ? 'Pinning...' : 'to Pinterest'}
                                </button>
                            </div>
                        </>
                    )}
                    <button
                        onClick={() => {
                            setImageUrl(null);
                            setPinned(false);
                        }}
                        className="block w-full text-center text-xs text-neutral-400 hover:text-neutral-900 font-medium transition-colors"
                    >
                        Reset & Try Another Style
                    </button>
                </div>
            )}
        </div>
    );
}
