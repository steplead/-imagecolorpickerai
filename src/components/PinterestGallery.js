'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Pin, Loader2 } from 'lucide-react';

export default function PinterestGallery() {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPins() {
            try {
                const res = await fetch('/api/pinterest/feed');
                if (!res.ok) throw new Error('Failed to load gallery');
                const data = await res.json();
                setPins(data.pins || []);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchPins();
    }, []);

    if (error || (pins.length === 0 && !loading)) {
        return null; // Gracefully fail if no pins or error
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-slate-800 mb-2">Social Gallery</h2>
                    <p className="text-slate-600">Discover trending palettes and wallpapers from our community.</p>
                </div>
                <a
                    href="https://www.pinterest.com/johnlauvip/traditional-chinese-art-wallpapers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm font-medium"
                >
                    <Pin className="w-4 h-4" />
                    <span>Follow Board</span>
                </a>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
                    {pins.map((pin) => (
                        <div key={pin.id} className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                            {/* Image */}
                            <img
                                src={pin.imageUrl}
                                alt={pin.title}
                                className="w-full h-auto object-cover"
                                loading="lazy"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <h3 className="text-white font-medium text-sm line-clamp-2 mb-2">{pin.title}</h3>
                                <a
                                    href={pin.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white font-medium backdrop-blur-md bg-white/20 px-3 py-1.5 rounded-full w-fit"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    View on Pinterest
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
