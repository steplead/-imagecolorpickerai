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

      {/* SEO Headline (H1 Strategy) */}
      <div className="text-center mb-10 max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight mb-4">
          Image Color Picker <span className="text-red-600">AI</span> & Traditional Encyclopedia
        </h1>
        <p className="text-lg text-neutral-500 font-serif italic">
          Extract precise Hex codes from any image and discover the cultural significance of Traditional Chinese and Japanese colors.
        </p>
      </div>

      {/* Main Tool Area */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100">
        {/* Upload Area */}
        <div className="relative w-full min-h-[300px] bg-neutral-100 flex items-center justify-center overflow-hidden group">
          {!image ? (
            <label className="flex flex-col items-center cursor-pointer p-8 transition hover:scale-105 active:scale-95">
              <Upload className="w-12 h-12 text-neutral-400 mb-4" />
              <span className="text-lg font-medium text-neutral-600">Upload an Image to Pick Colors</span>
              <span className="text-sm text-neutral-400 mt-2">Pick Hex, RGB, and CMYK from pixels</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          ) : (
            <>
              {typeof image === 'string' && image && (
                <figure className="w-full h-full flex items-center justify-center p-4">
                  <img
                    ref={imgRef}
                    src={image}
                    alt="Image Color Picker AI - Pick Colors from Images"
                    title="Pick Colors from this Image"
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
                  Pick Again
                </button>
                <button
                  onClick={clearTool}
                  className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium text-red-500 hover:bg-neutral-50 transition"
                >
                  Clear
                </button>
                <label className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium cursor-pointer hover:bg-white transition">
                  Change Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            </>
          )}
        </div>

        {/* Palette Area */}
        {colors.length > 0 && (
          <div className="p-6 bg-white">
            <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Pick a Color from the Palette</h2>
            <div className="flex flex-wrap gap-4 mb-8">
              {colors.map((hex, i) => (
                <button
                  key={i}
                  onClick={() => handleColorClick(hex)}
                  className={`w-12 h-12 rounded-full shadow-sm border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 ${selectedColor === hex ? 'border-neutral-800 scale-110 ring-2 ring-neutral-400' : 'border-transparent'}`}
                  style={{ backgroundColor: hex }}
                  aria-label={`Pick color ${hex}`}
                />
              ))}
            </div>

            {/* Match Result Area */}
            {selectedColor && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-t pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Historical Match</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedColor);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
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
                            <Link key={tag} href={`/colors/${tag}`} title={`View all ${tag} colors`} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded hover:bg-neutral-200">
                              #{tag}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-neutral-500 mt-2">No direct culture match found.</p>
                    )}
                  </div>

                  {match && (
                    <Link
                      href={`/color/${match.id}`}
                      title={`Full Details for ${match.name}`}
                      className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl font-medium hover:bg-neutral-800 transition shadow-lg hover:shadow-xl translate-y-2 group"
                    >
                      <span>Pick Palette</span>
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
          title="Predict Your Color DNA with AI"
          className="relative block w-full bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-3xl overflow-hidden shadow-2xl group border border-neutral-700"
        >
          <div className="absolute inset-0 opacity-30 bg-repeat"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-500/20 to-transparent"></div>

          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-amber-400 text-amber-950 text-xs font-bold tracking-widest uppercase mb-3 animate-pulse">
                AI Powered
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Predict Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">Color DNA</span>
              </h2>
              <p className="text-neutral-300 font-serif italic max-w-sm">
                Unlock the personal palette that matches your facial features and traditional skin tone theory.
              </p>
            </div>

            <div className="flex-shrink-0">
              <span className="flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Start AI Scan
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Collections & Moods (Global Encyclopedia Strategy) */}
      <section className="max-w-6xl w-full mt-24 mb-16 px-4">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Traditional Color Collections</h2>
          <p className="text-sm text-neutral-400 font-serif italic mt-1">Pick colors from five thousand years of distilled aesthetic history.</p>
        </div>

        {/* Primary Collections (Phase 20) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link
            href="/colors/chinese"
            title="Explore Traditional Chinese Colors"
            className="relative h-64 rounded-3xl overflow-hidden group shadow-2xl transition-all hover:scale-[1.01]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-amber-900" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Traditional Chinese Colors</h3>
              <p className="text-red-100 font-serif italic max-w-sm">Pick hex codes from the dynasty galleries of Peking and Suzhou.</p>
            </div>
          </Link>

          <Link
            href="/colors/japanese"
            title="Explore Japanese Harmony Palette"
            className="relative h-64 rounded-3xl overflow-hidden group shadow-2xl transition-all hover:scale-[1.01]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-300" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Japanese Harmony Palette</h3>
              <p className="text-rose-100 font-serif italic max-w-sm">Extract the subtle shades of the Heian period and seasonal kimonos.</p>
            </div>
          </Link>
        </div>

        {/* Mood Tags */}
        <div className="flex flex-wrap gap-4 justify-center">
          {['Red', 'Green', 'Blue', 'Nature', 'Warm', 'Cool'].map(tag => (
            <Link
              key={tag}
              href={`/colors/${tag.toLowerCase()}`}
              title={`View ${tag} color group`}
              className="px-6 py-3 bg-white border border-neutral-100 rounded-xl text-neutral-600 font-medium hover:bg-neutral-50 hover:border-neutral-200 transition shadow-sm"
            >
              Pick {tag} Colors
            </Link>
          ))}
        </div>
      </section>

      {/* Deep SEO Content (The Polished Gem Phase) */}
      <article className="max-w-4xl w-full mt-24 px-4 prose prose-neutral">
        <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">The Ultimate Image Color Picker & Cultural Encyclopedia</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-neutral-600 leading-relaxed">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-neutral-800">Why Use an AI Image Color Picker?</h3>
            <p>
              An <strong>Image Color Picker</strong> is more than just a technical tool for designers; it is a bridge between digital photography and physical aesthetics. Our tool uses <strong>AI-powered color extraction</strong> to identify not just the dominant pixels, but the most visually significant shades in your photos. Whether you are building a website, designing a brand identity, or simply curious about a sunset photograph, picking the right <strong>hex codes</strong> is the first step toward visual harmony.
            </p>
            <p>
              Unlike standard browser pickers, our <strong>online image color picker</strong> allows you to upload high-resolution images and instantly generate a <strong>CSS-ready palette</strong>. We provide values in <strong>Hex, RGB, and CMYK</strong> formats, ensuring your colors transition perfectly from screen to print.
            </p>
            <h3 className="text-lg font-bold text-neutral-800">Mastering Traditional Chinese Colors</h3>
            <p>
              Traditional Chinese colors, known as <em>Zhongguo Se</em> (中国色), are deeply rooted in the Five Elements (Wu Xing) and ancient poetry. Colors like <strong>Cinnabar Red</strong> (辰砂) or <strong>Celadon Green</strong> (青) are not just hex codes; they represent luck, balance, and nature. By using our <strong>color match detector</strong>, you can find which historical shade closest matches your image, unlocking a library of cultural meaning and artistic inspiration.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-neutral-800">Japanese Aesthetics: Picking Nippon Shades</h3>
            <p>
              Japanese colors (<em>Dento-iro</em>) focus on the transience of nature and the changing seasons. From the delicate pink of <strong>Sakura-iro</strong> to the deep blue of <strong>Aizome</strong> indigo, these colors are pillars of Wabi-Sabi design. Our tool simplifies the process of <strong>extracting Japanese palettes</strong> from your vacation photos or landscape art, providing a sophisticated alternative to modern neon color schemes.
            </p>
            <h3 className="text-lg font-bold text-neutral-800">Design Tips for High Keyword Density</h3>
            <p>
              When you <strong>pick colors from images</strong>, always look for the relationship between the base color and its complements. A great design uses the 60-30-10 rule: 60% dominant color, 30% secondary, and 10% accent. Our <strong>AI Color Analyst</strong> helps you achieve this balance automatically by suggesting harmonies based on your primary pick.
            </p>
            <p>
              In the world of <strong>digital marketing and SEO</strong>, colors evoke specific emotions. Red drives action and excitement, while blue builds trust and stability. Use our <strong>color meaning library</strong> to choose shades that align with your business goals, ensuring every pixel on your landing page is optimized for conversions.
            </p>
          </div>
        </div>

        <div className="mt-16 p-8 bg-neutral-900 text-white rounded-3xl shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Start Picking Colors Today</h3>
          <p className="text-neutral-400 mb-6">
            Join thousands of professional designers and digital artists using ImageColorPickerAI to craft stunning visual experiences with 100% accuracy.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition"
          >
            Upload Your Image
          </button>
        </div>
      </article>

      {/* Structured FAQ for SSR Audit */}
      <section className="max-w-xl mt-24 mb-24 pb-12 w-full px-4">
        <h2 className="text-xl font-bold text-neutral-900 mb-8 border-b pb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-neutral-800 mb-2">How do I pick a color from an image?</h4>
            <p className="text-sm text-neutral-500">Simply upload your JPG or PNG image to our tool. Use your mouse to hover over any area of the image, and the hex code will be displayed instantly.</p>
          </div>
          <div>
            <h4 className="font-bold text-neutral-800 mb-2">Is this color picker free?</h4>
            <p className="text-sm text-neutral-500">Yes, ImageColorPickerAI is a 100% free online tool with unlimited uploads and palette generations.</p>
          </div>
          <div>
            <h4 className="font-bold text-neutral-800 mb-2">Can I extract colors for Japanese and Chinese art?</h4>
            <p className="text-sm text-neutral-500">Absolutely. We specialize in mapping digital colors to traditional palettes, including Heian-era Japanese and Ming-era Chinese color systems.</p>
          </div>
        </div>
      </section>

    </main >
  );
}
