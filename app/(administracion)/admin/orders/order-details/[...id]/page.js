'use client'
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

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
        <div className="flex flex-col gap-8">
            <FieldSet>
                <FieldLegend>Información del pedido</FieldLegend>
                <FieldDescription>
                    Consulta los datos generales del pedido seleccionado.
                </FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="order-client">ID del comprador</FieldLabel>
                        <Input
                            id="order-client"
                            autoComplete="off"
                            value={order.userId ?? ""}
                            disabled
                        />
                        <FieldDescription>
                            <Link href={`/admin/orders/client-details/${order.userId}`}>
                                Ver detalles del comprador
                            </Link>
                        </FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="order-date">Fecha de la orden</FieldLabel>
                        <Input
                            id="order-date"
                            autoComplete="off"
                            value={dateDay}
                            disabled
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="order-total">Total de la orden</FieldLabel>
                        <Input
                            id="order-total"
                            autoComplete="off"
                            value={order.total ?? ""}
                            disabled
                        />
                    </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSet>
                <FieldLegend>Productos de la orden</FieldLegend>
                <FieldDescription>
                    Detalle de los productos incluidos en la orden.
                </FieldDescription>
                <FieldGroup>
                    {order.products.map((product) => (
                        <Field key={product.product.id}>
                            <FieldLabel htmlFor={`product-name-${product.product.id}`}>
                                Nombre del producto
                            </FieldLabel>
                            <Input
                                id={`product-name-${product.product.id}`}
                                autoComplete="off"
                                value={product.product.name}
                                disabled
                            />
                            <FieldDescription>
                                Cantidad: {product.quantity}.{" "}
                                <Link href={`/admin/products/product-overview/${product.product.id}`}>
                                    Ver producto
                                </Link>
                            </FieldDescription>
                        </Field>
                    ))}
                </FieldGroup>
            </FieldSet>
        </div>
    )

}
