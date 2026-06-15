export function getProductEffectivePrice(product: {
  price: number;
  isFree?: boolean;
  discountPercent?: number;
  promoStart?: Date | string | null;
  promoEnd?: Date | string | null;
}) {
  const price = product.price; // in paise
  const isFreeField = !!product.isFree;
  const discountPercentField = product.discountPercent || 0;
  
  // Verify promotion dates
  const now = new Date();
  let hasPromoInterval = false;
  let isPromoActive = true;

  if (product.promoStart || product.promoEnd) {
    hasPromoInterval = true;
    
    if (product.promoStart) {
      const start = new Date(product.promoStart);
      if (now < start) {
        isPromoActive = false;
      }
    }
    if (product.promoEnd) {
      const end = new Date(product.promoEnd);
      if (now > end) {
        isPromoActive = false;
      }
    }
  }

  // If promo is not active, return the standard original price
  if (hasPromoInterval && !isPromoActive) {
    return {
      price,
      effectivePrice: price,
      isFree: false,
      discountPercent: 0,
      hasDiscount: false,
      promoEnd: product.promoEnd ? new Date(product.promoEnd) : null,
      isPromoActive: false,
    };
  }

  // If promo is active (or permanently active)
  if (isFreeField) {
    return {
      price,
      effectivePrice: 0,
      isFree: true,
      discountPercent: 100,
      hasDiscount: true,
      promoEnd: product.promoEnd ? new Date(product.promoEnd) : null,
      isPromoActive: hasPromoInterval,
    };
  }

  if (discountPercentField > 0) {
    const discountAmount = Math.round(price * (discountPercentField / 100));
    const effectivePrice = Math.max(price - discountAmount, 0);
    return {
      price,
      effectivePrice,
      isFree: effectivePrice === 0,
      discountPercent: discountPercentField,
      hasDiscount: true,
      promoEnd: product.promoEnd ? new Date(product.promoEnd) : null,
      isPromoActive: hasPromoInterval,
    };
  }

  return {
    price,
    effectivePrice: price,
    isFree: false,
    discountPercent: 0,
    hasDiscount: false,
    promoEnd: null,
    isPromoActive: false,
  };
}
