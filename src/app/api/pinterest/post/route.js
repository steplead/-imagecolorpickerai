import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req) {
    try {
        const { imageUrl, title, description, link } = await req.json();

        let envCtx = null;
        try {
            if (typeof getRequestContext === 'function') {
                envCtx = getRequestContext()?.env;
            }
        } catch (e) {
            // Context not available in local dev
        }

        const accessToken = process.env.PINTEREST_ACCESS_TOKEN || envCtx?.PINTEREST_ACCESS_TOKEN;
        const boardId = process.env.PINTEREST_BOARD_ID || envCtx?.PINTEREST_BOARD_ID;

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
            console.error("Pinterest API Error Context:", {
                status: response.status,
                statusText: response.statusText,
                data: data,
                boardIdUsed: boardId.substring(0, 4) + "..." + boardId.substring(boardId.length - 4)
            });

            // Provide more specific error messages based on Pinterest's response
            let errorMessage = data.message || "Failed to create Pin";
            if (response.status === 404) {
                errorMessage = `Pinterest says: Board not found or no access (ID: ${boardId})`;
            } else if (response.status === 403) {
                errorMessage = "Pinterest Permission Denied. Check your token scopes (pins:write, boards:read).";
            } else if (response.status === 401) {
                errorMessage = "Pinterest Unauthorized. Your token might be expired or invalid.";
            }

            return NextResponse.json({
                error: errorMessage,
                details: data
            }, { status: response.status });
        }

        return NextResponse.json({ success: true, pinUrl: `https://www.pinterest.com/pin/${data.id}` });

    } catch (error) {
        console.error("Pinterest Integration Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
