import chineseColors from '../data/chineseColors.json';
import japaneseColors from '../data/japaneseColors.json';
import pantone2025 from '../data/pantone2025.json';
import natureColors from '../data/natureColors.json';

// Normalize data structure for UI consistency
const normalizeColor = (color, collectionId) => ({
    ...color,
    collectionId, // 'chinese' | 'japanese' | 'pantone' | 'nature'
    nativeName: color.chinese || color.kanji || color.nativeName,
    phoneticName: color.pinyin || color.romaji || color.phoneticName || '',
    // Ensure tags exists
    tags: color.tags || []
});

// 2. Global Aggregation
const ALL_COLORS = [
    ...chineseColors.map(c => normalizeColor(c, 'chinese')),
    ...japaneseColors.map(c => normalizeColor(c, 'japanese')),
    ...pantone2025.map(c => normalizeColor(c, 'pantone')),
    ...natureColors.map(c => normalizeColor(c, 'nature'))
];

// 2. Data Access Methods
export function getAllColors() {
    return ALL_COLORS;
}

export function getColorById(id) {
    return ALL_COLORS.find(c => c.id === id);
}

export function getCollection(collectionId) {
    const dataMap = {
        chinese: chineseColors,
        japanese: japaneseColors,
        pantone: pantone2025,
        nature: natureColors
    };
    const data = dataMap[collectionId] || chineseColors;
    return data.map(c => normalizeColor(c, collectionId || 'chinese'));
}

export function getRelatedColors(color, limit = 4) {
    if (!color) return [];
    // Prioritize same collection, then same tags
    return ALL_COLORS
        .filter(c => c.id !== color.id)
        .sort((a, b) => {
            // Same collection boost
            const aSame = a.collectionId === color.collectionId ? 1 : 0;
            const bSame = b.collectionId === color.collectionId ? 1 : 0;
            if (aSame !== bSame) return bSame - aSame;

            // Tag overlap score
            const aTags = a.tags.filter(t => color.tags.includes(t)).length;
            const bTags = b.tags.filter(t => color.tags.includes(t)).length;
            return bTags - aTags;
        })
        .slice(0, limit);
}

// 3. Metadata Helper
export function getCollectionMetadata(collectionId) {
    const meta = {
        chinese: {
            name: 'Traditional Chinese Colors',
            nativeName: '中国传统色',
            description: 'Colors from the dynasties, poetry, and nature of ancient China.'
        },
        japanese: {
            name: 'Traditional Japanese Colors',
            nativeName: '日本の伝統色 (Nippon no Iro)',
            description: 'Established over 1,000 years ago, representing the changing seasons of Japan.'
        },
        pantone: {
            name: 'Pantone Trends 2025',
            nativeName: 'Future Aesthetics',
            description: 'Forecasted color winners and global design trends for the year 2025.'
        },
        nature: {
            name: 'Nature & Earth Palettes',
            nativeName: 'Organic Origins',
            description: 'Organic pigments and earth tones derived from the mountains, forests, and oceans.'
        }
    };
    return meta[collectionId] || meta.chinese;
}
