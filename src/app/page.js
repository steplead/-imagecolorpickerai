'use client';

import { useState, useRef, useEffect } from 'react';
import ColorThief from 'colorthief';
import { Upload, Image as ImageIcon, ArrowRight, Palette, Copy, Check, Sparkles } from 'lucide-react';
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
                <figure className="w-full h-full flex items-center justify-center p-4">
                  <img
                    ref={imgRef}
                    src={image}
                    alt="User uploaded image for color analysis - ImageColorPickerAI Tool Preview"
                    title="Your uploaded image"
                    className="w-full h-full object-contain max-h-[500px] shadow-sm rounded-lg"
                    onLoad={() => setTimeout(extractColors, 100)}
                  />
                </figure>
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

      {/* Phase 24: Viral Discovery Banner */}
      <section className="max-w-4xl mx-auto mt-16 px-4">
        <Link
          href="/scan"
          className="relative block w-full bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-3xl overflow-hidden shadow-2xl group border border-neutral-700"
        >
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-500/20 to-transparent"></div>

          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-amber-400 text-amber-950 text-xs font-bold tracking-widest uppercase mb-3 animate-pulse">
                New Feature
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                What's Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">Color Aura</span>?
              </h2>
              <p className="text-neutral-300 font-serif italic max-w-sm">
                Let our AI analyze your features to find your perfect Traditional Chinese color match.
              </p>
            </div>

            <div className="flex-shrink-0">
              <span className="flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Scan My Aura
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Collections & Moods (Global Encyclopedia Strategy) */}
      <section className="max-w-6xl w-full mt-24 mb-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Explore Collections</h2>
            <p className="text-sm text-neutral-400 font-serif italic mt-1">Journey through the colors of history and culture.</p>
          </div>
        </div>

        {/* Primary Collections (Phase 20) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link
            href="/colors/chinese"
            className="relative h-64 rounded-3xl overflow-hidden group shadow-2xl transition-all hover:scale-[1.01]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-amber-900" />
            <div className="absolute inset-0 bg-[url('/images/texture-noise.png')] opacity-20" />
            <div className="absolute top-8 left-8">
              <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">500+ Colors</span>
            </div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Traditional Chinese</h3>
              <p className="text-red-100 font-serif italic max-w-sm">Colors from the Forbidden City, poetry, and ancient dynasties.</p>
            </div>
            <ArrowRight className="absolute bottom-8 right-8 w-6 h-6 text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
          </Link>

          <Link
            href="/colors/japanese"
            className="relative h-64 rounded-3xl overflow-hidden group shadow-2xl transition-all hover:scale-[1.01]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-300" />
            <div className="absolute inset-0 bg-[url('/images/texture-noise.png')] opacity-20" />
            <div className="absolute top-8 left-8">
              <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">New Collection</span>
            </div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Nippon Colors</h3>
              <p className="text-rose-100 font-serif italic max-w-sm">The harmony of Japan's changing seasons and floral beauty.</p>
            </div>
            <ArrowRight className="absolute bottom-8 right-8 w-6 h-6 text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
        </div>

        {/* Mood Tags */}
        <div className="flex flex-wrap gap-4 justify-center">
          {['Red', 'Green', 'Blue', 'Nature', 'Warm', 'Cool'].map(tag => (
            <Link
              key={tag}
              href={`/colors/${tag.toLowerCase()}`}
              className="px-6 py-3 bg-white border border-neutral-100 rounded-xl text-neutral-600 font-medium hover:bg-neutral-50 hover:border-neutral-200 transition shadow-sm"
            >
              {tag}
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
    </main >
  );
}
