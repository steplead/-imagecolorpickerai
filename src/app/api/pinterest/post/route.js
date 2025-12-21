import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req) {
    try {
        const { imageUrl, title, description, link } = await req.json();

        const envCtx = getRequestContext().env;
        const accessToken = process.env.PINTEREST_ACCESS_TOKEN || (envCtx ? envCtx.PINTEREST_ACCESS_TOKEN : null);
        const boardId = process.env.PINTEREST_BOARD_ID || (envCtx ? envCtx.PINTEREST_BOARD_ID : null);

        if (!accessToken || !boardId) {
            console.error("Missing Pinterest configuration.");
            return NextResponse.json({
                error: "Pinterest API not configured. Please add PINTEREST_ACCESS_TOKEN and PINTEREST_BOARD_ID to environment variables."
            }, { status: 500 });
        }

        // Pinterest API V5 - Create Pin
        const response = await fetch("https://api.pinterest.com/v5/pins", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                board_id: boardId,
                media_source: {
                    source_type: "image_url",
                    url: imageUrl
                },
                title: title,
                description: description || "Generated with Image Color Picker AI",
                link: link
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Pinterest API Error:", data);
            throw new Error(data.message || "Failed to create Pin");
        }

        return NextResponse.json({ success: true, pinUrl: `https://www.pinterest.com/pin/${data.id}` });

    } catch (error) {
        console.error("Pinterest Integration Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
