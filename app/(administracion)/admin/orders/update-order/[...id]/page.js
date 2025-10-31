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
import { Button } from "@/components/ui/button"


export default function EditOrder() {
    const [isDisabled, setIsDisabled] = useState(false)
    const [notification, setNotification] = useState(null)
    const [order, setOrder] = useState({
        userId: '',
        date: '',
        total: '',
        products: []
    })
    const [customer, setCustomer] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
    })
    const [initialCustomer, setInitialCustomer] = useState(null)
    const params = useParams();
    const id = parseInt(params.id, 10);

    useEffect(() => {
        if (!id || Number.isNaN(id)) return
        async function fetchData() {
            try {
                const res = await fetch(`/api/orders?id=${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })
                if (!res.ok) {
                    console.log("error en la peticion")
                } else {
                    const orderData = await res.json()
                    const products = (orderData.orderItem || []).map((item) => {
                        return {
                            product: item.product,
                            quantity: item.quantity
                        }
                    })
                    setOrder({
                        userId: orderData.userId,
                        date: orderData.date,
                        total: Number(orderData.total) || 0,
                        products: products
                    })
                    const userData = orderData.user ?? {}
                    const nameValue = (userData.name ?? '').trim()
                    const [firstName = '', ...remaining] = nameValue.split(' ')
                    const lastName = remaining.join(' ').trim()
                    const customerState = {
                        firstName: firstName,
                        lastName,
                        phone: String(userData.number ?? '').trim(),
                        email: String(userData.email ?? '').trim(),
                    }
                    setCustomer(customerState)
                    setInitialCustomer({ ...customerState })
                }
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [id])
    const handleCustomerChange = (field) => (event) => {
        const value = event.target.value
        setCustomer((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const dateDay = order && order.date ? order.date.split("T")[0] : "Sin fecha";
    const handleQuantityChange = (productId, amount) => {
        setOrder(prevOrder => {
            const updatedProducts = prevOrder.products.map(p => {
                if (p.product.id === productId) {
                    const newQuantity = p.quantity + amount;
                    return { ...p, quantity: newQuantity >= 0 ? newQuantity : 1 };
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
        const trimmedFirstName = customer.firstName.trim()
        const trimmedLastName = customer.lastName.trim()
        const fullName = `${trimmedFirstName} ${trimmedLastName}`.trim()
        const trimmedPhone = customer.phone.trim()

        if (!fullName) {
            setNotification({ type: 'error', message: 'El nombre es obligatorio.' })
            return
        }

        if (!trimmedPhone) {
            setNotification({ type: 'error', message: 'El número telefónico es obligatorio.' })
            return
        }

        setIsDisabled(true)
        try {
            const initialFullName = initialCustomer
                ? `${(initialCustomer.firstName ?? '').trim()} ${(initialCustomer.lastName ?? '').trim()}`.trim()
                : ''

            const customerHasChanges =
                !!initialCustomer && (
                    fullName !== initialFullName ||
                    trimmedPhone !== (initialCustomer.phone ?? '').trim()
                )

            if (customerHasChanges) {
                const clientRes = await fetch("/api/clients", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: order.userId,
                        fullName,
                        phone: trimmedPhone,
                    }),
                })

                const clientData = await clientRes.json().catch(() => ({}))
                if (!clientRes.ok) {
                    throw new Error(clientData.message || 'No se pudo actualizar el cliente.')
                }
            }

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
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || 'Error al editar la orden')
            }

            setCustomer((prev) => ({
                ...prev,
                firstName: trimmedFirstName,
                lastName: trimmedLastName,
                phone: trimmedPhone,
            }))

            setInitialCustomer({
                firstName: trimmedFirstName,
                lastName: trimmedLastName,
                phone: trimmedPhone,
                email: customer.email,
            })

            setNotification({ type: 'success', message: 'Orden editada correctamente' })
        } catch (err) {
            console.error(err)
            setNotification({ type: 'error', message: err instanceof Error ? err.message : 'Error al editar la orden' })
        } finally {
            setIsDisabled(false)
        }
    }
    const formattedTotal = new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(Number(order.total) || 0);

    return (
        <div className="space-y-8">
            {notification && (
                <div className={`p-4 mb-4 text-white rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.message}
                    <button onClick={() => setNotification(null)} className="ml-4 font-bold float-right">&times;</button>
                </div>
            )}

            <FieldSet>
                <FieldLegend>Informacion del comprador</FieldLegend>
                <FieldDescription>Se le contactara a traves de la informacion proporcionada</FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="name">Nombre</FieldLabel>
                        <Input
                            id="name"
                            autoComplete="off"
                            placeholder="Juan"
                            value={customer.firstName}
                            onChange={handleCustomerChange('firstName')}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="lastname">Apellidos</FieldLabel>
                        <Input
                            id="lastname"
                            autoComplete="off"
                            placeholder="Perez Gomez"
                            value={customer.lastName}
                            onChange={handleCustomerChange('lastName')}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="number">Numero telefonico</FieldLabel>
                        <Input
                            id="number"
                            autoComplete="off"
                            placeholder="54267483"
                            value={customer.phone}
                            onChange={handleCustomerChange('phone')}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="email">Correo electronico</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="off"
                            placeholder="juan@gmail.com"
                            value={customer.email}
                            disabled
                        />
                    </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSet>
                <FieldLegend>Detalles de la orden</FieldLegend>
                <FieldGroup className="gap-6">
                    <Field>
                        <FieldLabel>Fecha</FieldLabel>
                        <p className="text-sm text-muted-foreground">{dateDay}</p>
                    </Field>
                    <Field>
                        <FieldLabel>Total</FieldLabel>
                        <p className="text-xl font-semibold">{formattedTotal}</p>
                    </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSet>
                <FieldLegend>Productos de la orden</FieldLegend>
                <FieldDescription>Ajusta la cantidad para cada producto.</FieldDescription>
                <FieldGroup className="gap-4">
                    {order.products.length === 0 && (
                        <Field>
                            <FieldLabel className="text-sm text-muted-foreground">Sin productos asociados.</FieldLabel>
                        </Field>
                    )}
                    {order.products.map((product) => {
                        const subtotal = new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(
                            (Number(product.product.price) || 0) * product.quantity
                        );

                        return (
                            <Field key={product.product.id} className="rounded-lg border p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-medium text-base">{product.product.name}</p>
                                        <Link
                                            href={`/admin/products/product-overview/${product.product.id}`}
                                            className="text-sm text-primary underline"
                                        >
                                            Ver producto
                                        </Link>
                                        <p className="text-xs text-muted-foreground mt-2">Subtotal: {subtotal}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleQuantityChange(product.product.id, -1)}
                                        >
                                            -
                                        </Button>
                                        <span className="text-base font-semibold w-10 text-center">{product.quantity}</span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleQuantityChange(product.product.id, 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </Field>
                        );
                    })}
                </FieldGroup>
            </FieldSet>

            <div className="flex gap-3">
                <Button
                    disabled={isDisabled}
                    onClick={() => editedOrder()}
                    type="button"
                >
                    {isDisabled ? "Guardando..." : "Guardar"}
                </Button>
                <Button variant="outline" type="button" asChild>
                    <Link href="/admin/orders">Cancelar</Link>
                </Button>
            </div>
        </div>
    )

}
