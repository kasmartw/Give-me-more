"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function ProductOverviewPage() {
    const params = useParams();
    const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const [productData, setProductData] = useState({
        id: "",
        name: "",
        desc: "",
        price: "",
        stock: "",
        cost: "",
        status: "",
        visibility: "",
        img: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isImageOpen, setIsImageOpen] = useState(false);

    useEffect(() => {
        if (!productId) {
            setError("Identificador de producto no proporcionado.");
            setIsLoading(false);
            return;
        }

        async function fetchProduct() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/products?id=${productId}`);
                const payload = await response.json().catch(() => []);

                if (!response.ok) {
                    const message = Array.isArray(payload) ? "No se pudo obtener la información del producto." : payload?.message;
                    throw new Error(message || "No se pudo obtener la información del producto.");
                }

                const [product] = Array.isArray(payload) ? payload : [payload];

                if (!product) {
                    throw new Error("Producto no encontrado.");
                }

                setProductData({
                    id: product.id ?? "",
                    name: product.name ?? "",
                    desc: product.desc ?? "",
                    price: product.price != null ? String(product.price) : "",
                    stock: product.stock != null ? String(product.stock) : "",
                    cost: product.cost != null ? String(product.cost) : "",
                    status: typeof product.status === "boolean" ? (product.status ? "Activo" : "Inactivo") : "",
                    visibility: product.visibility ?? "",
                    img: product.img ?? "",
                });
            } catch (fetchError) {
                console.error("Error fetching product data:", fetchError);
                setProductData({
                    id: "",
                    name: "",
                    desc: "",
                    price: "",
                    stock: "",
                    status: "",
                    cost: "",
                    visibility: "",
                    img: "",
                });
                setError(fetchError instanceof Error ? fetchError.message : "Error inesperado al cargar el producto.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();
    }, [productId]);

    return (
        <FieldSet>
            <FieldLegend>Información del producto</FieldLegend>
            <FieldDescription>
                {isLoading
                    ? "Cargando información del producto..."
                    : error || "Consulta los detalles generales del producto seleccionado."}
            </FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="product-id">ID del producto</FieldLabel>
                    <Input
                        id="product-id"
                        autoComplete="off"
                        value={productData.id}
                        disabled
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="product-name">Nombre</FieldLabel>
                    <Input
                        id="product-name"
                        autoComplete="off"
                        value={productData.name}
                        disabled
                    />
                </Field>
            </FieldGroup>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="product-price">Precio</FieldLabel>
                    <Input
                        id="product-price"
                        autoComplete="off"
                        value={productData.price}
                        disabled
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="product-stock">Inventario</FieldLabel>
                    <Input
                        id="product-stock"
                        autoComplete="off"
                        value={productData.stock}
                        disabled
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="product-cost">Costo de envio</FieldLabel>
                    <Input
                        id="product-cost"
                        autoComplete="off"
                        value={productData.cost}
                        disabled
                    />
                </Field>
            </FieldGroup>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="product-status">Estado</FieldLabel>
                    <Input
                        id="product-status"
                        autoComplete="off"
                        value={productData.status}
                        disabled
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="product-visibility">Visibilidad</FieldLabel>
                    <Input
                        id="product-visibility"
                        autoComplete="off"
                        value={productData.visibility}
                        disabled
                    />
                </Field>
            </FieldGroup>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="product-img">Imagen (URL)</FieldLabel>
                    <Input
                        id="product-img"
                        autoComplete="off"
                        value={productData.img}
                        disabled
                    />
                    {productData.img && (
                        <FieldDescription>
                            <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto text-sm"
                                onClick={() => setIsImageOpen(true)}
                            >
                                Ver imagen
                            </Button>
                        </FieldDescription>
                    )}
                </Field>
            </FieldGroup>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="product-desc">Descripción</FieldLabel>
                    <textarea
                        id="product-desc"
                        value={productData.desc}
                        disabled
                        className="min-h-32 rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </Field>
            </FieldGroup>
            {isImageOpen && productData.img && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="relative w-full max-w-3xl rounded-md bg-white p-4 shadow-lg">
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-lg font-semibold text-gray-600 hover:text-gray-900"
                            onClick={() => setIsImageOpen(false)}
                            aria-label="Cerrar imagen"
                        >
                            ×
                        </button>
                        <div className="mt-6 flex justify-center">
                            <img
                                src={productData.img}
                                alt={`Imagen del producto ${productData.name || productData.id}`}
                                className="max-h-[70vh] w-auto rounded-md object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </FieldSet>
    );
}
