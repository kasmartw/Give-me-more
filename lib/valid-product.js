

async function isValidProduct(name, desc, img, price, status, stock) {
    if (
        (typeof name === 'string' && name.trim().length > 0 && name.length < 50) &&
        (typeof desc === 'string' && desc.length < 500) && // agregado validación de desc
        (typeof img === 'string' && img.trim().length > 0 && img.length < 80) &&
        (typeof price === 'number' && !isNaN(price) && price >= 0) &&
        (typeof status === 'boolean' && status !== null) &&
        (typeof stock === 'number' && !isNaN(stock) && stock >= 0)
    ) {
        return true;
    } else {
        return false;
    }
}
export { isValidProduct };