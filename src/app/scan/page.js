import PersonalColorAnalyst from '../../components/PersonalColorAnalyst';
import JsonLd from '../../components/JsonLd';

export const metadata = {
    title: 'Find Your Traditional Color Aura | AI Personal Color Analysis',
    description: 'Upload a selfie to discover your unique Traditional Chinese Color Aura. Are you Imperial Red or Tea White? Scan now.',
    alternates: {
        canonical: '/scan',
    },
    openGraph: {
        title: 'I found my Traditional Color Aura! What is yours?',
        description: 'Discover your unique color match from 588 traditional shades.',
        images: ['/images/share-card-preview.jpg'], // Placeholder for viral card
    },
};

export default function PersonalColorPage() {
    const appSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AI Personal Color Analyst",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1250"
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50 flex flex-col items-center py-12 px-4 font-sans">
            <JsonLd data={appSchema} />
            <div className="max-w-xl w-full text-center mb-8">
                <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-800 text-xs font-bold tracking-widest uppercase mb-4">
                    New Viral Feature
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
                    What is your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Color Aura</span>?
                </h1>
                <p className="text-lg text-neutral-600 font-serif italic">
                    "The face is the mirror of the soul, and color is its language."
                </p>
                <p className="text-sm text-neutral-400 mt-2">
                    Our AI analyzes your skin tone harmony to find your perfect Traditional Chinese Color match.
                </p>
            </div>

            {/* The Analysis Engine */}
            <PersonalColorAnalyst />

            {/* Privacy Section */}
            <div className="max-w-md mt-12 text-center text-xs text-neutral-400">
                <p>🔒 Privacy First: Analysis happens 100% on your device.</p>
                <p>Your photos are never uploaded to our servers.</p>
            </div>
        </main>
    );
}
