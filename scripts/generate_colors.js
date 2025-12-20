const fs = require('fs');
const path = require('path');
const Replicate = require('replicate');
const sharp = require('sharp');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const DB_PATH = path.join(process.cwd(), 'src/data/chineseColors.json');
const IMAGES_DIR = path.join(process.cwd(), 'public/images/colors');
const TARGET_COUNT = 550;
const BATCH_SIZE = 5;

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Generate Image for a Color with Retry Logic
async function generateColorImage(color, retryCount = 0) {
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    const imagePath = path.join(IMAGES_DIR, `${color.id}.webp`);
    if (fs.existsSync(imagePath)) {
        return { status: 'exists' };
    }

    console.log(`🎨 [${retryCount > 0 ? 'RETRY ' + retryCount : 'GEN'}] ${color.name} (${color.hex})...`);

    const prompt = `A texture and wallpaper of the traditional Chinese color "${color.name}" (Hex: ${color.hex}). ${color.meaning} Aesthetic, minimalist, high quality texture, 8k resolution, chinese art style.`;

    try {
        const output = await replicate.run(
            "black-forest-labs/flux-schnell",
            {
                input: {
                    prompt: prompt,
                    aspect_ratio: "16:9",
                    output_format: "webp",
                    output_quality: 90
                }
            }
        );

        const imageUrl = Array.isArray(output) ? output[0] : output;

        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await sharp(buffer)
            .resize(1200, 630, { fit: 'cover', position: 'center' })
            .webp({ quality: 80 })
            .toFile(imagePath);

        console.log(`✅ Saved: ${color.id}.webp`);
        return { status: 'success' };

    } catch (err) {
        // Handle Rate Limits (429) or Forbidden (403 usually means quota/rate limit on free)
        if ((err.status === 429 || err.status === 403) && retryCount < 3) {
            const waitTime = Math.pow(2, retryCount) * 10000; // 10s, 20s, 40s
            console.warn(`⚠️  Rate limited for ${color.name}. Retrying in ${waitTime / 1000}s...`);
            await sleep(waitTime);
            return generateColorImage(color, retryCount + 1);
        }

        console.error(`❌ Failed ${color.name}: ${err.message}`);
        return { status: 'error', error: err.message };
    }
}

async function generateColors() {
    if (!process.env.REPLICATE_API_TOKEN) {
        console.error("❌ Error: REPLICATE_API_TOKEN missing in .env.local");
        process.exit(1);
    }

    let existingData = [];
    try {
        existingData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (err) {
        console.error("❌ Failed to read database.");
        process.exit(1);
    }

    console.log(`📊 Total Colors in DB: ${existingData.length}`);

    let finished = false;
    while (!finished) {
        const missing = existingData.filter(c => !fs.existsSync(path.join(IMAGES_DIR, `${c.id}.webp`)));
        console.log(`🖼️  Remaining Missing Images: ${missing.length}`);

        if (missing.length === 0) {
            console.log("✨ All images are now present.");
            finished = true;
            break;
        }

        // Process a small chunk of missing ones
        const batch = missing.slice(0, 5);
        for (const color of batch) {
            const result = await generateColorImage(color);
            if (result.status === 'success') {
                await sleep(2000);
            } else if (result.status === 'error') {
                console.log("⏸️  Encountered error, pausing for 60s before next attempt...");
                await sleep(60000);
            }
        }

        console.log("♻️ Restarting check for remaining missing images...");
        await sleep(5000);
    }

    console.log(`🎉 All assets generated successfully.`);
}

generateColors();
