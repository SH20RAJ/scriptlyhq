export interface ProductSeoEntry {
  title: string;       // Max 60 chars template: "{Product Name} — {Unique Benefit} | ScriptlyStore"
  description: string; // Max 160 chars template: "Buy {Product Name}. {Value Prop}. ✓Instant Download ✓Verified ✓Lifetime Updates. ${price}"
  altText: string;     // Alt-text description for thumbnail/screenshots
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const PRODUCT_SEO_MAP: Record<string, ProductSeoEntry> = {
  "seoflow-blog-article-generator": {
    title: "SEOFlow — AI Blog Article SEO Markdown Writer | ScriptlyStore",
    description: "Buy SEOFlow. Generate high-ranking markdown blog articles in seconds using advanced AI pipelines. ✓Instant Download ✓Verified ✓Lifetime Updates.",
    altText: "SEOFlow CLI tool generating SEO-optimized markdown blog post from terminal using AI",
    faqs: [
      {
        question: "How does SEOFlow generate markdown articles?",
        answer: "SEOFlow connects directly to state-of-the-art LLMs using custom templates to construct detailed, SEO-friendly markdown articles, complete with tables, header hierarchies, and embedded keywords."
      },
      {
        question: "Does it support customization of the writing style?",
        answer: "Yes, you can configure target personas, keywords, formatting constraints, and custom guidelines to match your brand's voice."
      },
      {
        question: "Is there a recurring fee to use SEOFlow?",
        answer: "No, this is a one-time purchase with lifetime access. You run the CLI tool locally using your own API keys."
      }
    ]
  },
  "lynx-url-shortener-worker": {
    title: "Lynx — Telegram URL Shortener & Redirect Worker | ScriptlyStore",
    description: "Buy Lynx. Deploy a serverless URL shortener on Cloudflare Workers managed via a private Telegram Bot. ✓Instant Download ✓Verified ✓Lifetime Updates.",
    altText: "Lynx URL Shortener system diagram showing serverless redirect logic and Telegram integration",
    faqs: [
      {
        question: "What runtime does Lynx run on?",
        answer: "Lynx is built to run on the Cloudflare Workers edge runtime, providing sub-10ms redirects globally with zero server maintenance."
      },
      {
        question: "How do I manage links with the Telegram Bot?",
        answer: "The bot provides commands like /shorten, /list, and /delete, allowing you to create and manage redirect links on the go directly inside Telegram."
      },
      {
        question: "Are custom domains supported?",
        answer: "Yes, you can bind any custom domain hosted on Cloudflare to your worker for branded short links."
      }
    ]
  },
  "cryptobulk-crypto-alert-bot": {
    title: "Cryptobulk — Telegram Crypto Price Alert Bot | ScriptlyStore",
    description: "Buy Cryptobulk. Set up real-time crypto price tracking and instant price change notifications inside Telegram. ✓Instant Download ✓Verified ✓Lifetime Updates.",
    altText: "Cryptobulk dashboard interface showing cryptocurrency tracker alerts and user parameters",
    faqs: [
      {
        question: "Which cryptocurrencies are supported?",
        answer: "Cryptobulk supports all major cryptocurrencies listed on CoinGecko, including Bitcoin, Ethereum, and Solana."
      },
      {
        question: "How often are prices updated?",
        answer: "The bot polls prices using high-frequency APIs every minute, ensuring alerts trigger near-instantly when price thresholds are crossed."
      },
      {
        question: "Can multiple users receive the same alerts?",
        answer: "Yes, the bot can be configured for private chats, channel broadcasts, or group notifications."
      }
    ]
  },
  "aethera-telegram-ai-worker": {
    title: "Aethera — Telegram AI Assistant Edge Worker | ScriptlyStore",
    description: "Buy Aethera. Run a private ChatGPT-like assistant on Telegram using Cloudflare Workers and OpenAI APIs. ✓Instant Download ✓Verified ✓Lifetime Updates.",
    altText: "Aethera mobile screen showing chat dialog with AI helper bot in Telegram",
    faqs: [
      {
        question: "Does Aethera require a dedicated VPS?",
        answer: "No, Aethera is designed to run entirely serverless on Cloudflare Workers, keeping execution costs at near-zero."
      },
      {
        question: "Can I use models other than OpenAI?",
        answer: "Yes, Aethera supports OpenAI, Anthropic Claude, and Gemini models. You can easily switch models via configuration."
      },
      {
        question: "Is conversation history preserved?",
        answer: "Yes, chat history is securely saved in a Cloudflare KV namespace to support multi-turn conversational memory."
      }
    ]
  },
  "grille-restaurant-theme": {
    title: "GRILLÉ — Fine Dining & Luxury Restaurant Template | ScriptlyStore",
    description: "Buy GRILLÉ. A stunning, responsive HTML template designed for premium restaurants and culinary brands. ✓Instant Download ✓Verified ✓Lifetime Updates.",
    altText: "GRILLÉ luxury dining website layout showing menu lists, reservation banners, and food photography",
    faqs: [
      {
        question: "Is the reservation form functional?",
        answer: "The template includes a fully styled reservation form interface that easily connects to backend email endpoints or platforms like Resend."
      },
      {
        question: "Is it responsive on mobile phones?",
        answer: "Absolutely. GRILLÉ is optimized with responsive layouts, providing an elegant browsing experience on smartphones, tablets, and desktops."
      },
      {
        question: "Are images included in the download package?",
        answer: "Yes, all premium photography assets are packaged inside the assets folder for direct production usage."
      }
    ]
  },
  "react-native-expo-mobile-boilerplate": {
    title: "Expo React Native Mobile App Boilerplate | ScriptlyStore",
    description: "Buy React Native Expo Boilerplate. Launch iOS & Android mobile apps sharing Next.js API endpoints in hours. ✓Instant Download ✓Verified ✓Lifetime Updates.",
    altText: "Expo React Native Boilerplate mockup showing screen navigation templates and code framework",
    faqs: [
      {
        question: "What is included in the monorepo boilerplate?",
        answer: "The boilerplate includes an Expo mobile application, a shared TypeScript package, and a Next.js server workspace with pre-configured authentication, db schema, and api endpoints."
      },
      {
        question: "Does it support Push Notifications?",
        answer: "Yes, it comes with Expo Push Notifications pre-configured in the mobile codebase, complete with backend API handlers."
      },
      {
        question: "Can I publish to the App Store and Play Store?",
        answer: "Yes, the boilerplate follows standard Expo EAS workflows, allowing you to compile production builds easily."
      }
    ]
  },
  "midjourney-v6-photorealism-prompts": {
    title: "Midjourney V6 Photorealism AI Prompt Library | ScriptlyStore",
    description: "Buy Midjourney V6 Prompts. Generate hyper-realistic stock photos, portraits, and product mockups with AI. ✓Instant Download ✓Verified ✓Lifetime Updates.",
    altText: "Midjourney Photorealistic image showcase showing portraits and product layouts generated via prompts",
    faqs: [
      {
        question: "What parameters do these prompts use?",
        answer: "The prompt library is optimized for Midjourney v6 and newer, utilizing variables like aspect ratios, stylized parameters (--s), raw styles, and camera settings."
      },
      {
        question: "Are sample output images included?",
        answer: "Yes, every prompt includes the exact prompt copy, along with high-definition output previews showing the result of the prompt."
      },
      {
        question: "Is there support for prompt customization?",
        answer: "Yes, we include a guide on how to adjust lighting, camera lens details, and color palettes to customize the prompts for your projects."
      }
    ]
  },
  "solo-developers-guide-to-micro-saas": {
    title: "The Solo Developer's Guide to Micro-SaaS eBook | ScriptlyStore",
    description: "Buy Solo Developer's Guide. Learn the exact playbook to prototype, build, and monetize side projects to $1,000/mo. ✓Instant Download ✓Verified ✓Lifetime Updates.",
    altText: "eBook cover layout of The Solo Developer's Guide to Micro-SaaS outlining tech stacks and income blueprints",
    faqs: [
      {
        question: "What formats is the ebook delivered in?",
        answer: "The guide is delivered in PDF, EPUB, and a duplicate-ready Notion workspace template containing interactive worksheets."
      },
      {
        question: "Is this guide suitable for beginners?",
        answer: "It requires basic coding skills. It focuses on the business, marketing, and deployment mechanics of SaaS rather than elementary programming syntax."
      },
      {
        question: "Does it include code templates?",
        answer: "Yes, the guide links to starter boilerplates and contains practical code snippets for Stripe integration and database schema designs."
      }
    ]
  }
};

// Fallback helper to generate optimized SEO details for any products not explicitly mapped
export function getProductSeo(slug: string, title: string, shortDescription: string, category: string, priceText: string): ProductSeoEntry {
  const mapped = PRODUCT_SEO_MAP[slug];
  if (mapped) {
    // If the mapping exists, we format the description with the price if necessary
    const description = mapped.description.replace("${price}", priceText);
    return {
      ...mapped,
      description
    };
  }

  // Fallback dynamic generation
  const cleanTitle = title.split("-")[0].trim();
  const fallbackTitle = `${cleanTitle} — Premium ${category} | ScriptlyStore`;
  const fallbackDescription = `Buy ${cleanTitle}. ${shortDescription}. ✓Instant Download ✓Verified ✓Lifetime Updates. ${priceText}`;
  const fallbackAltText = `${cleanTitle} digital asset thumbnail preview on ScriptlyStore`;
  
  return {
    title: fallbackTitle.length > 60 ? fallbackTitle.substring(0, 57) + "..." : fallbackTitle,
    description: fallbackDescription.length > 160 ? fallbackDescription.substring(0, 157) + "..." : fallbackDescription,
    altText: fallbackAltText,
    faqs: [
      {
        question: "What is included with my purchase?",
        answer: "You will receive the complete source code files, comprehensive configuration guides, and lifetime free updates."
      },
      {
        question: "How is the product delivered?",
        answer: "Immediately after checkout, you will get instant access to securely download your files from your dashboard."
      },
      {
        question: "Are updates free?",
        answer: "Yes, you get lifetime access with free future updates and bug fixes for this product."
      }
    ]
  };
}
