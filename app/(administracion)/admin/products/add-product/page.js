"use client"
import { useState } from "react";
import { isValidProduct } from "@/lib/valid-product";

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

    return (
        <div>
            {notification && (
                <div className={`p-4 mb-4 text-white rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.message}
                    <button onClick={() => setNotification(null)} className="ml-4 font-bold float-right">&times;</button>
                </div>
            )}
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold mb-4">Agregar producto</h1>
            </div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium">
                    Nombre
                </label>
                <input
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    type="text"
                    id="name"
                    className="border rounded p-2"
                />
            </div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium">
                    Descripción
                </label>
                <textarea
                    value={values.desc}
                    onChange={(e) => setValues({ ...values, desc: e.target.value })}
                    id="desc"
                    className="border rounded p-2"
                />
            </div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium">
                    Imagen (URL)
                </label>
                <input
                    value={values.img}
                    onChange={(e) => setValues({ ...values, img: e.target.value })}
                    type="text"
                    id="img"
                    className="border rounded p-2"
                />
            </div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium">
                    Precio
                </label>
                <input
                    value={values.price}
                    onChange={(e) => setValues({ ...values, price: e.target.value })}
                    id="price"
                    className="border rounded p-2"
                />
            </div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium">
                    Inventario
                </label>
                <input
                    value={values.stock}
                    onChange={(e) => setValues({ ...values, stock: e.target.value })}
                    id="stock"
                    className="border rounded p-2"
                />
            </div>
            <div>
                <label className="mr-2 font-medium">Activo</label>
                <input
                    type="checkbox"
                    checked={values.status}
                    onChange={(e) => setValues({ ...values, status: e.target.checked })}
                />
            </div>

            <button
                onClick={() => addNewProduct()}
                disabled={isDisabledButton}
                type="submit"
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
                Guardar
            </button>
        </div>
    );


}