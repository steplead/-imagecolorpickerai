import { getAllColors } from './colorData';

// 1. Define the Categories (The "Hubs")
export const IDEA_CATEGORIES = [
    {
        id: 'wedding',
        title: 'Wedding & Celebration',
        desc: 'Auspicious colors for invitations, decor, and traditional wear.',
        icon: 'Heart',
    },
    {
        id: 'branding',
        title: 'Logo & Branding',
        desc: 'Professional palettes that convey trust, energy, or luxury.',
        icon: 'Briefcase',
    },
    {
        id: 'interior',
        title: 'Interior Design',
        desc: 'Harmonious shades for living rooms, tea rooms, and feng shui.',
        icon: 'Home',
    },
    {
        id: 'fashion',
        title: 'Fashion & Silk',
        desc: 'Traditional textile colors for modern apparel and accessories.',
        icon: 'Shirt',
    },
    {
        id: 'art',
        title: 'Art & Illustration',
        desc: 'Pigments used in classic ink wash painting and calligraphy.',
        icon: 'Palette',
    }
];

// 2. The Logic Engine (Mapping "Intent" to "Data")
export function getColorsForCategory(categoryId) {
    const allColors = getAllColors();

    switch (categoryId) {
        case 'wedding':
            // Red (Joy/Luck), Gold (Wealth), Pink (Romance)
            return allColors.filter(c =>
                ['red', 'yellow', 'pink'].includes(c.tags?.[0]) ||
                c.meaning.toLowerCase().includes('love') ||
                c.meaning.toLowerCase().includes('festive') ||
                c.meaning.toLowerCase().includes('auspicious')
            ).sort(() => 0.5 - Math.random()).slice(0, 50);

        case 'branding':
            // Strong, distinct colors. 
            // Blue (Trust), Red (Energy), Black/White (Minimalism)
            return allColors.filter(c =>
                ['blue', 'red', 'black', 'white'].includes(c.tags?.[0]) ||
                c.meaning.toLowerCase().includes('power') ||
                c.meaning.toLowerCase().includes('royal')
            ).slice(0, 50);

        case 'interior':
            // Calming, Earthy, Neutral.
            // Tea White, Bamboo Green, Clay
            return allColors.filter(c =>
                ['green', 'white', 'brown', 'warm'].includes(c.tags?.[0]) ||
                c.meaning.toLowerCase().includes('peace') ||
                c.meaning.toLowerCase().includes('calm') ||
                c.meaning.toLowerCase().includes('nature')
            ).slice(0, 50);

        case 'fashion':
            // Vibrant, Seasonal.
            return allColors.filter(c =>
                ['purple', 'pink', 'blue', 'green'].includes(c.tags?.[0])
            ).slice(0, 50);

        case 'art':
            // Pigment names, Ink styles.
            return allColors.filter(c =>
                (c.nativeName || '').includes('墨') || // Ink
                (c.meaning || '').toLowerCase().includes('paint') ||
                (c.meaning || '').toLowerCase().includes('pigment')
            ).slice(0, 50);

        default:
            return allColors.slice(0, 20);
    }
}
