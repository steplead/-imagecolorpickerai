import { NextResponse } from "next/server";
import Replicate from "replicate";

import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request) {
    try {
        const { prompt } = await request.json();

        let envCtx = null;
        try {
            if (typeof getRequestContext === 'function') {
                envCtx = getRequestContext()?.env;
            }
        } catch (e) {
            // Context not available in local dev
        }

        const token = process.env.REPLICATE_API_TOKEN || envCtx?.REPLICATE_API_TOKEN;

        if (!token) {
            console.error("Missing REPLICATE_API_TOKEN in environment.");
            return NextResponse.json({
                error: "Missing REPLICATE_API_TOKEN. Please ensure it is added to your Cloudflare Pages Environment Variables.",
            }, { status: 500 });
        }

        const replicate = new Replicate({
            auth: token,
        });

        // Valid parameters for black-forest-labs/flux-schnell
        // See: https://replicate.com/black-forest-labs/flux-schnell/api
        const output = await replicate.run(
            "black-forest-labs/flux-schnell",
            {
                input: {
                    prompt: prompt,
                    aspect_ratio: "4:3",
                    output_format: "webp",
                    output_quality: 80,
                    megapixels: "1" // Standard quality
                }
            }
        );

        // Replicate returns an array of URLs or strings
        const imageUrl = Array.isArray(output) ? output[0] : output;

        if (!imageUrl) {
            throw new Error("No image data returned from AI model");
        }

        // Ensure it's a string. If it's a ReadableStream or object, it might be a binary response.
        if (typeof imageUrl !== 'string' && typeof imageUrl.toString === 'function') {
            const urlString = imageUrl.toString();
            if (urlString.startsWith('http')) {
                return NextResponse.json({ url: urlString });
            }
        }

        if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
            return NextResponse.json({ url: imageUrl });
        }

        throw new Error("AI returned an invalid image format (not a URL)");

    } catch (error) {
        console.error("Replicate Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
