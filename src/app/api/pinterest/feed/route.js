import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(req) {
    try {
        let envCtx = null;
        try {
            if (typeof getRequestContext === 'function') {
                envCtx = getRequestContext()?.env;
            }
        } catch (e) {
            // Context not available (standard in local dev without wrangler)
        }

        const accessToken = process.env.PINTEREST_ACCESS_TOKEN || envCtx?.PINTEREST_ACCESS_TOKEN;
        const boardId = process.env.PINTEREST_BOARD_ID || envCtx?.PINTEREST_BOARD_ID;

        if (!accessToken || !boardId) {
            console.warn("Pinterest Config Missing - Access Token or Board ID not found in process.env or Cloudflare context.");
            // Return empty pins instead of 500 to prevent local dev UI crashes
            return NextResponse.json({ pins: [], warning: "Configuration missing" }, { status: 200 });
        }

        // Fetch Pins from the specific board
        // Endpoint: GET /v5/boards/{board_id}/pins
        const response = await fetch(`https://api.pinterest.com/v5/boards/${boardId}/pins?page_size=12`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Pinterest Feed Error:", data);
            return NextResponse.json({ error: data.message || "Failed to fetch pins" }, { status: response.status });
        }

        // Transform data for frontend
        const pins = data.items.map(pin => ({
            id: pin.id,
            title: pin.title || "Traditional Chinese Color",
            description: pin.description,
            imageUrl: pin.media && pin.media.images && pin.media.images['600x'] ? pin.media.images['600x'].url : (pin.media.images['1200x']?.url || pin.media.images['originals']?.url),
            link: `https://www.pinterest.com/pin/${pin.id}/`,
            colorInfo: extractColorInfo(pin.title, pin.description) // Helper to extract metadata if needed
        }));

        return NextResponse.json({ pins });

    } catch (error) {
        console.error("Pinterest Feed API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper to try and extract color name/style from title if possible
function extractColorInfo(title, description) {
    if (!title) return null;
    // Attempt to parse "Color Name (ID) - Style" format
    // Title format: "Swallow Rain (swallow-rain) - Ink Painting Style"
    const parts = title.split(' - ');
    if (parts.length > 0) {
        return {
            name: parts[0].split(' (')[0],
            style: parts[1] ? parts[1].replace(' Style', '') : 'Art'
        };
    }
    return null;
}
