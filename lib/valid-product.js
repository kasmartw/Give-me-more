function isValidProduct(name, desc, img, price, status, stock, cost) {
    const hasValidName =
        typeof name === "string" && name.trim().length > 0 && name.length < 50;
    const hasValidDescription =
        typeof desc === "string" && desc.length < 500;
    const hasValidImage =
        typeof img === "string" && img.trim().length > 0 && img.length < 200;
    const hasValidPrice = Number.isFinite(price) && price >= 0;
    const hasValidStatus = typeof status === "boolean";
    const hasValidStock = Number.isInteger(stock) && stock >= 0;
    const hasValidCost = Number.isFinite(cost) && cost >= 0;

    return (
        hasValidName &&
        hasValidDescription &&
        hasValidImage &&
        hasValidPrice &&
        hasValidStatus &&
        hasValidStock &&
        hasValidCost
    );
}

export { isValidProduct };
