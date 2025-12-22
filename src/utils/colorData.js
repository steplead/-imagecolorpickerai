import chineseColors from '../data/chineseColors.json';
import japaneseColors from '../data/japaneseColors.json';

// Normalize data structure for UI consistency
const normalizeColor = (color, collectionId) => ({
    ...color,
    collectionId, // 'chinese' | 'japanese'
    nativeName: color.chinese || color.kanji,
    phoneticName: color.pinyin || color.romaji,
    // Ensure tags exists
    tags: color.tags || []
});

// 1. Unified Dataset
const ALL_COLORS = [
    ...chineseColors.map(c => normalizeColor(c, 'chinese')),
    ...japaneseColors.map(c => normalizeColor(c, 'japanese'))
];

// 2. Data Access Methods
export function getAllColors() {
    return ALL_COLORS;
}

export function getColorById(id) {
    return ALL_COLORS.find(c => c.id === id);
}

export function getCollection(collectionId) {
    if (collectionId === 'japanese') {
        return japaneseColors.map(c => normalizeColor(c, 'japanese'));
    }
    // Default to Chinese for legacy reasons or explicit request
    return chineseColors.map(c => normalizeColor(c, 'chinese'));
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
        }
    };
    return meta[collectionId] || meta.chinese;
}
