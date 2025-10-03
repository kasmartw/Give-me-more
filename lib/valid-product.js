

async function isValidProduct(name, desc, img, price) {
    if (
        (typeof name === 'string' && name.trim().length > 0 && name.length < 50) &&
        (typeof desc === 'string' && desc.length < 500) && // agregado validación de desc
        (typeof img === 'string' && img.trim().length > 0 && img.length < 80) &&
        (typeof price === 'number' && !isNaN(price) && price >= 0)
    ) {
        return true;
    } else {
        return false;
    }
}
export { isValidProduct };