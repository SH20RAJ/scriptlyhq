/**
 * Canonical licensing definitions and rules for ScriptlyStore.
 * Every legal, checkout, product page, and download surface derives from this model.
 */

export type LicenseTier = "personal" | "commercial_standard" | "commercial_extended";

export interface LicenseDefinition {
  id: LicenseTier;
  title: string;
  summary: string;
  allowed: string[];
  disallowed: string[];
  recommendedFor: string;
}

export const LICENSE_DEFINITIONS: Record<LicenseTier, LicenseDefinition> = {
  personal: {
    id: "personal",
    title: "Personal / Non-Commercial License",
    summary: "For individual learning, non-commercial pet projects, and personal hobby apps.",
    allowed: [
      "Use in 1 personal, non-revenue-generating application",
      "Private modifications and personal customizations",
      "Self-hosting on personal infrastructure",
    ],
    disallowed: [
      "No client work or commissioned deliverables",
      "No revenue generation, paywalls, or commercial deployment",
      "No redistribution, sublicensing, or resale of source files",
    ],
    recommendedFor: "Hobbyists, students, and personal experimentation",
  },
  commercial_standard: {
    id: "commercial_standard",
    title: "Commercial Standard License (Default)",
    summary: "Included with every standard marketplace purchase unless designated otherwise.",
    allowed: [
      "Deploy in unlimited commercial SaaS, client websites, and production apps",
      "Charge end-users subscriptions, fees, or usage charges",
      "Modify, rebrand, and adapt code for your business needs",
      "Deploy on commercial cloud hosting (Vercel, AWS, Cloudflare)",
    ],
    disallowed: [
      "Cannot resell or re-distribute the raw source code as a competing boilerplate or template",
      "Cannot make source files publicly available on open GitHub repositories",
    ],
    recommendedFor: "Founders, indie hackers, agencies, and freelance developers",
  },
  commercial_extended: {
    id: "commercial_extended",
    title: "Commercial Extended License",
    summary: "For enterprise teams, redistribution rights, and multi-team developer deployments.",
    allowed: [
      "All Commercial Standard privileges across enterprise organizations",
      "Internal distribution across multiple development teams and subsidiaries",
      "Priority triage from product authors",
    ],
    disallowed: [
      "Direct competing marketplace resale of standalone template files",
    ],
    recommendedFor: "Agencies deploying across multiple client accounts and larger engineering teams",
  },
};
