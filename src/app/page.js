'use client';

import { useState, useRef, useEffect } from 'react';
import ColorThief from 'colorthief';
import { Upload, Image as ImageIcon, ArrowRight, Palette, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { findClosestChineseColor } from '../utils/colorUtils';
import RecentPicks from '../components/RecentPicks';
import PinterestGallery from '../components/PinterestGallery';

export default function Home() {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [match, setMatch] = useState(null);
  const [copied, setCopied] = useState(false);
  const imgRef = useRef(null);

  // 1. Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedImage = localStorage.getItem('picker_image');
      const savedColors = localStorage.getItem('picker_colors');
      const savedSelected = localStorage.getItem('picker_selected');

      if (savedImage) setImage(savedImage);
      if (savedColors) setColors(JSON.parse(savedColors));
      if (savedSelected) {
        setSelectedColor(savedSelected);
        const result = findClosestChineseColor(savedSelected);
        setMatch(result);
      }
    }
  }, []);

  // 2. Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (image) localStorage.setItem('picker_image', image);
      if (colors.length > 0) localStorage.setItem('picker_colors', JSON.stringify(colors));
      if (selectedColor) localStorage.setItem('picker_selected', selectedColor);
    }
  }, [image, colors, selectedColor]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Use FileReader to get Base64 for persistence
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setImage(base64);
        setColors([]);
        setSelectedColor(null);
        setMatch(null);
        // Reset localStorage for new image
        if (typeof window !== 'undefined') {
          localStorage.removeItem('picker_selected');
          localStorage.removeItem('picker_colors');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = () => {
    console.log("Attempting to extract colors...");
    try {
      if (imgRef.current && imgRef.current.complete) {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(imgRef.current, 8);
        const hexPalette = palette.map(rgb =>
          "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
        );
        setColors(hexPalette);
      }
    } catch (err) {
      console.error("Color extraction failed:", err);
    }
  };

  const handleColorClick = (hex) => {
    setSelectedColor(hex);
    const result = findClosestChineseColor(hex);
    setMatch(result);
  };

  const clearTool = () => {
    setImage(null);
    setColors([]);
    setSelectedColor(null);
    setMatch(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('picker_image');
      localStorage.removeItem('picker_colors');
      localStorage.removeItem('picker_selected');
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-neutral-50 text-neutral-800 font-sans">

      {/* Main Tool Area */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100">

        {/* Upload Area */}
        <div className="relative w-full min-h-[300px] bg-neutral-100 flex items-center justify-center overflow-hidden group">
          {!image ? (
            <label className="flex flex-col items-center cursor-pointer p-8 transition hover:scale-105 active:scale-95">
              <Upload className="w-12 h-12 text-neutral-400 mb-4" />
              <span className="text-lg font-medium text-neutral-600">Upload an Image</span>
              <span className="text-sm text-neutral-400 mt-2">JPG, PNG supported</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          ) : (
            <>
              {typeof image === 'string' && image && (
                <img
                  ref={imgRef}
                  src={image}
                  alt="Uploaded"
                  className="w-full h-full object-contain max-h-[500px]"
                  onLoad={() => setTimeout(extractColors, 100)}
                />
              )}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={extractColors}
                  className="bg-neutral-900 text-white px-4 py-2 rounded-full shadow-sm text-sm font-medium hover:bg-neutral-800 transition backdrop-blur"
                >
                  Regenerate
                </button>
                <button
                  onClick={clearTool}
                  className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium text-red-500 hover:bg-neutral-50 transition"
                >
                  Clear
                </button>
                <label className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium cursor-pointer hover:bg-white transition">
                  New Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            </>
          )}
        </div>

        {/* Palette Area */}
        {colors.length > 0 && (
          <div className="p-6 bg-white">
            <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Extracted Palette</h2>
            <div className="flex flex-wrap gap-4 mb-8">
              {colors.map((hex, i) => (
                <button
                  key={i}
                  onClick={() => handleColorClick(hex)}
                  className={`w-12 h-12 rounded-full shadow-sm border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 ${selectedColor === hex ? 'border-neutral-800 scale-110 ring-2 ring-neutral-400' : 'border-transparent'}`}
                  style={{ backgroundColor: hex }}
                  aria-label={`Select color ${hex}`}
                />
              ))}
            </div>

            {/* Match Result Area */}
            {selectedColor && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-t pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Closest Match</span>
                      <button
                        onClick={() => handleCopy(selectedColor)}
                        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 transition"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {selectedColor}
                      </button>
                    </div>
                    {match ? (
                      <div>
                        <h3 className="text-3xl font-bold text-neutral-900 mt-1">{match.name}</h3>
                        <p className="text-lg text-neutral-500 font-serif italic mt-1">{match.chinese} ({match.pinyin})</p>
                        <p className="max-w-md text-sm text-neutral-600 mt-3 leading-relaxed">{match.meaning}</p>

                        <div className="flex gap-2 mt-4">
                          {match.tags && match.tags.map(tag => (
                            <Link key={tag} href={`/colors/${tag}`} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded hover:bg-neutral-200">
                              #{tag}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-neutral-500 mt-2">No direct Chinese color match found.</p>
                    )}
                  </div>

                  {match && (
                    <Link
                      href={`/color/${match.id}`}
                      className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl font-medium hover:bg-neutral-800 transition shadow-lg hover:shadow-xl translate-y-2 group"
                    >
                      <span>Full Details</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Section */}
      <RecentPicks lastPick={match} />

      {/* Social Gallery (Phase 16) */}
      <PinterestGallery />

      {/* Mood Clusters (SEO Hub Strategy) */}
      <section className="max-w-4xl w-full mt-24 mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Discover by Mood</h2>
            <p className="text-sm text-neutral-400 font-serif italic">Explore traditional collections curated by artistic intent.</p>
          </div>
          <Link href="/colors/nature" className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 uppercase tracking-widest transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'red', name: 'Imperial Red', style: 'bg-gradient-to-br from-red-600/90 to-amber-900/90' },
            { id: 'green', name: 'Jade Valley', style: 'bg-gradient-to-br from-emerald-700/90 to-teal-900/90' },
            { id: 'blue', name: 'Ocean Silk', style: 'bg-gradient-to-br from-indigo-600/90 to-blue-950/90' },
            { id: 'warm', name: 'Sunset Embers', style: 'bg-gradient-to-br from-orange-500/90 to-rose-900/90' },
          ].map((mood) => (
            <Link
              key={mood.id}
              href={`/colors/${mood.id}`}
              className={`relative h-44 rounded-[2rem] overflow-hidden group transition-all hover:scale-[1.03] active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-neutral-200 ${mood.style} border border-white/20`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] opacity-50" />
              <div className="absolute bottom-6 left-6">
                <span className="text-white font-bold text-lg tracking-tight block drop-shadow-md">
                  {mood.name}
                </span>
                <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-1 block group-hover:text-white transition-colors">
                  Archetype
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-2xl mt-16 text-neutral-600 space-y-6 pb-12">
        <h2 className="text-xl font-bold text-neutral-900">About Image Color Picker</h2>
        <p>
          This free tool allows you to extract precise hex codes from any image.
          Unlike generic pickers, we map your colors to traditional Chinese aesthetics, providing cultural context, poem meanings, and visual inspiration.
        </p>
        <p>
          Simply upload a file, click on any extracted color, and discover its name (e.g., Cinnabar, Tea White) and significance in art and history.
        </p>
      </section>
    </main>
  );
}
