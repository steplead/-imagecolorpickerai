import { getAllColors } from '../utils/colorData';
import { IDEA_CATEGORIES } from '../utils/ideaUtils';

export default function sitemap() {
    const baseUrl = 'https://imagecolorpickerai.com';
    const allColors = getAllColors();

    // 1. Static Routes (The Hubs)
    const routes = [
        '',
        '/scan',
        '/ideas',
        '/about',
        '/contact',
        '/privacy-policy',
        '/terms-of-service',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'daily',
        priority: route === '' ? 1.0 : 0.9,
    }));

    // 2. Color Detail Pages (The Long Tail)
    const colorRoutes = allColors.map((color) => ({
        url: `${baseUrl}/color/${color.id}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // 3. Collection Pages (The Categories)
    // Extract unique collections (chinese, japanese, pantone, nature)
    const collections = [...new Set(allColors.map(c => c.collectionId || 'chinese'))];

    const collectionRoutes = collections.map((group) => ({
        url: `${baseUrl}/colors/${group}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    // 4. Idea Hub Pages (The Intent Buckets)
    const ideaRoutes = IDEA_CATEGORIES.map((cat) => ({
        url: `${baseUrl}/ideas/${cat.id}`,
        lastModified: new Date().toISOString().split('T')[0], // Always fresh
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    // 5. Comparison Pages (Legacy + Programmatic)
    const vsRoutes = [];
    // Only generate a small subset for sitemap to avoid bloat, 
    // relying on internal linking for the rest.
    const tags = ['red', 'blue', 'green', 'warm'];
    // Limit to first 20 comparisons to keep sitemap manageable
    let count = 0;

    tags.forEach(tag => {
        const colors = allColors.filter(c => c.tags && c.tags.includes(tag)).slice(0, 3);
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                if (count > 50) break;
                // Legacy Compare
                vsRoutes.push({
                    url: `${baseUrl}/compare/${colors[i].id}-vs-${colors[j].id}`,
                    lastModified: new Date().toISOString().split('T')[0],
                    changeFrequency: 'monthly',
                    priority: 0.7,
                });
                // Protocol 5 Combine (Seed)
                vsRoutes.push({
                    url: `${baseUrl}/combine/${colors[i].id}-and-${colors[j].id}`,
                    lastModified: new Date().toISOString().split('T')[0],
                    changeFrequency: 'monthly',
                    priority: 0.7,
                });
                count++;
            }
        }
    });

    // 6. Multilingual Expansion (ZH/JA/ES/FR/DE/PT)
    const zhRoutes = [
        ...colorRoutes.map(r => ({ ...r, url: r.url.replace('/color/', '/zh/color/') })),
        ...collectionRoutes.map(r => ({ ...r, url: r.url.replace('/colors/', '/zh/colors/') }))
    ];
    const jaRoutes = [
        ...colorRoutes.map(r => ({ ...r, url: r.url.replace('/color/', '/ja/color/') })),
        ...collectionRoutes.map(r => ({ ...r, url: r.url.replace('/colors/', '/ja/colors/') }))
    ];
    const esRoutes = [
        ...colorRoutes.map(r => ({ ...r, url: r.url.replace('/color/', '/es/color/') })),
        ...collectionRoutes.map(r => ({ ...r, url: r.url.replace('/colors/', '/es/colors/') }))
    ];
    const frRoutes = [
        ...colorRoutes.map(r => ({ ...r, url: r.url.replace('/color/', '/fr/color/') })),
        ...collectionRoutes.map(r => ({ ...r, url: r.url.replace('/colors/', '/fr/colors/') }))
    ];
    const deRoutes = [
        ...colorRoutes.map(r => ({ ...r, url: r.url.replace('/color/', '/de/color/') })),
        ...collectionRoutes.map(r => ({ ...r, url: r.url.replace('/colors/', '/de/colors/') }))
    ];
    const ptRoutes = [
        ...colorRoutes.map(r => ({ ...r, url: r.url.replace('/color/', '/pt/color/') })),
        ...collectionRoutes.map(r => ({ ...r, url: r.url.replace('/colors/', '/pt/colors/') }))
    ];

    return [
        ...routes,
        ...collectionRoutes,
        ...ideaRoutes,
        ...colorRoutes,
        ...vsRoutes,
        ...zhRoutes,
        ...jaRoutes,
        ...esRoutes,
        ...frRoutes,
        ...deRoutes,
        ...ptRoutes
    ];
}
