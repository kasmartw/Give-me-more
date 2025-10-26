'use client'
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function OrderDetails() {
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
    return (
        <div>
            <div className="flex flex-col gap-4">

                <label className="font-medium">
                    <Link href={`/admin/orders/clients/${order.userId}`}>
                        Ver detalles del comprador
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
                                <div className="flex items-center">
                                    <span className="font-medium"> Cantidad del producto: {product.quantity}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )

}