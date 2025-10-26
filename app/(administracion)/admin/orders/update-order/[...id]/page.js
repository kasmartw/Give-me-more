'use client'
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";


export default function EditOrder() {
    const [isDisabled, setIsDisabled] = useState(false)
    const [notification, setNotification] = useState(null)
    const [order, setOrder] = useState({
        userId: '',
        date: '',
        total: '',
        products: []
    })
    const params = useParams();
    const id = parseInt(params.id, 10);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/orders?id=${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })
                if (!res.ok) {
                    console.log("error en la peticion")
                } else {
                    const order = await res.json()
                    const products = order.orderItem.map((item) => {
                        return {
                            product: item.product,
                            quantity: item.quantity
                        }
                    })
                    setOrder({
                        userId: order.userId,
                        date: order.date,
                        total: order.total,
                        products: products
                    })
                }
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])
    console.log(order)


    const dateDay = order && order.date ? order.date.split("T")[0] : "Sin fecha";
    const handleQuantityChange = (productId, amount) => {
        setOrder(prevOrder => {
            const updatedProducts = prevOrder.products.map(p => {
                if (p.product.id === productId) {
                    const newQuantity = p.quantity + amount;
                    return { ...p, quantity: newQuantity > 0 ? newQuantity : 1 };
                }
                return p;
            });

            const newTotal = updatedProducts.reduce((acc, curr) => {
                // Convertimos el precio a número para asegurar que la multiplicación es numérica
                const price = parseFloat(curr.product.price) || 0;
                return acc + (price * curr.quantity);
            }, 0);

            // Redondeamos el total a 2 decimales para evitar errores de punto flotante
            const roundedTotal = Math.round(newTotal * 100) / 100;

            return { ...prevOrder, products: updatedProducts, total: roundedTotal };
        });
    };

    async function editedOrder() {
        setIsDisabled(true)
        try {
            const res = await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: id,
                    userId: order.userId,
                    date: order.date,
                    total: order.total,
                    products: order.products.map(p => ({
                        productId: p.product.id,
                        quantity: p.quantity

                    }))
                })
            })
            if (!res.ok) {
                setNotification({ type: 'error', message: 'Error al editar la orden' })
                setIsDisabled(false)
            } else {
                setIsDisabled(false)
                setNotification({ type: 'success', message: 'Orden editada correctamente' })
            }

        } catch (err) {
            console.error(err)
            setIsDisabled(false)
            setNotification({ type: 'error', message: 'Error al editar la orden' })
        }
    }
    return (
        <div>
            {notification && (
                <div className={`p-4 mb-4 text-white rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.message}
                    <button onClick={() => setNotification(null)} className="ml-4 font-bold float-right">&times;</button>
                </div>
            )}

            <div className="flex flex-col gap-4">

                <label className="font-medium">
                    <Link href={`/admin/orders/clients/${order.userId}`}>
                        Ver y editar detalles del comprador
                    </Link>
                </label>

                <label className="font-medium">
                    Fecha de la orden: {dateDay}
                </label>

                <label className="font-medium">
                    Total de la orden: {order.total}
                </label>

                <label className="font-medium">
                    Productos de la orden:
                </label>

                <div className="flex flex-col gap-4">
                    {
                        order.products.map((product) => (
                            <div key={product.product.id} className="flex flex-row items-center gap-4 border p-2 rounded">

                                <div className="flex flex-col">
                                    <span className="font-medium">Nombre: {product.product.name}</span>
                                    <Link href={`/admin/products/product-overview/${product.product.id}`} className="text-blue-600 underline text-sm">
                                        Ver producto
                                    </Link>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleQuantityChange(product.product.id, -1)} className="border px-2 py-1 rounded">-</button>
                                    <span className="font-medium">{product.quantity}</span>
                                    <button onClick={() => handleQuantityChange(product.product.id, 1)} className="border px-2 py-1 rounded">+</button>
                                </div>

                            </div>
                        ))
                    }
                </div>

                <button
                    disabled={isDisabled}
                    onClick={() => editedOrder()}
                    type="submit"
                    className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 self-start"
                >
                    Guardar
                </button>

            </div>
        </div>
    )

}