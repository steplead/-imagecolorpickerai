import chineseColors from '../data/chineseColors.json';

export default function sitemap() {
    const baseUrl = 'https://imagecolorpickerai.com';

    // 1. Static Routes
    const routes = [
        '',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'daily',
        priority: 1.0,
    }));

    // 2. Color Detail Pages (Programmatic)
    const colorRoutes = chineseColors.map((color) => ({
        url: `${baseUrl}/color/${color.id}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // 3. Category Pages (Programmatic)
    const uniqueTags = new Set();
    chineseColors.forEach(c => {
        if (c.tags) c.tags.forEach(t => uniqueTags.add(t));
    });

    const categoryRoutes = Array.from(uniqueTags).map((tag) => ({
        url: `${baseUrl}/colors/${tag}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    // 4. Comparison Pages (Programmatic SEO Hub)
    const vsRoutes = [];
    const tags = ['red', 'blue', 'green', 'warm'];
    tags.forEach(tag => {
        const colors = chineseColors.filter(c => c.tags && c.tags.includes(tag)).slice(0, 3);
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                vsRoutes.push({
                    url: `${baseUrl}/compare/${colors[i].id}-vs-${colors[j].id}`,
                    lastModified: new Date().toISOString().split('T')[0],
                    changeFrequency: 'monthly',
                    priority: 0.7,
                });
            }
        }
    });

    return [...routes, ...colorRoutes, ...categoryRoutes, ...vsRoutes];
}
