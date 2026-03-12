export const generateCouponCode = (): string => {
    return "SAVE" + Math.random().toString(36).substring(2, 8).toUpperCase()
};

export const generateDiscountPercentage = (): number => {
    return Math.floor(Math.random() * 6) + 1;
};

export const getCouponExpires = (): Date => {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    return expiry;
};