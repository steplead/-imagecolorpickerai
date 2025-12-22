import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req) {
    try {
        const { colorName, hex } = await req.json();

        let envCtx = null;
        try {
            if (typeof getRequestContext === 'function') {
                envCtx = getRequestContext()?.env;
            }
        } catch (e) {
            // Context not available in local dev
        }

        const apiKey = process.env.OPENROUTER_API_KEY || envCtx?.OPENROUTER_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat",
                "messages": [
                    { "role": "system", "content": "You are an expert on Chinese Aesthetics and Color Culture." },
                    { "role": "user", "content": `Write a 1-sentence poetic description for the Chinese color ${colorName} (${hex}). Focus on nature, history, or emotion. Do not include the color code in the output.` }
                ]
            })
        });

        const data = await response.json();
        return NextResponse.json({ meaning: data.choices[0].message.content });

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ error: "Failed to fetch meaning" }, { status: 500 });
    }
}
