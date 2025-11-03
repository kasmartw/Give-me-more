"use client"
import { useState } from "react";
import { isValidProduct } from "@/lib/valid-product";
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
import { Spinner } from "@/components/ui/spinner"

export default function AddProductPage() {
    const [values, setValues] = useState({
        name: '',
        desc: '',
        img: '',
        price: '',
        stock: '',
        status: true
    })
    const [isDisabledButton, setIsDisabledButton] = useState(false)
    const [notification, setNotification] = useState(null);


    async function addNewProduct() {
        setIsDisabledButton(true);
        const priceFloat = parseFloat(values.price)
        const stockInt = parseInt(values.stock)
        if (isNaN(priceFloat) || isNaN(stockInt)) {
            alert("Precio o inventario inválido");
            setIsDisabledButton(false);
            return;
        } else if (!isValidProduct(values.name, values.desc, values.img, priceFloat)) {
            alert("Datos inválidos");
            setIsDisabledButton(false);
            return;
        }

        try {

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "create",
                    name: values.name,
                    desc: values.desc,
                    img: values.img,
                    price: priceFloat,
                    stock: stockInt,
                    status: values.status,
                    visibility: "public"
                }),
            });

            if (res.ok) {
                setValues({
                    name: '',
                    desc: '',
                    img: '',
                    price: '',
                    stock: '',
                    status: true
                });
                setIsDisabledButton(false);
                setNotification({ type: 'success', message: 'Producto agregado exitosamente.' });
            } else {
                setIsDisabledButton(false);
                setNotification({ type: 'error', message: 'Error al agregar el producto.' });
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Error de red al agregar el producto.' });
            setIsDisabledButton(false);
        }
    };

    async function saveNewProduct() {
        const priceFloat = parseFloat(values.price)
        const stockInt = parseInt(values.stock)
        let price = isNaN(priceFloat) ? 0 : priceFloat
        let stock = isNaN(stockInt) ? 0 : stockInt
        let name = values.name = true ? values.name : "Nombre del producto"
        let desc = values.desc = true ? values.desc : "Descripción del producto"
        let img = values.img = true ? values.img : "URL de la imagen del producto"
        setIsDisabledButton(true);

        try {

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "create",
                    name,
                    desc,
                    img,
                    price,
                    stock,
                    status: values.status,
                    visibility: "draft"
                }),
            });

            if (res.ok) {
                setValues({
                    name: '',
                    desc: '',
                    img: '',
                    price: '',
                    stock: '',
                    status: true
                });
                setIsDisabledButton(false);
                setNotification({ type: 'success', message: 'Producto guardado exitosamente.' });
            } else {
                setIsDisabledButton(false);
                setNotification({ type: 'error', message: 'Error al guardar el producto.' });
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Error de red al guardar el producto.' });
            setIsDisabledButton(false);
        }
    };

    return (
        <div className="space-y-8">
            {notification && (
                <div className={`p-4 mb-4 text-white rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.message}
                    <button onClick={() => setNotification(null)} className="ml-4 font-bold float-right">&times;</button>
                </div>
            )}
            <header className="space-y-2">
                <h1 className="text-2xl font-bold">Agregar producto</h1>
                <p className="text-sm text-muted-foreground">Completa la información y elige si deseas publicarlo o guardarlo como borrador.</p>
            </header>

            <FieldSet>
                <FieldLegend>Información básica</FieldLegend>
                <FieldDescription>Estos datos se mostrarán en la tienda.</FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="name">Nombre</FieldLabel>
                        <Input
                            id="name"
                            value={values.name}
                            onChange={(e) => setValues({ ...values, name: e.target.value })}
                            placeholder="Escribe el nombre del producto"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="desc">Descripción</FieldLabel>
                        <textarea
                            id="desc"
                            value={values.desc}
                            onChange={(e) => setValues({ ...values, desc: e.target.value })}
                            placeholder="Describe el producto brevemente"
                            className="min-h-32 rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSet>
                <FieldLegend>Detalles del producto</FieldLegend>
                <FieldGroup className="gap-6">
                    <Field>
                        <FieldLabel htmlFor="img">Imagen (URL)</FieldLabel>
                        <Input
                            id="img"
                            value={values.img}
                            onChange={(e) => setValues({ ...values, img: e.target.value })}
                            placeholder="https://..."
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="price">Precio</FieldLabel>
                        <Input
                            id="price"
                            value={values.price}
                            onChange={(e) => setValues({ ...values, price: e.target.value })}
                            placeholder="0.00"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="stock">Inventario</FieldLabel>
                        <Input
                            id="stock"
                            value={values.stock}
                            onChange={(e) => setValues({ ...values, stock: e.target.value })}
                            placeholder="0"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="status">Activo</FieldLabel>
                        <div className="flex items-center gap-2">
                            <input
                                id="status"
                                type="checkbox"
                                checked={values.status}
                                onChange={(e) => setValues({ ...values, status: e.target.checked })}
                            />
                            <span className="text-sm text-muted-foreground">Muestra el producto en la tienda</span>
                        </div>
                    </Field>
                </FieldGroup>
            </FieldSet>

            <div className="flex flex-wrap gap-3">
                <Button onClick={() => addNewProduct()} disabled={isDisabledButton}>
                    {isDisabledButton ? <Spinner /> : "Publicar"}
                </Button>
                <Button onClick={() => saveNewProduct()} type="button" variant="outline" disabled={isDisabledButton}>
                    Guardar como borrador
                </Button>
            </div>
        </div>
    );
}
