export interface Template {
  id: string;
  name: string;
  category: string;
  bestFor: string;
  price: string;
  numericPrice: number;
  type: 'Basic' | 'Premium' | 'Exclusive';
  previewImage: string;
  rating: number;
  reviews: number;
  description: string;
  includedSections: string[];
  whatIsIncluded: string[];
  technologies: string[];
  features: string[];
}

export interface InspirationStyle {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  startingPrice: string;
  priceRange: string;
  features: string[];
}

export interface PricingPlan {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "bento-saas",
    name: "Bento SaaS Launch Page",
    category: "SaaS",
    bestFor: "Tech Startups, SaaS Founders, & Creators",
    price: "₹3,999",
    numericPrice: 3999,
    type: "Premium",
    previewImage: "/images/bento_saas_preview.png",
    rating: 4.9,
    reviews: 32,
    description: "A gorgeous, dark-themed SaaS landing page built around a high-fidelity bento grid. Designed to showcase product screenshots, key metrics, user testimonials, and clear call-to-actions that convert traffic into trial signups.",
    includedSections: [
      "Dynamic Hero with product preview mockup",
      "Interactive feature Bento Grid",
      "Sleek metrics / stats display",
      "Customer testimonials slide",
      "Feature comparison matrix",
      "Visual pricing tiers with annual/monthly toggle",
      "FAQ section",
      "Final CTA banner"
    ],
    whatIsIncluded: [
      "Production-ready Next.js & React code",
      "Full Tailwind CSS configuration",
      "Lucide icon imports",
      "SEO friendly metadata settings",
      "Smooth scroll setups and glassmorphic card styles",
      "Detailed deployment walkthrough"
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS v4", "React 19"],
    features: ["Responsive layout", "Glassmorphic effects", "Modern grid structure", "Conversion optimized"]
  },
  {
    id: "premium-cafe",
    name: "Premium Café Landing Page",
    category: "Café",
    bestFor: "Cafés, Coffee Shops, & Artisanal Bakeries",
    price: "₹2,499",
    numericPrice: 2499,
    type: "Basic",
    previewImage: "/images/premium_cafe_preview.png",
    rating: 4.8,
    reviews: 19,
    description: "A warm, atmospheric landing page layout crafted for premium cafés and coffee brands. Showcase beautiful high-quality drink imagery, menu items, table booking requests, and Google Maps integration.",
    includedSections: [
      "Hero section with background coffee aesthetic",
      "Brand philosophy / story",
      "Artisanal drink & food menu with prices",
      "Visual highlights gallery",
      "WhatsApp & Google Maps links",
      "Table reservation request form"
    ],
    whatIsIncluded: [
      "Fully responsive static HTML/React template",
      "Easily editable menu components",
      "Integrated contact & reservation schema",
      "Optimized performance asset handling",
      "Basic SEO keywords"
    ],
    technologies: ["Next.js", "Tailwind CSS v4", "Lucide React"],
    features: ["Interactive menu", "Table reservations", "WhatsApp redirect", "Mobile-first booking"]
  },
  {
    id: "dental-clinic",
    name: "Dental Clinic Trust Page",
    category: "Clinic",
    bestFor: "Dentists, Clinics, & Healthcare Professionals",
    price: "₹4,999",
    numericPrice: 4999,
    type: "Premium",
    previewImage: "/images/dental_clinic_preview.png",
    rating: 4.9,
    reviews: 21,
    description: "A clean, reassuring clinic homepage designed to build trust with patients. Highlights services, doctor profiles, patient testimonials, and features a user-friendly appointment scheduling layout.",
    includedSections: [
      "Hero area with clear clinical value statement",
      "Core services list (Implants, Orthodontics, Cleaning)",
      "Reassuring trust badges & ADA qualifications",
      "Doctor profiles / therapist bios",
      "Patient reviews & success stories",
      "Interactive appointment scheduler mockup",
      "Google Maps and hours of operation"
    ],
    whatIsIncluded: [
      "High-performance medical theme codebase",
      "Preconfigured lead forms (ready for API integration)",
      "High-contrast accessible text components",
      "Google Maps integration helper",
      "One-click deploy configuration"
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS v4"],
    features: ["A11y friendly contrast", "Scheduler mockup", "Review sliders", "Trust indicators"]
  },
  {
    id: "fitness-coach",
    name: "Fitness Coach Sales Page",
    category: "Coach",
    bestFor: "Personal Trainers, Gyms, & Yoga Teachers",
    price: "₹1,999",
    numericPrice: 1999,
    type: "Basic",
    previewImage: "/images/fitness_coach_preview.png",
    rating: 4.7,
    reviews: 15,
    description: "A high-energy, bold sales landing page to convert visitors into fitness clients. Showcases training philosophy, student transformations, pricing plans, and an interactive signup form.",
    includedSections: [
      "Bold hero area with dynamic coach action photo",
      "Core results-driven training plans",
      "Student transformation sliders (Before/After)",
      "Membership & packages grid",
      "Lead generation contact form",
      "Social proof / Instagram grid layout"
    ],
    whatIsIncluded: [
      "Raw code templates optimized for performance",
      "Custom CSS glow styles for active items",
      "Lead collection form setup",
      "Easy branding change guides"
    ],
    technologies: ["Next.js", "Tailwind CSS v4"],
    features: ["High-impact color palette", "Transformation card presets", "Contact form hooks"]
  },
  {
    id: "luxury-salon",
    name: "Luxury Salon Landing Page",
    category: "Salon",
    bestFor: "Spas, Salons, & Beauty Therapists",
    price: "₹2,999",
    numericPrice: 2999,
    type: "Basic",
    previewImage: "/images/luxury_salon_preview.png",
    rating: 4.8,
    reviews: 28,
    description: "A sophisticated, elegant styling page designed for beauty studios. Soft neutral color tones, treatment descriptions, pricing sheets, therapist profiles, and online booking widgets.",
    includedSections: [
      "Elegant hero banner with warm luxury tones",
      "Service categories list (styling, colors, therapy)",
      "Interactive treatment list & pricing tables",
      "Stylist team highlights",
      "Online booking form with service selector",
      "Customer reviews widget"
    ],
    whatIsIncluded: [
      "Stunning responsive layout codebase",
      "Modular components for treatment edits",
      "Ready-to-integrate booking panel",
      "Preloaded elegant fonts configuration"
    ],
    technologies: ["Next.js", "Tailwind CSS v4", "React 19"],
    features: ["Elegance theme", "Booking selector", "Muted premium colors"]
  },
  {
    id: "event-registration",
    name: "Event Registration Page",
    category: "Event",
    bestFor: "Conferences, Seminars, & Tech Meetups",
    price: "₹1,499",
    numericPrice: 1499,
    type: "Basic",
    previewImage: "/images/event_registration_preview.png",
    rating: 4.9,
    reviews: 14,
    description: "A colorful, vibrant single page layout perfect for virtual or physical events. Features ticket countdown timers, event schedules, speaker profiles, and quick booking links.",
    includedSections: [
      "Vibrant background hero with countdown clock",
      "Event schedule timelines by hours",
      "Speaker slides with photo and bio",
      "Ticket tiers grid",
      "Quick buy form with payment gateway presets",
      "Sponsor showcase banner"
    ],
    whatIsIncluded: [
      "Interactive timer-driven frontend code",
      "Lucide-based timeline markers",
      "Dynamic tickets tier selectors",
      "Simple styling override sheets"
    ],
    technologies: ["Next.js", "Tailwind CSS v4", "TypeScript"],
    features: ["Vibrant gradients", "Countdown timer logic", "Visual timeline"]
  }
];

export const CATEGORIES = [
  "All",
  "SaaS",
  "Restaurant",
  "Café",
  "Clinic",
  "Dentist",
  "Salon",
  "Gym",
  "Coach",
  "Portfolio",
  "Event",
  "Real Estate",
  "Creator",
  "Local Business"
];

export const INSPIRATION_STYLES: InspirationStyle[] = [
  {
    id: "minimal-saas",
    name: "Minimal SaaS",
    description: "Clean layout, crisp typography, generous whitespace, subtle borders, and focused product previews.",
    previewImage: "/images/bento_saas_preview.png",
    category: "SaaS"
  },
  {
    id: "dark-premium",
    name: "Dark Premium",
    description: "Deep charcoal tones, glowing accents, neon borders, and glassmorphic panels for high-tech feeling.",
    previewImage: "/images/event_registration_preview.png",
    category: "SaaS"
  },
  {
    id: "luxury-restaurant",
    name: "Luxury Restaurant",
    description: "Moody dark backgrounds, warm golden text, elegant serif font headers, and large food close-ups.",
    previewImage: "/images/premium_cafe_preview.png",
    category: "Restaurant"
  },
  {
    id: "medical-trust",
    name: "Medical Trust",
    description: "Clean medical teal/blue accents, bright white panels, friendly team profiles, and patient reviews.",
    previewImage: "/images/dental_clinic_preview.png",
    category: "Clinic"
  },
  {
    id: "bold-startup",
    name: "Bold Startup",
    description: "Vibrant high-contrast background highlights, thick border lines, and huge hero typography.",
    previewImage: "/images/fitness_coach_preview.png",
    category: "Creator"
  },
  {
    id: "beauty-brand",
    name: "Beauty Brand",
    description: "Soft warm colors, organic elements, elegant script typography, and relaxed lifestyle grid cards.",
    previewImage: "/images/luxury_salon_preview.png",
    category: "Salon"
  }
];

export const SERVICES: ServiceCard[] = [
  {
    id: "buy-template",
    title: "Buy Ready-Made Template",
    description: "Browse our premium landing pages, purchase the source files instantly, and launch on your own infrastructure.",
    startingPrice: "₹999",
    priceRange: "₹999 – ₹6,999",
    features: [
      "Access to complete codebase",
      "Fully responsive & mobile-first design",
      "Preloaded assets & SVG illustrations",
      "Setup guide & configuration instructions"
    ]
  },
  {
    id: "customize-template",
    title: "Customize a Template",
    description: "Love a design but want to adjust details? Send us your brand styles and assets, and we'll execute the customization and deploy it for you.",
    startingPrice: "₹2,999",
    priceRange: "₹2,999 – ₹14,999",
    features: [
      "Brand logo, text, & color customization",
      "Forms & WhatsApp integration",
      "Google Maps embed & contact forms",
      "SEO title, description, & share cards",
      "Custom domain linking & hosting launch"
    ]
  },
  {
    id: "build-from-scratch",
    title: "Build From Scratch",
    description: "For brands requiring custom design and custom code. We map your specific user journeys from scratch to achieve peak conversion rates.",
    startingPrice: "₹14,999",
    priceRange: "₹14,999 – ₹60,000+",
    features: [
      "100% custom UI design mockups",
      "Conversion copy consultation",
      "Advanced custom interactions & animations",
      "Full API integrations (CRM, Booking, Stripe)",
      "Priority post-launch support"
    ]
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "template-only",
    title: "Template Only",
    price: "₹999+",
    description: "For builders who want beautiful starting layouts and handle the rest themselves.",
    features: [
      "Ready-made landing page",
      "Clean responsive design",
      "Source files or deployable code",
      "Basic usage guide"
    ]
  },
  {
    id: "customization",
    title: "Template Customization",
    price: "₹2,999+",
    description: "We take our template and tailor it to match your business branding and launch it.",
    features: [
      "Text and color changes",
      "Logo and image replacement",
      "WhatsApp/contact button",
      "Contact form setup",
      "Basic SEO integration",
      "Deployment support"
    ]
  },
  {
    id: "custom-build",
    title: "Custom Landing Page",
    price: "₹14,999+",
    description: "A premium bespoke landing page designed and built from scratch.",
    features: [
      "Custom design from scratch",
      "Conversion-focused copy layout",
      "Responsive development",
      "Forms and WhatsApp integration",
      "SEO setup",
      "Launch support"
    ]
  },
  {
    id: "monthly-support",
    title: "Monthly Support",
    price: "₹4,999/mo",
    description: "Keep your site fresh, fast, and constantly optimized for sales.",
    features: [
      "Website updates & copy edits",
      "Special offer additions",
      "New sections creation",
      "Speed & SEO optimizations",
      "Design enhancements"
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Can I buy only the template?",
    answer: "Yes! You can purchase any template stand-alone. You'll receive a link to download the complete clean codebase (Next.js/HTML) that you can host, customize, or hand over to your development team."
  },
  {
    question: "Can you customize the template for my business?",
    answer: "Absolutely. Most of our clients prefer this. You choose a template, purchase the 'Template Customization' package, and we will take care of replacing the text, adding your logo, switching brand colors, and making it fit your company perfectly."
  },
  {
    question: "Can you add WhatsApp and Google Maps?",
    answer: "Yes, we regularly add direct-to-WhatsApp messaging buttons, Google Maps direction overlays, and email contact forms to help local businesses capture incoming customer queries."
  },
  {
    question: "Can you connect my domain?",
    answer: "Yes, as part of our customization package or custom builds, we handle all the DNS configuration and launch your site on modern hosting platforms (Cloudflare, Vercel, Netlify) under your own custom domain (e.g. yourname.com) with SSL enabled."
  },
  {
    question: "Can you make a completely custom design?",
    answer: "Yes! If you need a fully custom layout, select the 'Build From Scratch' tier. We will start with empty canvas design mockups, consult on marketing copy, build custom animations, and deliver a uniquely premium site tailored to your goals."
  },
  {
    question: "How fast can you deliver?",
    answer: "Ready-made templates are available for instant download. Customizations typically take 2-4 days. Custom landing pages designed from scratch are completed within 5-10 business days."
  },
  {
    question: "Do I get the source code?",
    answer: "Yes, you own 100% of the files. We believe in transparency, meaning you get full developer access, source files, and are never locked into any proprietary platform or recurring license fee."
  },
  {
    question: "Can I resell the template to my client?",
    answer: "Yes, you can use our templates to build and launch websites for your clients. Each purchase licenses one end-product, making it highly cost-effective for freelance designers and boutique agencies."
  }
];
