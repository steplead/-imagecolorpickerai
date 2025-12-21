/**
 * Simple color theory utility to generate palettes from a base hex.
 * No external dependencies needed for basic HSL manipulation.
 */

// Convert Hex to HSL
function hexToHsl(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];
    } else if (hex.length === 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
}

// Convert HSL to Hex
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    if (r.length === 1) r = "0" + r;
    if (g.length === 1) g = "0" + g;
    if (b.length === 1) b = "0" + b;

    return "#" + r + g + b;
}

export function generatePalettes(baseHex) {
    const { h, s, l } = hexToHsl(baseHex);

    // 1. Complementary (Opposite)
    const complementary = hslToHex((h + 180) % 360, s, l);

    // 2. Analogous (Neighbors)
    const analogous1 = hslToHex((h + 30) % 360, s, l);
    const analogous2 = hslToHex((h - 30 + 360) % 360, s, l);

    // 3. Triadic (Triangle)
    const triadic1 = hslToHex((h + 120) % 360, s, l);
    const triadic2 = hslToHex((h + 240) % 360, s, l);

    // 4. Monochrome (Lighter/Darker)
    const lighter = hslToHex(h, s, Math.min(l + 20, 95));
    const darker = hslToHex(h, s, Math.max(l - 20, 5));

    return {
        complementary: [baseHex, complementary],
        analogous: [analogous2, baseHex, analogous1],
        triadic: [baseHex, triadic1, triadic2],
        monochromatic: [lighter, baseHex, darker]
    };
}
