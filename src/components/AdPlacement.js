'use client';

import { useState, useEffect } from 'react';

export default function AdPlacement({ slot, format = 'auto', responsive = 'true', className = '' }) {
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                if (typeof window !== 'undefined' && window.adsbygoogle) {
                    const ins = document.getElementById(`ad-slot-${slot}`);
                    // Only push if the element exists and hasn't been initialized yet
                    if (ins && ins.offsetParent !== null && ins.offsetWidth > 0) {
                        if (!ins.getAttribute('data-adsbygoogle-status')) {
                            (window.adsbygoogle = window.adsbygoogle || []).push({});
                        }
                    } else if (ins) {
                        // If it has no width yet, retry once after a short delay
                        setTimeout(() => {
                            if (ins.offsetWidth > 0 && !ins.getAttribute('data-adsbygoogle-status')) {
                                (window.adsbygoogle = window.adsbygoogle || []).push({});
                            }
                        }, 500);
                    }
                }
            } catch (e) {
                console.error('AdSense error:', e);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [slot]);

    return (
        <div className={`w-full overflow-hidden my-8 ${className}`}>
            <span className="block text-[10px] text-neutral-300 uppercase tracking-widest mb-2 text-center">Advertisement</span>

            {/* Ad Container with Skeleton */}
            <div className={`relative min-h-[100px] w-full bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-center transition-opacity duration-500 ${adLoaded ? 'opacity-100' : 'opacity-80'}`}>
                {!adLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-400 rounded-full animate-spin opacity-20"></div>
                    </div>
                )}

                {/* 
                    Replace with your real AdSense ca-pub! 
                    Using a generic placeholder for now as per Protocol 3.3 
                */}
                <ins
                    id={`ad-slot-${slot}`}
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-0000000000000000" // Placeholder
                    data-ad-slot={slot}
                    data-ad-format={format}
                    data-full-width-responsive={responsive}
                    onLoad={() => setAdLoaded(true)}
                />
            </div>
        </div>
    );
}
