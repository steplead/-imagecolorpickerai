'use client';

import { useState, useRef, useEffect } from 'react';
import ColorThief from 'colorthief';
import { Upload, Image as ImageIcon, ArrowRight, Palette, Copy, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { findClosestChineseColor } from '../utils/colorUtils';
import RecentPicks from '../components/RecentPicks';
import PinterestGallery from '../components/PinterestGallery';
import AdPlacement from '../components/AdPlacement';

export default function HomeView({ locale = 'en' }) {
    const [image, setImage] = useState(null);
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [match, setMatch] = useState(null);
    const [copied, setCopied] = useState(false);
    const imgRef = useRef(null);

    // Localization Dictionary
    const labels = {
        en: {
            title: "Image Color Picker",
            titleSuffix: "& Traditional Encyclopedia",
            desc: "Extract precise Hex codes from any image and discover the cultural significance of Traditional Chinese and Japanese colors.",
            upload: "Upload an Image to Pick Colors",
            pickSub: "Pick Hex, RGB, and CMYK from pixels",
            pickAgain: "Pick Again",
            clear: "Clear",
            change: "Change Image",
            paletteHeader: "Pick a Color from the Palette",
            historicalMatch: "Historical Match",
            noMatch: "No direct culture match found.",
            pickPalette: "Pick Palette",
            collectionsHeader: "Traditional Color Collections",
            collectionsSub: "Pick colors from five thousand years of distilled aesthetic history.",
            chineseTitle: "Traditional Chinese Colors",
            chineseSub: "Pick hex codes from the dynasty galleries of Peking and Suzhou.",
            japaneseTitle: "Japanese Harmony Palette",
            japaneseSub: "Extract the subtle shades of the Heian period and seasonal kimonos.",
            startScan: "Start AI Scan",
            dnaTitle: "Predict Your Color DNA",
            articleTitle: "The Ultimate Image Color Picker & Cultural Encyclopedia",
            articleQ1: "Why Use an AI Image Color Picker?",
            articleA1: "An Image Color Picker is more than just a technical tool for designers; it is a bridge between digital photography and physical aesthetics. Our tool uses AI-powered color extraction to identify not just the dominant pixels, but the most visually significant shades in your photos. Whether you are building a website, designing a brand identity, or simply curious about a sunset photograph, picking the right hex codes is the first step toward visual harmony.",
            articleA1_2: "Unlike standard browser pickers, our online image color picker allows you to upload high-resolution images and instantly generate a CSS-ready palette. We provide values in Hex, RGB, and CMYK formats, ensuring your colors transition perfectly from screen to print.",
            articleQ2: "Mastering Traditional Chinese Colors",
            articleA2: "Traditional Chinese colors, known as Zhongguo Se, are deeply rooted in the Five Elements (Wu Xing) and ancient poetry. Colors like Cinnabar Red or Celadon Green are not just hex codes; they represent luck, balance, and nature. By using our color match detector, you can find which historical shade closest matches your image, unlocking a library of cultural meaning and artistic inspiration.",
            articleQ3: "Japanese Aesthetics: Picking Nippon Shades",
            articleA3: "Japanese colors (Dento-iro) focus on the transience of nature and the changing seasons. From the delicate pink of Sakura-iro to the deep blue of Aizome indigo, these colors are pillars of Wabi-Sabi design. Our tool simplifies the process of extracting Japanese palettes from your vacation photos or landscape art, providing a sophisticated alternative to modern neon color schemes.",
            articleQ4: "Design Tips for Color Accuracy",
            articleA4: "When you pick colors from images, always look for the relationship between the base color and its complements. A great design uses the 60-30-10 rule: 60% dominant color, 30% secondary, and 10% accent. Our AI Color Analyst helps you achieve this balance automatically by suggesting harmonies based on your primary pick.",
            articleCTA: "Start Picking Colors Today",
            articleCTASub: "Join thousands of professional designers and digital artists using ImageColorPickerAI to craft stunning visual experiences with 100% accuracy.",
            faqHeader: "Frequently Asked Questions",
            faqQ1: "How do I pick a color from an image?",
            faqA1: "Simply upload your JPG or PNG image to our tool. Use your mouse to hover over any area of the image, and the hex code will be displayed instantly.",
            faqQ2: "Is this color picker free?",
            faqA2: "Yes, ImageColorPickerAI is a 100% free online tool with unlimited uploads and palette generations.",
            faqQ3: "Can I extract colors for Japanese and Chinese art?",
            faqA3: "Absolutely. We specialize in mapping digital colors to traditional palettes, including Heian-era Japanese and Ming-era Chinese color systems."
        },
        zh: {
            title: "图片取色器",
            titleSuffix: "& 传统色彩百科",
            desc: "从任何图像中提取精确的十六进制代码，并发现中国和日本传统色彩的文化意义。",
            upload: "上传图片以取色",
            pickSub: "从像素中提取 Hex、RGB 和 CMYK",
            pickAgain: "重新取色",
            clear: "清除",
            change: "更换图片",
            paletteHeader: "从调色板中选择颜色",
            historicalMatch: "历史色彩匹配",
            noMatch: "未找到直接的文化匹配。",
            pickPalette: "查看配色",
            collectionsHeader: "传统色彩系列",
            collectionsSub: "从五千年萃取的审美历史中挑选颜色。",
            chineseTitle: "中国传统色",
            chineseSub: "从北京和苏州的宫廷画廊中挑选十六进制代码。",
            japaneseTitle: "日本和谐色调",
            japaneseSub: "提取平安时代和季节性和服的细微差别。",
            startScan: "开始 AI 扫描",
            dnaTitle: "预测您的色彩 DNA",
            articleTitle: "终极图片取色器与文化百科全书",
            articleQ1: "为什么要使用 AI 图片取色器？",
            articleA1: "图片取色器不仅仅是设计师的技术工具；它是数字摄影与物理美学之间的桥梁。我们的工具使用 AI 驱动的颜色提取技术，不仅可以识别主导像素，还可以识别照片中视觉上最重要的色调。无论您是在构建网站、设计品牌标识，还是仅仅对日落照片感到好奇，选择正确的十六进制代码都是迈向视觉和谐的第一步。",
            articleA1_2: "与标准的浏览器取色器不同，我们的在线图片取色器允许您上传高分辨率图像并立即生成 CSS 就绪的调色板。我们提供 Hex、RGB 和 CMYK 格式的值，确保您的颜色从屏幕完美过渡到打印。",
            articleQ2: "掌握中国传统色彩",
            articleA2: "中国传统色彩，也称为中国色，深深植根于五行（Wu Xing）和古代诗歌中。像辰砂红（Cinnabar Red）或青（Celadon Green）这样的颜色不仅仅是十六进制代码；它们代表着运气、平衡和自然。通过使用我们的色彩匹配检测器，您可以找到最接近您图像的历史色调，从而解开文化含义和艺术灵感的图书馆。",
            articleQ3: "日本美学：选择东洋色调",
            articleA3: "日本色彩（Dento-iro）关注自然的短暂性和季节的变化。从樱花色（Sakura-iro）的娇嫩粉红色到蓝染（Aizome）靛蓝的深蓝色，这些颜色是侘寂（Wabi-Sabi）设计的支柱。我们的工具简化了从度假照片或景观艺术中提取日本调色板的过程，为现代霓虹配色方案提供了一个精致的替代方案。",
            articleQ4: "色彩准确性的设计技巧",
            articleA4: "当您从图像中选择颜色时，请始终寻找基色与其补色之间的关系。伟大的设计遵循 60-30-10 规则：60% 主导色、30% 次要色和 10% 强调色。我们的 AI 色彩分析师通过根据您的主要选择建议和谐感，自动帮助您实现这种平衡。",
            articleCTA: "今天就开始取色",
            articleCTASub: "加入成千上万使用 ImageColorPickerAI 的专业设计师和数字艺术家的行列，以 100% 的准确度打造令人惊叹的视觉体验。",
            faqHeader: "常见问题解答",
            faqQ1: "如何从图像中取色？",
            faqA1: "只需将您的 JPG 或 PNG 图像上传到我们的工具中。使用鼠标悬停在图像的任何区域，十六进制代码将立即显示。",
            faqQ2: "这个取色器免费吗？",
            faqA2: "是的，ImageColorPickerAI 是一个 100% 免费的在线工具，具有无限的上载和调色板生成功能。",
            faqQ3: "我可以提取日本和中国艺术的颜色吗？",
            faqA3: "当然可以。我们专注于将数字色彩映射到传统调色板，包括平安时代的日本和明代的中国色彩系统。"
        },
        ja: {
            title: "画像カラーピッカー",
            titleSuffix: "& 伝統色百科事典",
            desc: "あらゆる画像から正確な16進コードを抽出し、伝統的な中国および日本の色の文化的重要性を発見します。",
            upload: "画像をアップロードして色を選択",
            pickSub: "ピクセルからHex、RGB、CMYKを抽出",
            pickAgain: "再試行",
            clear: "クリア",
            change: "画像を変更",
            paletteHeader: "パレットから色を選択",
            historicalMatch: "歴史的な一致",
            noMatch: "直接的な文化の一致は見つかりませんでした。",
            pickPalette: "パレットを選択",
            collectionsHeader: "伝統色のコレクション",
            collectionsSub: "5000年の洗練された美学の歴史から色を選びます。",
            chineseTitle: "中国の伝統色",
            chineseSub: "北京や蘇州の王朝ギャラリーから16進コードを選択します。",
            japaneseTitle: "日本の伝統色",
            japaneseSub: "平安時代や季節の着物の繊細な色合いを抽出します。",
            startScan: "AIスキャンを開始",
            dnaTitle: "あなたのカラーDNAを予測",
            articleTitle: "究極の画像カラーピッカーと文化百科事典",
            articleQ1: "なぜ AI 画像カラーピッカーを使用するのですか？",
            articleA1: "画像カラーピッカーは、デザイナー向けの単なる技術的ツールではありません。デジタル写真と物理的な美学の間の架け橋です。当社のツールはAIを活用した色抽出を使用して、支配的なピクセルだけでなく、写真の中で視覚的に最も重要な色合いを特定します。ウェブサイトの構築、ブランドアイデンティティのデザイン、あるいは単に夕日の写真に興味がある場合でも、適切な16進コードを選択することは、視覚的な調和への第一歩です。",
            articleA1_2: "標準的なブラウザのピッカーとは異なり、当社のオンライン画像カラーピッカーを使用すると、高解像度の画像をアップロードして、CSS対応のパレットを即座に生成できます。Hex、RGB、CMYK形式の値を提供し、色が画面から印刷へと完全に移行することを保証します。",
            articleQ2: "中国の伝統色の習得",
            articleA2: "中国の伝統色（Zhongguo Se）は、五行（Wu Xing）と古代の詩に深く根ざしています。辰砂色（Cinnabar Red）や青（Celadon Green）などの色は単なる16進コードではありません。運、バランス、自然を表しています。当社の色一致検出器を使用すると、どの歴史的な色合いが画像に最も近いかを見つけることができ、文化的な意味と芸術的なインスピレーションのライブラリのロックを解除できます。",
            articleQ3: "日本の美学：日本の色合いの選択",
            articleA3: "日本の色（伝統色）は、自然の無常と移りゆく季節に焦点を当てています。桜色の繊細なピンクから藍染の深い青まで、これらの色は侘び寂びデザインの柱です。当社のツールは、休暇の写真や風景画から日本のパレットを抽出するプロセスを簡素化し、現代のネオンカラー構成に代わる洗練された選択肢を提供します。",
            articleQ4: "色の正確さのためのデザインのヒント",
            articleA4: "画像から色を選択するときは、常にベースカラーとその補色の関係を探してください。優れたデザインは60-30-10ルールを使用します。60%の支配的な色、30%の二次的な色、そして10%のアクセント色です。当社のAIカラーアナリストは、主要な選択に基づいて調和を提案することにより、このバランスを自動的に達成するのに役立ちます。",
            articleCTA: "今すぐ色の選択を始める",
            articleCTASub: "ImageColorPickerAI を使用して、100% の精度で素晴らしい視覚体験を作り出している何千人ものプロのデザイナーやデジタル アーティストの仲間に加わりましょう。",
            faqHeader: "よくある質問",
            faqQ1: "画像から色を選択するにはどうすればよいですか？",
            faqA1: "JPGまたはPNG画像をツールにアップロードするだけです。画像上の任意の領域にマウスを合わせると、16進コードが即座に表示されます。",
            faqQ2: "このカラーピッカーは無料ですか？",
            faqA2: "はい、ImageColorPickerAI は、無制限のアップロードとパレット生成を備えた 100% 無料のオンライン ツールです。",
            faqQ3: "日本や中国の芸術の色を抽出できますか？",
            faqA3: "もちろんです。平安時代の日本や明時代の中国の色彩体系を含む、デジタルカラーを伝統的なパレットにマッピングすることを専門としています。"
        },
        es: {
            title: "Selector de Color de Imagen",
            titleSuffix: "& Enciclopedia Tradicional",
            desc: "Extraiga códigos Hex precisos de cualquier imagen y descubra el significado cultural de los colores tradicionales chinos y japoneses.",
            upload: "Subir una imagen para elegir colores",
            pickSub: "Elija Hex, RGB y CMYK de los píxeles",
            pickAgain: "Elegir de nuevo",
            clear: "Limpiar",
            change: "Cambiar imagen",
            paletteHeader: "Elija un color de la paleta",
            historicalMatch: "Coincidencia histórica",
            noMatch: "No se encontró coincidencia cultural directa.",
            pickPalette: "Elegir paleta",
            collectionsHeader: "Colecciones de colores tradicionales",
            collectionsSub: "Elija colores de cinco mil años de historia estética destilada.",
            chineseTitle: "Colores tradicionales chinos",
            chineseSub: "Elija códigos hex de las galerías de las dinastías de Pekín y Suzhou.",
            japaneseTitle: "Paleta de armonía japonesa",
            japaneseSub: "Extraiga los sutiles matices del período Heian y los kimonos estacionales.",
            startScan: "Empezar escaneo AI",
            dnaTitle: "Predice tu ADN de color",
            articleTitle: "El Mejor Selector de Color de Imagen y Enciclopedia Cultural",
            articleQ1: "¿Por qué usar un selector de color de imagen AI?",
            articleA1: "Un selector de color de imagen es más que una simple herramienta técnica para diseñadores; es un puente entre la fotografía digital y la estética física. Nuestra herramienta utiliza la extracción de color impulsada por AI para identificar no solo los píxeles dominantes, sino también los tonos visualmente más significativos en sus fotos. Ya sea que esté creando un sitio web, diseñando una identidad de marca o simplemente tenga curiosidad por una fotografía de puesta de sol, elegir los códigos hexadecimales correctos es el primer paso hacia la armonía visual.",
            articleA1_2: "A diferencia de los selectores de navegador estándar, nuestro selector de color de imagen en línea le permite cargar imágenes de alta resolución y generar instantáneamente una paleta lista para CSS. Proporcionamos valores en formatos Hex, RGB y CMYK, asegurando que sus colores se trasladen perfectamente de la pantalla a la impresión.",
            articleQ2: "Dominando los colores tradicionales chinos",
            articleA2: "Los colores tradicionales chinos, conocidos como Zhongguo Se, están profundamente arraigados en los Cinco Elementos (Wu Xing) y la poesía antigua. Colores como el rojo cinabrio o el verde celadón no son solo códigos hexadecimales; representan suerte, equilibrio y naturaleza. Al usar nuestro detector de coincidencia de color, puede encontrar qué tono histórico se asemeja más a su imagen, desbloqueando una biblioteca de significado cultural e inspiración artística.",
            articleQ3: "Estética japonesa: eligiendo tonos Nippon",
            articleA3: "Los colores japoneses (Dento-iro) se centran en la fugacidad de la naturaleza y el cambio de las estaciones. Desde el delicado rosa de Sakura-iro hasta el azul profundo del índigo Aizome, estos colores son pilares del diseño Wabi-Sabi. Nuestra herramienta simplifica el proceso de extracción de paletas japonesas de sus fotos de vacaciones o arte paisajístico, proporcionando una alternativa sofisticada a los esquemas modernos de colores neón.",
            articleQ4: "Consejos de diseño para la precisión del color",
            articleA4: "Cuando elija colores de las imágenes, busque siempre la relación entre el color base y sus complementos. Un gran diseño utiliza la regla 60-30-10: 60% de color dominante, 30% secundario y 10% de acento. Nuestro Analista de Color AI le ayuda a lograr este equilibrio automáticamente sugiriendo armonías basadas en su selección principal.",
            articleCTA: "Comience a elegir colores hoy",
            articleCTASub: "Únase a miles de diseñadores profesionales y artistas digitales que utilizan ImageColorPickerAI para crear experiencias visuales impresionantes con un 100% de precisión.",
            faqHeader: "Preguntas frecuentes",
            faqQ1: "¿Cómo elijo un color de una imagen?",
            faqA1: "Simplemente cargue su imagen JPG o PNG en nuestra herramienta. Use su mouse para desplazarse sobre cualquier área de la imagen y el código hexadecimal se mostrará instantáneamente.",
            faqQ2: "¿Es gratis este selector de color?",
            faqA2: "Sí, ImageColorPickerAI es una herramienta en línea 100% gratuita con cargas y generaciones de paletas ilimitadas.",
            faqQ3: "¿Puedo extraer colores para el arte japonés y chino?",
            faqA3: "Absolutamente. Nos especializamos en mapear colores digitales a paletas tradicionales, incluidos los sistemas de color japoneses de la era Heian y chinos de la era Ming."
        },
        fr: {
            title: "Sélecteur de Couleur d'Image",
            titleSuffix: "& Encyclopédie Traditionnelle",
            desc: "Extrayez des codes Hex précis de n'importe quelle image et découvrez la signification culturelle des couleurs traditionnelles chinoises et japonaises.",
            upload: "Télécharger une image pour choisir des couleurs",
            pickSub: "Choisissez Hex, RGB et CMYK à partir des pixels",
            pickAgain: "Choisir à nouveau",
            clear: "Effacer",
            change: "Modifier l'image",
            paletteHeader: "Choisissez une couleur dans la palette",
            historicalMatch: "Correspondance historique",
            noMatch: "Aucune correspondance culturelle directe trouvée.",
            pickPalette: "Choisir la palette",
            collectionsHeader: "Collections de couleurs traditionnelles",
            collectionsSub: "Choisissez des couleurs parmi cinq mille ans d'histoire esthétique distillée.",
            chineseTitle: "Couleurs traditionnelles chinoises",
            chineseSub: "Choisissez des codes hex dans les galeries des dynasties de Pékin et Suzhou.",
            japaneseTitle: "Palette d'harmonie japonaise",
            japaneseSub: "Extrayez les nuances subtiles de la période Heian et des kimonos saisonniers.",
            startScan: "Démarrer le scan AI",
            dnaTitle: "Prédisez votre ADN couleur",
            articleTitle: "Le sélecteur de couleurs d'image et l'encyclopédie culturelle par excellence",
            articleQ1: "Pourquoi utiliser un sélecteur de couleurs d'image par IA ?",
            articleA1: "Un sélecteur de couleurs d'image est plus qu'un simple outil technique pour les designers ; c'est un pont entre la photographie numérique et l'esthétique physique. Notre outil utilise l'extraction de couleurs assistée par IA pour identifier non seulement les pixels dominants, mais aussi les nuances les plus significatives sur le plan visuel dans vos photos. Que vous construisiez un site web, conceviez une identité de marque ou soyez simplement curieux d'une photographie de coucher de soleil, choisir les bons codes hexadécimaux est la première étape vers l'harmonie visuelle.",
            articleA1_2: "Contrairement aux sélecteurs de navigateur standard, notre sélecteur de couleurs d'image en ligne vous permet de télécharger des images haute résolution et de générer instantanément une palette prête pour le CSS. Nous fournissons des valeurs aux formats Hex, RGB et CMYK, garantissant que vos couleurs passent parfaitement de l'écran à l'impression.",
            articleQ2: "Maîtriser les couleurs traditionnelles chinoises",
            articleA2: "Les couleurs traditionnelles chinoises, connues sous le nom de Zhongguo Se, sont profondément enracinées dans les cinq éléments (Wu Xing) et la poésie ancienne. Les couleurs comme le rouge cinabre ou le vert céladon ne sont pas de simples codes hexadécimaux ; elles représentent la chance, l'équilibre et la nature. En utilisant notre détecteur de correspondance de couleurs, vous pouvez trouver quelle nuance historique se rapproche le plus de votre image, débloquant ainsi une bibliothèque de significations culturelles et d'inspiration artistique.",
            articleQ3: "Esthétique japonaise : choisir les teintes nippones",
            articleA3: "Les couleurs japonaises (Dento-iro) se concentrent sur la fugacité de la nature et le changement des saisons. Du rose délicat de Sakura-iro au bleu profond de l'indigo Aizome, ces couleurs sont les piliers du design Wabi-Sabi. Notre outil simplifie le processus d'extraction des palettes japonaises à partir de vos photos de vacances ou de vos œuvres d'art paysagères, offrant une alternative sophistiquée aux schémas de couleurs néon modernes.",
            articleQ4: "Conseils de design pour la précision des couleurs",
            articleA4: "Lorsque vous choisissez des couleurs à partir d'images, cherchez toujours la relation entre la couleur de base et ses compléments. Un bon design utilise la règle du 60-30-10 : 60 % de couleur dominante, 30 % de couleur secondaire et 10 % de couleur d'accent. Notre analyste de couleurs par IA vous aide à atteindre cet équilibre automatiquement en suggérant des harmonies basées sur votre choix principal.",
            articleCTA: "Commencez à choisir des couleurs dès aujourd'hui",
            articleCTASub: "Rejoignez des milliers de designers professionnels et d'artistes numériques utilisant ImageColorPickerAI pour créer des expériences visuelles époustouflantes avec une précision de 100 %.",
            faqHeader: "Foire aux questions",
            faqQ1: "Comment choisir une couleur à partir d'une image ?",
            faqA1: "Il vous suffit de télécharger votre image JPG ou PNG sur notre outil. Utilisez votre souris pour survoler n'importe quelle zone de l'image, et le code hexadécimal s'affichera instantanément.",
            faqQ2: "Ce sélecteur de couleurs est-il gratuit ?",
            faqA2: "Oui, ImageColorPickerAI est un outil en ligne 100 % gratuit avec des téléchargements et des générations de palettes illimités.",
            faqQ3: "Puis-je extraire des couleurs pour l'art japonais et chinois ?",
            faqA3: "Absolument. Nous sommes spécialisés dans la mise en correspondance des couleurs numériques avec les palettes traditionnelles, y compris les systèmes de couleurs japonais de l'ère Heian et chinois de l'ère Ming."
        },
        de: {
            title: "Bild-Farbwähler",
            titleSuffix: "& Traditionelle Enzyklopädie",
            desc: "Extrahieren Sie präzise Hex-Codes aus jedem Bild und entdecken Sie die kulturelle Bedeutung traditioneller chinesischer und japanischer Farben.",
            upload: "Ein Bild hochladen, um Farben auszuwählen",
            pickSub: "Wählen Sie Hex, RGB und CMYK aus Pixeln",
            pickAgain: "Erneut wählen",
            clear: "Löschen",
            change: "Bild ändern",
            paletteHeader: "Wählen Sie eine Farbe aus der Palette",
            historicalMatch: "Historische Übereinstimmung",
            noMatch: "Keine direkte kulturelle Übereinstimmung gefunden.",
            pickPalette: "Palette wählen",
            collectionsHeader: "Traditionelle Farbkollektionen",
            collectionsSub: "Wählen Sie Farben aus fünftausend Jahren destillierter ästhetischer Geschichte.",
            chineseTitle: "Traditionelle chinesische Farben",
            chineseSub: "Wählen Sie Hex-Codes aus den Dynastie-Galerien von Peking und Suzhou.",
            japaneseTitle: "Japanische Harmonie-Palette",
            japaneseSub: "Extrahieren Sie die subtilen Nuancen der Heian-Zeit und saisonaler Kimonos.",
            startScan: "KI-Scan starten",
            dnaTitle: "Sagen Sie Ihre Farb-DNA voraus",
            articleTitle: "Der ultimative Bild-Farbwähler & kulturelle Enzyklopädie",
            articleQ1: "Warum einen KI-Bild-Farbwähler verwenden?",
            articleA1: "Ein Bild-Farbwähler ist mehr als nur ein technisches Werkzeug für Designer; er ist eine Brücke zwischen digitaler Fotografie und physischer Ästhetik. Unser Werkzeug nutzt KI-gestützte Farbalgorithmen, um nicht nur die dominanten Pixel, sondern auch die visuell bedeutendsten Farbtöne in Ihren Fotos zu identifizieren. Egal, ob Sie eine Website erstellen, eine Markenidentität entwerfen oder einfach nur neugierig auf ein Sonnenuntergangsfoto sind – die Wahl der richtigen Hex-Codes ist der erste Schritt zu visueller Harmonie.",
            articleA1_2: "Im Gegensatz zu Standard-Browser-Farbwählern ermöglicht es unser Online-Bild-Farbwähler, hochauflösende Bilder hochzuladen und sofort eine CSS-fähige Palette zu generieren. Wir liefern Werte in den Formaten Hex, RGB und CMYK, um sicherzustellen, dass Ihre Farben perfekt vom Bildschirm in den Druck übertragen werden.",
            articleQ2: "Die Beherrschung traditioneller chinesischer Farben",
            articleA2: "Traditionelle chinesische Farben, bekannt als Zhongguo Se, sind tief in den Fünf Elementen (Wu Xing) und der antiken Poesie verwurzelt. Farben wie Zinnoberrot oder Seladongrün sind nicht nur Hex-Codes; sie stehen für Glück, Ausgewogenheit und Natur. Mit unserem Farbabgleich-Detektor können Sie herausfinden, welcher historische Farbton Ihrem Bild am nächsten kommt, und so eine Bibliothek kultureller Bedeutung und künstlerischer Inspiration erschließen.",
            articleQ3: "Japanische Ästhetik: Auswahl von Nippon-Tönen",
            articleA3: "Japanische Farben (Dento-iro) konzentrieren sich auf die Vergänglichkeit der Natur und den Wechsel der Jahreszeiten. Vom zarten Rosa von Sakura-iro bis zum tiefen Blau von Aizome-Indigo sind diese Farben die Säulen des Wabi-Sabi-Designs. Unser Werkzeug vereinfacht das Extrahieren japanischer Paletten aus Ihren Urlaubsfotos oder Landschaftsbildern und bietet eine anspruchsvolle Alternative zu modernen Neon-Farbschemata.",
            articleQ4: "Design-Tipps für Farbgenauigkeit",
            articleA4: "Wenn Sie Farben aus Bildern auswählen, achten Sie immer auf die Beziehung zwischen der Basisfarbe und ihren Ergänzungen. Ein großartiges Design nutzt die 60-30-10-Regel: 60 % dominante Farbe, 30 % Sekundärfarbe und 10 % Akzentfarbe. Unser KI-Farbanalyst hilft Ihnen, dieses Gleichgewicht automatisch zu erreichen, indem er Harmonien basierend auf Ihrer primären Auswahl vorschlägt.",
            articleCTA: "Beginnen Sie noch heute mit der Farbauswahl",
            articleCTASub: "Schließen Sie sich Tausenden von professionellen Designern und digitalen Künstlern an, die ImageColorPickerAI verwenden, um atemberaubende visuelle Erlebnisse mit 100 % Genauigkeit zu schaffen.",
            faqHeader: "Häufig gestellte Fragen (FAQ)",
            faqQ1: "Wie wähle ich eine Farbe aus einem Bild aus?",
            faqA1: "Laden Sie einfach Ihr JPG- oder PNG-Bild in unser Werkzeug hoch. Bewegen Sie die Maus über einen beliebigen Bereich des Bildes, und der Hex-Code wird sofort angezeigt.",
            faqQ2: "Ist dieser Farbwähler kostenlos?",
            faqA2: "Ja, ImageColorPickerAI ist ein 100 % kostenloses Online-Werkzeug mit unbegrenzten Uploads und Palettengenerierungen.",
            faqQ3: "Kann ich Farben für japanische und chinesische Kunst extrahieren?",
            faqA3: "Absolut. Wir sind darauf spezialisiert, digitale Farben auf traditionelle Paletten abzubilden, einschließlich der japanischen Heian-Ära und der chinesischen Ming-Ära Farbsysteme."
        },
        pt: {
            title: "Seletor de Cores de Imagem",
            titleSuffix: "& Enciclopédia Tradicional",
            desc: "Extraia códigos Hex precisos de qualquer imagem e descubra o significado cultural das cores tradicionais chinesas e japonesas.",
            upload: "Carregar uma imagem para escolher cores",
            pickSub: "Escolha Hex, RGB e CMYK dos pixels",
            pickAgain: "Escolher novamente",
            clear: "Limpar",
            change: "Alterar imagem",
            paletteHeader: "Escolha uma cor da paleta",
            historicalMatch: "Correspondência histórica",
            noMatch: "Nenhuma correspondência cultural direta encontrada.",
            pickPalette: "Escolher paleta",
            collectionsHeader: "Coleções de cores tradicionais",
            collectionsSub: "Escolha cores de cinco mil anos de história estética destilada.",
            chineseTitle: "Cores tradicionais chinesas",
            chineseSub: "Escolha códigos hex das galerias das dinastias de Pequim e Suzhou.",
            japaneseTitle: "Paleta de harmonia japonesa",
            japaneseSub: "Extraia as nuances sutis do período Heian e dos quimonos sazonais.",
            startScan: "Iniciar scan AI",
            dnaTitle: "Preveja seu DNA de cor",
            articleTitle: "O definitivo seletor de cores de imagem e enciclopédia cultural",
            articleQ1: "Por que usar um seletor de cores de imagem por IA?",
            articleA1: "Um seletor de cores de imagem é mais do que apenas uma ferramenta técnica para designers; é uma ponte entre a fotografia digital e a estética física. Nossa ferramenta usa extração de cores impulsionada por IA para identificar não apenas os pixels dominantes, mas também os tons visualmente mais significativos em suas fotos. Esteja você construindo um site, criando uma identidade de marca ou apenas curioso sobre uma fotografia de pôr do sol, escolher os códigos hexadecimais corretos é o primeiro passo para a harmonia visual.",
            articleA1_2: "Diferente dos seletores de navegador padrão, nosso seletor de cores de imagem on-line permite que você carregue imagens de alta resolução e gere instantaneamente uma paleta pronta para CSS. Fornecemos valores nos formatos Hex, RGB e CMYK, garantindo que suas cores transitem perfeitamente da tela para a impressão.",
            articleQ2: "Dominando as cores tradicionais chinesas",
            articleA2: "As cores tradicionais chinesas, conhecidas como Zhongguo Se, estão profundamente enraizadas nos Cinco Elementos (Wu Xing) e na poesia antiga. Cores como o vermelho cinábrio ou o verde celadon não são apenas códigos hexadecimais; representam sorte, equilíbrio e natureza. Ao usar nosso detector de correspondência de cores, você pode encontrar qual tom histórico mais se aproxima da sua imagem, desbloqueando uma biblioteca de significados culturais e inspiração artística.",
            articleQ3: "Estética japonesa: escolhendo tons nipônicos",
            articleA3: "As cores japonesas (Dento-iro) concentram-se na transitoriedade da natureza e na mudança das estações. Do rosa delicado de Sakura-iro ao azul profundo do índigo Aizome, essas cores são pilares do design Wabi-Sabi. Nossa ferramenta simplifica o processo de extração de paletas japonesas de suas fotos de férias ou arte de paisagem, oferecendo uma alternativa sofisticada aos esquemas de cores neon modernos.",
            articleQ4: "Dicas de design para precisão de cores",
            articleA4: "Ao escolher cores a partir de imagens, procure sempre a relação entre a cor base e seus complementos. Um ótimo design usa a regra 60-30-10: 60% de cor dominante, 30% secundária e 10% de destaque. Nosso analista de cores por IA ajuda você a alcançar esse equilíbrio automaticamente, sugerindo harmonias baseadas na sua escolha principal.",
            articleCTA: "Comece a escolher cores hoje",
            articleCTASub: "Junte-se a milhares de designers profissionais e artistas digitais que usam o ImageColorPickerAI para criar experiências visuais impressionantes com 100% de precisão.",
            faqHeader: "Perguntas frequentes",
            faqQ1: "Como eu escolho uma cor de uma imagem?",
            faqA1: "Basta carregar sua imagem JPG ou PNG em nossa ferramenta. Use o mouse para passar sobre qualquer área da imagem e o código hexadecimal será exibido instantaneamente.",
            faqQ2: "Este seletor de cores é gratuito?",
            faqA2: "Sim, o ImageColorPickerAI é uma ferramenta on-line 100% gratuita com uploads e gerações de paletas ilimitados.",
            faqQ3: "Posso extrair cores para arte japonesa e chinesa?",
            faqA3: "Com certeza. Somos especializados em mapear cores digitais para paletas tradicionais, incluindo os sistemas de cores japoneses da era Heian e chineses da era Ming."
        }
    };

    const t = labels[locale] || labels.en;

    // 1. Load state from localStorage on mount AND handle extension picks
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check for extension handoff first
            const params = new URLSearchParams(window.location.search);
            const pickedHex = params.get('picked');

            if (pickedHex) {
                const hex = `#${pickedHex}`;
                setSelectedColor(hex);
                const result = findClosestChineseColor(hex);
                setMatch(result);
                // Clear param from URL without reload
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
                return; // Skip loading local storage if we have a fresh pick
            }

            const savedImage = localStorage.getItem('picker_image');
            const savedColors = localStorage.getItem('picker_colors');
            const savedSelected = localStorage.getItem('picker_selected');

            if (savedImage) setImage(savedImage);
            if (savedColors) setColors(JSON.parse(savedColors));
            if (savedSelected) {
                setSelectedColor(savedSelected);
                const result = findClosestChineseColor(savedSelected);
                setMatch(result);
            }
        }
    }, []);

    // 2. Save state to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (image) localStorage.setItem('picker_image', image);
            if (colors.length > 0) localStorage.setItem('picker_colors', JSON.stringify(colors));
            if (selectedColor) localStorage.setItem('picker_selected', selectedColor);
        }
    }, [image, colors, selectedColor]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Use FileReader to get Base64 for persistence
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                setImage(base64);
                setColors([]);
                setSelectedColor(null);
                setMatch(null);
                // Reset localStorage for new image
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('picker_selected');
                    localStorage.removeItem('picker_colors');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const extractColors = () => {
        try {
            if (imgRef.current && imgRef.current.complete) {
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(imgRef.current, 8);
                const hexPalette = palette.map(rgb =>
                    "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
                );
                setColors(hexPalette);
            }
        } catch (err) {
            console.error("Color extraction failed:", err);
        }
    };

    const handleColorClick = (hex) => {
        setSelectedColor(hex);
        const result = findClosestChineseColor(hex);
        setMatch(result);
    };

    const clearTool = () => {
        setImage(null);
        setColors([]);
        setSelectedColor(null);
        setMatch(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('picker_image');
            localStorage.removeItem('picker_colors');
            localStorage.removeItem('picker_selected');
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-neutral-50 text-neutral-800 font-sans">

            {/* SEO Headline (H1 Strategy) */}
            <div className="text-center mb-10 max-w-2xl px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight mb-4 text-balance">
                    {t.title} <span className="text-red-600">AI</span> {t.titleSuffix}
                </h1>
                <p className="text-lg text-neutral-500 font-serif italic">
                    {t.desc}
                </p>
            </div>

            {/* Main Tool Area */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100">
                {/* Upload Area */}
                <div className="relative w-full min-h-[300px] bg-neutral-100 flex items-center justify-center overflow-hidden group">
                    {!image ? (
                        <label className="flex flex-col items-center cursor-pointer p-8 transition hover:scale-105 active:scale-95">
                            <Upload className="w-12 h-12 text-neutral-400 mb-4" />
                            <span className="text-lg font-medium text-neutral-600">{t.upload}</span>
                            <span className="text-sm text-neutral-400 mt-2">{t.pickSub}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    ) : (
                        <>
                            {typeof image === 'string' && image && (
                                <figure className="w-full h-full flex items-center justify-center p-4">
                                    <img
                                        ref={imgRef}
                                        src={image}
                                        alt="Image Color Picker AI - Pick Colors from Images"
                                        title="Pick Colors from this Image"
                                        className="w-full h-full object-contain max-h-[500px] shadow-sm rounded-lg"
                                        onLoad={() => setTimeout(extractColors, 100)}
                                    />
                                </figure>
                            )}
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button
                                    onClick={extractColors}
                                    className="bg-neutral-900 text-white px-4 py-2 rounded-full shadow-sm text-sm font-medium hover:bg-neutral-800 transition backdrop-blur"
                                >
                                    {t.pickAgain}
                                </button>
                                <button
                                    onClick={clearTool}
                                    className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium text-red-500 hover:bg-neutral-50 transition"
                                >
                                    {t.clear}
                                </button>
                                <label className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium cursor-pointer hover:bg-white transition">
                                    {t.change}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </>
                    )}
                </div>

                {/* Palette Area */}
                {colors.length > 0 && (
                    <div className="p-6 bg-white">
                        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">{t.paletteHeader}</h2>
                        <div className="flex flex-wrap gap-4 mb-8">
                            {colors.map((hex, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleColorClick(hex)}
                                    className={`w-12 h-12 rounded-full shadow-sm border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 ${selectedColor === hex ? 'border-neutral-800 scale-110 ring-2 ring-neutral-400' : 'border-transparent'}`}
                                    style={{ backgroundColor: hex }}
                                    aria-label={`Pick color ${hex}`}
                                />
                            ))}
                        </div>

                        {/* Match Result Area */}
                        {selectedColor && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-t pt-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t.historicalMatch}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedColor);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 transition"
                                            >
                                                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                                {selectedColor}
                                            </button>
                                        </div>
                                        {match ? (
                                            <div>
                                                <h3 className="text-3xl font-bold text-neutral-900 mt-1">{match.name}</h3>
                                                <p className="text-lg text-neutral-500 font-serif italic mt-1">{match.chinese} ({match.pinyin})</p>
                                                <p className="max-w-md text-sm text-neutral-600 mt-3 leading-relaxed">{match.meaning}</p>

                                                <div className="flex gap-2 mt-4">
                                                    {match.tags && match.tags.map(tag => (
                                                        <Link key={tag} href={`/colors/${tag}`} title={`View all ${tag} colors`} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded hover:bg-neutral-200">
                                                            #{tag}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-neutral-500 mt-2">{t.noMatch}</p>
                                        )}
                                    </div>

                                    {match && (
                                        <Link
                                            href={`${locale === 'en' ? '' : `/${locale}`}/color/${match.id}`}
                                            title={`Full Details for ${match.name}`}
                                            className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl font-medium hover:bg-neutral-800 transition shadow-lg hover:shadow-xl translate-y-2 group"
                                        >
                                            <span>{t.pickPalette}</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Monetization Slot - Home Above Fold (Protocol 3.3) */}
            <div className="w-full max-w-2xl px-4">
                <AdPlacement slot="home-top-fold" />
            </div>

            {/* History Section */}
            <RecentPicks lastPick={match} />

            {/* Social Gallery (Phase 16) */}
            <PinterestGallery />

            {/* Phase 24: Viral Discovery Banner */}
            <section className="max-w-4xl mx-auto mt-16 px-4">
                <Link
                    href="/scan"
                    title="Predict Your Color DNA with AI"
                    className="relative block w-full bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-3xl overflow-hidden shadow-2xl group border border-neutral-700"
                >
                    <div className="absolute inset-0 opacity-30 bg-repeat"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-500/20 to-transparent"></div>

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <span className="inline-block py-1 px-3 rounded-full bg-amber-400 text-amber-950 text-xs font-bold tracking-widest uppercase mb-3 animate-pulse">
                                AI Powered
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Predict Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">{t.dnaTitle.split('Your ')[1] || 'Color DNA'}</span>
                            </h2>
                            <p className="text-neutral-300 font-serif italic max-w-sm">
                                Unlock the personal palette that matches your facial features and traditional skin tone theory.
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <span className="flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                {t.startScan}
                            </span>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Collections & Moods (Global Encyclopedia Strategy) */}
            <section className="max-w-6xl w-full mt-24 mb-16 px-4">
                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">{t.collectionsHeader}</h2>
                    <p className="text-sm text-neutral-400 font-serif italic mt-1">{t.collectionsSub}</p>
                </div>

                {/* Primary Collections (Phase 20) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <Link
                        href={`${locale === 'en' ? '' : `/${locale}`}/colors/chinese`}
                        title="Explore Traditional Chinese Colors"
                        className="relative h-64 rounded-3xl overflow-hidden group shadow-2xl transition-all hover:scale-[1.01]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-amber-900" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <h3 className="text-3xl font-bold mb-2">{t.chineseTitle}</h3>
                            <p className="text-red-100 font-serif italic max-w-sm">{t.chineseSub}</p>
                        </div>
                    </Link>

                    <Link
                        href={`${locale === 'en' ? '' : `/${locale}`}/colors/japanese`}
                        title="Explore Japanese Harmony Palette"
                        className="relative h-64 rounded-3xl overflow-hidden group shadow-2xl transition-all hover:scale-[1.01]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-300" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <h3 className="text-3xl font-bold mb-2">{t.japaneseTitle}</h3>
                            <p className="text-rose-100 font-serif italic max-w-sm">{t.japaneseSub}</p>
                        </div>
                    </Link>
                </div>

                {/* Mood Tags */}
                <div className="flex flex-wrap gap-4 justify-center">
                    {['Red', 'Green', 'Blue', 'Nature', 'Warm', 'Cool'].map(tag => (
                        <Link
                            key={tag}
                            href={`${locale === 'en' ? '' : `/${locale}`}/colors/${tag.toLowerCase()}`}
                            title={`View ${tag} color group`}
                            className="px-6 py-3 bg-white border border-neutral-100 rounded-xl text-neutral-600 font-medium hover:bg-neutral-50 hover:border-neutral-200 transition shadow-sm"
                        >
                            Pick {tag} Colors
                        </Link>
                    ))}
                </div>
            </section>

            {/* Deep SEO Content (The Polished Gem Phase) */}
            <article className="max-w-4xl w-full mt-24 px-4 prose prose-neutral">
                <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">{t.articleTitle}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-neutral-600 leading-relaxed">
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-neutral-800">{t.articleQ1}</h3>
                        <p>
                            {t.articleA1}
                        </p>
                        <p>
                            {t.articleA1_2}
                        </p>
                        <h3 className="text-lg font-bold text-neutral-800">{t.articleQ2}</h3>
                        <p>
                            {t.articleA2}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-neutral-800">{t.articleQ3}</h3>
                        <p>
                            {t.articleA3}
                        </p>
                        <h3 className="text-lg font-bold text-neutral-800">{t.articleQ4}</h3>
                        <p>
                            {t.articleA4}
                        </p>
                    </div>
                </div>

                <div className="mt-16 p-8 bg-neutral-900 text-white rounded-3xl shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">{t.articleCTA}</h3>
                    <p className="text-neutral-400 mb-6">
                        {t.articleCTASub}
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition"
                    >
                        {t.upload}
                    </button>
                </div>
            </article>

            {/* Structured FAQ for SSR Audit */}
            <section className="max-w-xl mt-24 mb-24 pb-12 w-full px-4">
                <h2 className="text-xl font-bold text-neutral-900 mb-8 border-b pb-4">{t.faqHeader}</h2>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-neutral-800 mb-2">{t.faqQ1}</h4>
                        <p className="text-sm text-neutral-500">{t.faqA1}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-neutral-800 mb-2">{t.faqQ2}</h4>
                        <p className="text-sm text-neutral-500">{t.faqA2}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-neutral-800 mb-2">{t.faqQ3}</h4>
                        <p className="text-sm text-neutral-500">{t.faqA3}</p>
                    </div>
                </div>
            </section>

        </div >
    );
}
