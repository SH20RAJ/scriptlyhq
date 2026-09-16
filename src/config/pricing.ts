/**
 * Canonical pricing, commission splits, and fee configurations for ScriptlyStore.
 * All financial splits across creator payouts, affiliate programs, and platform fees
 * must derive directly from this configuration.
 */

export const COMMISSION_RATES = {
  // Direct sale without affiliate referral
  directCreatorShare: 0.95,
  directPlatformShare: 0.05,

  // Sale referred by an approved affiliate
  affiliateCreatorShare: 0.65,
  affiliateShare: 0.30,
  affiliatePlatformShare: 0.05,
} as const;

export const PRICING_RULES = {
  // Minimum chargeable amount in USD cents ($1.00)
  minChargeableCents: 100,

  // Default affiliate commission percent if unspecified on product
  defaultAffiliateCommissionPercent: 30,

  // Automatic bulk discount: 20% off when cart subtotal >= $60.00 (6000 cents)
  bulkDiscountThresholdCents: 6000,
  bulkDiscountPercent: 20,

  // Additional discount percentage for buyers using an affiliate referral link (5%)
  referralBuyerDiscountPercent: 5,

  // Addon cost calculation (1/3rd of base price per addon)
  addonCostDivisor: 3,
} as const;
