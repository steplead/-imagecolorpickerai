import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import Replicate from "replicate";
import chineseColors from '@/data/chineseColors.json';

export const runtime = 'edge';

// Styles matching WallpaperGenerator.js
const STYLES = [
    {
        id: 'ink',
        name: 'Ink Painting',
        prompt: "traditional Chinese ink wash painting style, minimalist, elegant brushwork, ethereal atmosphere, ink on rice paper"
    },
    {
        id: 'silk',
        name: 'Silk Luxury',
        prompt: "luxurious Chinese silk fabric texture, intricate jacquard patterns, soft sheen, elegant folds, high-end textile feel"
    },
    {
        id: 'watercolor',
        name: 'Watercolor',
        prompt: "soft Chinese watercolor style, dreamy gradients, delicate washes, poetic and artistic, subtle textures"
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        prompt: "modern minimalist abstract design, clean lines, balanced composition, contemporary aesthetic, high-end graphic style"
    }
];

export async function GET(req) {
    try {
        let envCtx = null;
        try {
            if (typeof getRequestContext === 'function') {
                envCtx = getRequestContext()?.env;
            }
        } catch (e) {
            // Context not available in local dev
        }

        const cronSecret = process.env.CRON_SECRET || envCtx?.CRON_SECRET;
        const authHeader = req.headers.get('authorization');

        // Check if called with the secret key to prevent unauthorized triggers
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Natural Distribution Check
        // STRATEGY: Run Cron every 15 minutes (96 runs/day).
        // Target: ~15 posts/day.
        // Probability p = 15 / 96 = ~0.156 (15.6%)
        // This creates highly irregular gaps between posts (e.g., 15 mins, 4 hours, 30 mins)
        // creating a very natural, human-like activity pattern.
        const probability = 0.16;
        const isForce = req.nextUrl.searchParams.get('force') === 'true';

        if (!isForce && Math.random() > probability) {
            return NextResponse.json({
                success: true,
                status: "skipped",
                message: "Skipped to maintain natural random distribution (targeting 10-20 posts/day)."
            });
        }

        // 2. Pick a Random Color
        const randomColor = chineseColors[Math.floor(Math.random() * chineseColors.length)];

        // 3. Pick a Random Style
        const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];

        // 4. Generate Wallpaper using Replicate
        const replicateToken = process.env.REPLICATE_API_TOKEN || envCtx?.REPLICATE_API_TOKEN;
        if (!replicateToken) throw new Error("Missing REPLICATE_API_TOKEN");

        const replicate = new Replicate({ auth: replicateToken });
        const prompt = `${randomStyle.prompt}, focused on the color ${randomColor.name} (Hex: ${randomColor.hex}), ${randomColor.meaning}, 8k resolution, masterpieces, artistic`;

        const output = await replicate.run(
            "black-forest-labs/flux-schnell",
            {
                input: {
                    prompt: prompt,
                    aspect_ratio: "4:3",
                    output_format: "webp",
                    output_quality: 80,
                    megapixels: "1"
                }
            }
        );

        const imageUrl = Array.isArray(output) ? output[0] : output;
        if (!imageUrl) throw new Error("AI generation failed");

        // 5. Post to Pinterest
        const pinterestToken = process.env.PINTEREST_ACCESS_TOKEN || envCtx?.PINTEREST_ACCESS_TOKEN;
        const boardId = process.env.PINTEREST_BOARD_ID || envCtx?.PINTEREST_BOARD_ID;

        if (!pinterestToken || !boardId) throw new Error("Pinterest not configured");

        const pinResponse = await fetch("https://api.pinterest.com/v5/pins", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${pinterestToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                board_id: boardId,
                media_source: {
                    source_type: "image_url",
                    url: imageUrl.toString()
                },
                title: `${randomColor.name} (${randomColor.id}) - ${randomStyle.name} Style`,
                description: `${randomColor.meaning}. Experience the beauty of traditional Chinese color "${randomColor.name}" in a ${randomStyle.name} aesthetic. #ChineseColors #Aesthetic #Wallpaper #AIArt`,
                link: `https://imagecolorpickerai.com/color/${randomColor.id}`
            })
        });

        const pinData = await pinResponse.json();

        if (!pinResponse.ok) {
            throw new Error(pinData.message || "Failed to create Pin");
        }

        return NextResponse.json({
            success: true,
            posted: true,
            color: randomColor.name,
            style: randomStyle.name,
            pinUrl: `https://www.pinterest.com/pin/${pinData.id}`
        });

    } catch (error) {
        console.error("Auto-Post Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
