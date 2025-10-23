async function validOrder(userId, total, date, products) {
    if (
        (typeof userId === 'number' && !isNaN(userId)) &&
        (typeof total === 'number' && !isNaN(total) && total >= 0) &&
        (Array.isArray(products) && products.length >= 1) &&
        (!isNaN(new Date(value)))
    ) {
        return true;
    } else {
        return false;
    }
}
export { validOrder };