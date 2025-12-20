---
description: How to deploy ImageColorPickerAI to Cloudflare Pages
---

# Deploying to Cloudflare Pages

Follow these exact steps to move your site from Vercel to Cloudflare Pages.

### 1. Preparation
Ensure you have pushed all the latest changes (including the `wrangler.json`, `package.json` updates, and Edge runtime configs) to your GitHub repository.

### 2. Connect to Cloudflare
1.  Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  In the left sidebar, click **Workers & Pages**.
3.  Click **Create application** -> **Pages** -> **Connect to Git**.
4.  Select your GitHub account and the `imagecolorpickerai` repository.

### 3. Configure Build Settings
Once the repository is connected, set these values in the "Build settings" section:

*   **Framework preset**: `Next.js`
*   **Build command**: `npm run pages:build`
*   **Build output directory**: `.next`
*   **Root directory**: `/` (unless you moved the code into a subfolder)

### 4. Set Environment Variables
Cloudflare needs your API keys to run the AI features. scroll down to **Environment variables (advanced)** and click **Add variable**:

| Variable Name | Value |
| :--- | :--- |
| `REPLICATE_API_TOKEN` | *Your Replicate Token* |
| `OPENROUTER_API_KEY` | *Your OpenRouter Key* |
| `NODE_VERSION` | `20` (Recommended) |

### 5. Deployment
1.  Click **Save and Deploy**.
2.  Wait for the build to finish. Cloudflare will give you a `*.pages.dev` URL.

### 6. Linking your Custom Domain
If you want to use `imagecolorpickerai.com`:
1.  Go to the **Custom domains** tab in your Pages project.
2.  Click **Set up a custom domain**.
3.  Enter `imagecolorpickerai.com`.
4.  If your domain is managed by Cloudflare, it will automatically update the DNS. If not, follow the instructions to add a CNAME record.

> [!IMPORTANT]
> **Remove the domain from Vercel first** to avoid DNS conflicts, but do this *after* you see the site working on the `.pages.dev` URL.
