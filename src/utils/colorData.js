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

// 2. Data Access
// Protocol 5: "Frying Beans" - Random Sampling for Internal Link Circulation
export function getRandomColors(count = 10) {
    const shuffled = [...ALL_COLORS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Protocol 5: Combination Engine - Finding color pairs
// This is used for generating pages like /combine/imperial-red-and-deep-blue
export function getColorBySlug(slug) {
    // Basic lookup. Improve with exact match if needed.
    // Assuming slug is lowercase english name parameterized
    return ALL_COLORS.find(c =>
        c.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
}

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
export function getCollectionMetadata(collectionId, locale = 'en') {
    const metaMap = {
        en: {
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
        },
        es: {
            chinese: {
                name: 'Colores Tradicionales Chinos',
                nativeName: '中国传统色',
                description: 'Colores de las dinastías, la poesía y la naturaleza de la antigua China.'
            },
            japanese: {
                name: 'Colores Tradicionales Japoneses',
                nativeName: '日本の伝統色',
                description: 'Establecido hace más de 1.000 años, representando las estaciones cambiantes de Japón.'
            },
            pantone: {
                name: 'Tendencias Pantone 2025',
                nativeName: 'Estética Futura',
                description: 'Ganadores de color previstos y tendencias de diseño global para el año 2025.'
            },
            nature: {
                name: 'Paletas de Naturaleza y Tierra',
                nativeName: 'Orígenes Orgánicos',
                description: 'Pigmentos orgánicos y tonos tierra derivados de las montañas, bosques y océanos.'
            }
        },
        fr: {
            chinese: {
                name: 'Couleurs Traditionnelles Chinoises',
                nativeName: '中国传统色',
                description: 'Couleurs des dynasties, de la poésie et de la nature de la Chine ancienne.'
            },
            japanese: {
                name: 'Couleurs Traditionnelles Japonaises',
                nativeName: '日本の伝統色',
                description: 'Établi il y a plus de 1 000 ans, représentant les saisons changeantes du Japon.'
            },
            pantone: {
                name: 'Tendances Pantone 2025',
                nativeName: 'Esthétique Future',
                description: 'Couleurs prévues et tendances mondiales du design pour l\'année 2025.'
            },
            nature: {
                name: 'Palettes Nature et Terre',
                nativeName: 'Origines Organiques',
                description: 'Pigments organiques et tons terre issus des montagnes, forêts et océans.'
            }
        },
        de: {
            chinese: {
                name: 'Traditionelle chinesische Farben',
                nativeName: '中国传统色',
                description: 'Farben aus den Dynastien, der Poesie und der Natur des alten Chinas.'
            },
            japanese: {
                name: 'Traditionelle japanische Farben',
                nativeName: '日本の伝統色',
                description: 'Vor über 1.000 Jahren etabliert, repräsentieren sie die wechselnden Jahreszeiten Japans.'
            },
            pantone: {
                name: 'Pantone-Trends 2025',
                nativeName: 'Zukunftsästhetik',
                description: 'Prognostizierte Farbsieger und globale Designtrends für das Jahr 2025.'
            },
            nature: {
                name: 'Natur- und Erdpaletten',
                nativeName: 'Organische Ursprünge',
                description: 'Organische Pigmente und Erdtöne aus Bergen, Wäldern und Ozeanen.'
            }
        },
        pt: {
            chinese: {
                name: 'Cores Tradicionais Chinesas',
                nativeName: '中国传统色',
                description: 'Cores das dinastias, poesia e natureza da China antiga.'
            },
            japanese: {
                name: 'Cores Tradicionais Japonesas',
                nativeName: '日本の伝統色',
                description: 'Estabelecido há mais de 1.000 anos, representando as estações do Japão.'
            },
            pantone: {
                name: 'Tendências Pantone 2025',
                nativeName: 'Estética Futura',
                description: 'Vencedores de cores previstos e tendências de design global para o ano de 2025.'
            },
            nature: {
                name: 'Paletas de Natureza e Terra',
                nativeName: 'Origens Orgânicas',
                description: 'Pigmentos orgânicos e tons de terra derivados de montanhas, florestas e oceanos.'
            }
        }
    };

    const localeMap = metaMap[locale] || metaMap.en;
    return localeMap[collectionId] || localeMap.chinese;
}
