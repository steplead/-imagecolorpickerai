'use client';

import React, { useState } from 'react';

export default function ColorTexture({ src, alt, color }) {
    const [error, setError] = useState(false);

    if (error) return null;

    return (
        <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover relative z-10 transition-opacity duration-500 hover:opacity-90"
            loading="eager"
            onError={() => setError(true)}
        />
    );
}
