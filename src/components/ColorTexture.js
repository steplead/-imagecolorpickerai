'use client';

import React, { useState } from 'react';

export default function ColorTexture({ src, alt, color }) {
    const [error, setError] = useState(false);

    if (error) return null;

    return (
        <figure className="w-full h-full relative z-10" itemScope itemType="https://schema.org/ImageObject">
            <img
                src={src}
                alt={alt || `Traditional Chinese Color Texture - ${color?.name || 'High Quality Pattern'}`}
                title={`Authentic Texture for ${color?.name || 'Chinese Color'}`}
                className="w-full h-full object-cover transition-opacity duration-500 hover:opacity-90"
                width="800"
                height="800"
                loading="eager"
                onError={() => setError(true)}
                itemProp="contentUrl"
            />
        </figure>
    );
}
