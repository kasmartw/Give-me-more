"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

export default function EditProduct() {
    const [isDisabledButton, setIsDisabledButton] = useState(false)
    const [notification, setNotification] = useState(null)
    const [manyProducts, setManyProducts] = useState([])
    const [isHidden, setIsHidden] = useState(true)
    const [priceValue, setPriceValue] = useState('')
    const [stockValue, setStockValue] = useState('')
    const [priceAction, setPriceAction] = useState(null)
    const [priceRound, setPriceRound] = useState("no redondear")
    const [stockAction, setStockAction] = useState(null)
    const [values, setValues] = useState({
        name: '',
        desc: '',
        img: '',
        price: '',
        stock: ''
    })
    const params = useParams();
    const { id } = params;
    const ids = id.map(i => `id=${i}`).join('&');
    let isOne = true;

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/products/?${ids}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })
                if (!res.ok) {
                    console.log("error en la peticion")
                } else {
                    const product = await res.json()
                    console.log(product)
                    if (product.length == 1) {
                        setValues({
                            name: product[0].name,
                            desc: product[0].desc,
                            img: product[0].img,
                            price: product[0].price,
                            stock: product[0].stock,
                        })
                        setPriceValue('')
                        setStockValue('')
                        setPriceAction(null)
                        setPriceRound("no redondear")
                        setStockAction(null)
                        setIsHidden(false)
                        console.log("un producto")
                    } else {
                        setManyProducts(product)
                        setPriceValue('')
                        setStockValue('')
                        setPriceAction(null)
                        setPriceRound("no redondear")
                        setStockAction(null)
                        console.log("varios productos")

                    }
                }


            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])

    if (id.length === 1) {
        isOne = false;
    }
    function handlePriceChange(opcion = priceAction, roundType = priceRound, basePrice, inputValue) {
        const original = typeof basePrice !== "undefined" ? parseFloat(basePrice) : parseFloat(values.price);
        const amount = parseFloat(typeof inputValue !== "undefined" ? inputValue : priceValue);

        let result = Number.isNaN(original) ? 0 : original;
        const selectedAction = opcion ?? null;
        const selectedRound = roundType ?? "no redondear";

        if (selectedAction === "establecer valor exacto" && !Number.isNaN(amount)) {
            result = amount;
        } else if (!Number.isNaN(amount)) {
            switch (selectedAction) {
                case "incrementar por cantidad":
                    result = result + amount;
                    break;
                case "decrementar por cantidad":
                    result = result - amount;
                    break;
                case "incrementar por porcentaje":
                    result = result + result * (amount / 100);
                    break;
                case "decrementar por porcentaje":
                    result = result - result * (amount / 100);
                    break;
                default:
                    break;
            }
        }

        switch (selectedRound) {
            case "redondear a entero":
                result = Math.round(result);
                break;
            case "redondear a 2 decimales":
                result = parseFloat(result.toFixed(2));
                break;
            default:
                break;
        }

        if (!Number.isFinite(result)) {
            return Number.isNaN(original) ? 0 : original;
        }

        return result < 0 ? 0 : result;
    }

    function handleStockChange(opcion = stockAction, baseStock, inputValue) {
        const original = typeof baseStock !== "undefined" ? parseInt(baseStock) : parseInt(values.stock);
        const amount = parseInt(typeof inputValue !== "undefined" ? inputValue : stockValue);

        let result = Number.isNaN(original) ? 0 : original;
        const selectedAction = opcion ?? null;

        if (selectedAction === "establecer valor exacto" && !Number.isNaN(amount)) {
            result = amount;
        } else if (!Number.isNaN(amount)) {
            switch (selectedAction) {
                case "incrementar por cantidad":
                    result = result + amount;
                    break;
                case "decrementar por cantidad":
                    result = result - amount;
                    break;
                default:
                    break;
            }
        }

        if (!Number.isFinite(result)) {
            return Number.isNaN(original) ? 0 : original;
        }

        return result < 0 ? 0 : result;
    }
    const selectPriceAction = (action) => {
        setPriceAction(action);
        setPriceValue('');
        setPriceRound("no redondear");
    };

    const selectPriceRound = (round) => {
        setPriceRound(round);
    };

    const selectStockAction = (action) => {
        setStockAction(action);
        setStockValue('');
    };

    const formatCurrency = (value) => {
        const amount = Number.isFinite(value) ? value : 0;
        return new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(amount);
    };

    const previewProducts = manyProducts.length > 0
        ? manyProducts
        : (values.name || values.price || values.stock
            ? [{ id: id?.[0] ?? 'current', name: values.name || 'Producto', price: values.price, stock: values.stock }]
            : []);

    async function editedProduct() {
        console.log("se hizo click")
        if (typeof values.name !== "string" || typeof values.desc !== "string" || typeof values.img !== "string") {
            return
        }
        console.log("datos validos")

        if (manyProducts.length > 1) {
            editManyProducts()
            console.log("se hizo click en varios productos")
        } else {
            editOneProduct()
            console.log("se hizo click en un producto")
        }
    }
    async function editOneProduct() {
        console.log("se hizo click en un producto")
        setIsDisabledButton(true);

        try {
            const finalPrice = handlePriceChange(priceAction, priceRound, values.price, priceValue);
            const finalStock = handleStockChange(stockAction, values.stock, stockValue);
            const response = await fetch(`/api/products?${ids}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    desc: values.desc,
                    img: values.img,
                    price: finalPrice,
                    stock: finalStock,
                    visibility: "public",
                    action: "edit"
                }),
            });
            if (!response.ok) {
                setNotification({ type: "error", message: "Error al actualizar. Revertiendo cambio." })
            }
            setIsDisabledButton(false);
            setNotification({ type: "success", message: "Producto actualizado" })
        } catch (error) {
            console.error("Error de red al intentar actualizar el producto:", error);
            setNotification({ type: "error", message: "Error de red al intentar actualizar el producto" })
        }
    }
    async function editManyProducts() {
        console.log("se hizo click en varios productos")
        setIsDisabledButton(true);

        try {
            const updatePromises = manyProducts.map((product) => {
                const updatedPrice = handlePriceChange(priceAction, priceRound, product.price, priceValue);
                const updatedStock = handleStockChange(stockAction, product.stock, stockValue);

                return fetch(`/api/products?id=${product.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: product.name,
                        desc: product.desc,
                        img: product.img,
                        price: updatedPrice,
                        stock: updatedStock,
                        visibility: "public",
                        action: "edit"
                    }),
                });
            });
            const responses = await Promise.all(updatePromises);
            const allSuccessful = responses.every(res => res.ok);

            if (!allSuccessful) {
                console.error("Error al actualizar algunos productos");
                setNotification({ type: "error", message: "Error al actualizar algunos productos" })
            }
            setNotification({ type: "success", message: "Productos actualizados" })
            setIsDisabledButton(false);
        } catch (error) {
            console.error("Error de red al intentar actualizar los productos:", error);
            setNotification({ type: "error", message: "Error de red al intentar actualizar los productos" })
        }
    }

    return (
        <div className="space-y-8">
            {notification && (
                <div className={`p-4 mb-4 text-white rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.message}
                    <button onClick={() => setNotification(null)} className="ml-4 font-bold float-right">&times;</button>
                </div>
            )}

            <header className="space-y-2">
                <h1 className="text-2xl font-bold">Editar productos</h1>
                <p className="text-sm text-muted-foreground">
                    Ajusta los datos del producto seleccionado o aplica cambios masivos al precio e inventario.
                </p>
            </header>

            {manyProducts.length > 0 && (
                <FieldSet>
                    <FieldLegend>Productos seleccionados</FieldLegend>
                    <FieldDescription>Los ajustes de precio e inventario se aplicarán a cada uno de ellos.</FieldDescription>
                    <FieldGroup className="gap-4">
                        {manyProducts.map((product) => (
                            <Field key={product.id} className="rounded-md border p-4">
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-muted-foreground break-all">Imagen: {product.img}</p>
                                <p className="text-sm text-muted-foreground">Precio actual: {product.price}</p>
                            </Field>
                        ))}
                    </FieldGroup>
                </FieldSet>
            )}

            {!isHidden && (
                <FieldSet>
                    <FieldLegend>Información del producto</FieldLegend>
                    <FieldDescription>Estos campos solo están disponibles cuando editas un único producto.</FieldDescription>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Nombre</FieldLabel>
                            <Input
                                id="name"
                                value={values.name}
                                onChange={(e) => setValues({ ...values, name: e.target.value })}
                                disabled={isOne}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="desc">Descripción</FieldLabel>
                            <textarea
                                id="desc"
                                value={values.desc}
                                onChange={(e) => setValues({ ...values, desc: e.target.value })}
                                disabled={isOne}
                                className="min-h-32 rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="img">Imagen (URL)</FieldLabel>
                            <Input
                                id="img"
                                value={values.img}
                                onChange={(e) => setValues({ ...values, img: e.target.value })}
                                disabled={isOne}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
            )}

            <FieldSet>
                <FieldLegend>Ajustes de precio e inventario</FieldLegend>
                <FieldDescription>
                    Define el nuevo valor o aplica incrementos/descensos según la lógica configurada.
                </FieldDescription>
                <FieldGroup className="gap-6">
                    <Field>
                        <FieldLabel htmlFor="price">Precio</FieldLabel>
                        <div className="flex flex-col gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" type="button" className="justify-start">
                                        {priceAction ? `Ajuste: ${priceAction}` : "Elegir ajuste"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-64">
                                    <DropdownMenuLabel>Acción</DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectPriceAction("incrementar por cantidad") }}>Incrementar por cantidad</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectPriceAction("decrementar por cantidad") }}>Decrementar por cantidad</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectPriceAction("incrementar por porcentaje") }}>Incrementar por porcentaje</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectPriceAction("decrementar por porcentaje") }}>Decrementar por porcentaje</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectPriceAction("establecer valor exacto") }}>Establecer valor exacto</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {priceAction && (
                                <>
                                    <Input
                                        id="price-value"
                                        type="number"
                                        step="0.01"
                                        value={priceValue}
                                        onChange={(e) => setPriceValue(e.target.value)}
                                        placeholder={priceAction.includes("porcentaje")
                                            ? "Ingresa el porcentaje"
                                            : priceAction === "establecer valor exacto"
                                                ? "Ingresa el precio final"
                                                : "Ingresa el monto"}
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" type="button" className="justify-start">
                                                {priceRound === "no redondear" ? "Redondeo: No redondear" : `Redondeo: ${priceRound}`}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-64">
                                            <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectPriceRound("no redondear") }}>No redondear</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectPriceRound("redondear a entero") }}>Redondear a entero</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectPriceRound("redondear a 2 decimales") }}>Redondear a 2 decimales</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}

                            {priceAction && previewProducts.length > 0 && (
                                <div className="rounded-md border p-3 text-sm space-y-2">
                                    {previewProducts.map((product) => {
                                        const base = parseFloat(product.price ?? values.price);
                                        const baseValue = Number.isFinite(base) ? base : 0;
                                        const adjusted = handlePriceChange(priceAction, priceRound, baseValue, priceValue);

                                        return (
                                            <div key={`price-${product.id}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                <span className="font-medium">{product.name || `Producto ${product.id}`}</span>
                                                <span>
                                                    {formatCurrency(baseValue)} → <span className="font-semibold">{formatCurrency(adjusted)}</span>
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="stock">Inventario</FieldLabel>
                        <div className="flex flex-col gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" type="button" className="justify-start">
                                        {stockAction ? `Ajuste: ${stockAction}` : "Elegir ajuste"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-64">
                                    <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectStockAction("incrementar por cantidad") }}>Incrementar por cantidad</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectStockAction("decrementar por cantidad") }}>Decrementar por cantidad</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={(event) => { event.preventDefault(); selectStockAction("establecer valor exacto") }}>Establecer valor exacto</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {stockAction && (
                                <Input
                                    id="stock-value"
                                    type="number"
                                    step="1"
                                    value={stockValue}
                                    onChange={(e) => setStockValue(e.target.value)}
                                    placeholder={stockAction === "establecer valor exacto" ? "Ingresa el inventario final" : "Ingresa la cantidad"}
                                />
                            )}

                            {stockAction && previewProducts.length > 0 && (
                                <div className="rounded-md border p-3 text-sm space-y-2">
                                    {previewProducts.map((product) => {
                                        const base = parseInt(product.stock ?? values.stock);
                                        const baseValue = Number.isFinite(base) ? base : 0;
                                        const adjusted = handleStockChange(stockAction, baseValue, stockValue);

                                        return (
                                            <div key={`stock-${product.id}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                <span className="font-medium">{product.name || `Producto ${product.id}`}</span>
                                                <span>
                                                    {baseValue} → <span className="font-semibold">{adjusted}</span>
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </Field>
                </FieldGroup>
            </FieldSet>

            <div className="flex gap-3">
                <Button
                    type="button"
                    onClick={() => editedProduct()}
                    disabled={isDisabledButton}
                >
                    {isDisabledButton ? <Spinner /> : "Guardar"}
                </Button>
            </div>
        </div>
    );

}
