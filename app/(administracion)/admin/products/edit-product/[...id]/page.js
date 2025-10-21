"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditProduct() {
    const [isDisabledButton, setIsDisabledButton] = useState(false)
    const [notification, setNotification] = useState(null)
    const [manyProducts, setManyProducts] = useState([])
    const [isHidden, setIsHidden] = useState(true)
    const [newPrice, setNewPrice] = useState(0)
    const [newStock, setNewStock] = useState(0)
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
                        setNewPrice(product[0].price)
                        setNewStock(product[0].stock)
                        setIsHidden(false)
                        console.log("un producto")
                    } else {
                        setManyProducts(product)
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
    function handlePriceChange(opcion, roundType) {
        let priceFloat = parseFloat(values.price);
        let newPriceInt = parseFloat(newPrice);
        switch (opcion) {
            case "incrementar por cantidad":
                setNewPrice(priceFloat + newPriceInt);
                break;
            case "decrementar por cantidad":
                setNewPrice(priceFloat - newPriceInt);
                break;
            case "incrementar por porcentaje":
                setNewPrice(priceFloat + (priceFloat * newPriceInt / 100));
                break;
            case "decrementar por porcentaje":
                setNewPrice(priceFloat - (priceFloat * newPriceInt / 100));
                break;
            default:
                break;
        }
        switch (roundType) {
            case "redondear a entero":
                setNewPrice(Math.round(newPrice));
                break;
            case "redondear a 2 decimales":
                setNewPrice(parseFloat(newPrice.toFixed(2)));
                break;
            case "no redondear":
                break;
            default:
                break;
        }

    }
    function handleStockChange(opcion) {
        let stockInt = parseInt(values.stock);
        let newStockInt = parseInt(newStock);
        switch (opcion) {
            case "incrementar por cantidad":
                setNewStock(stockInt + newStockInt);
                break;
            case "decrementar por cantidad":
                setNewStock(stockInt - newStockInt);
                break;
            default:
                break;
        }
    }
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
            const response = await fetch(`/api/products?${ids}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    desc: values.desc,
                    img: values.img,
                    price: newPrice ? newPrice : values.price,
                    stock: newStock ? newStock : values.stock,
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
            const updatePromises = manyProducts.map((product) =>
                fetch(`/api/products?id=${product.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: product.name,
                        desc: product.desc,
                        img: product.img,
                        price: newPrice ? newPrice : product.price,
                        stock: newStock ? newStock : product.stock,
                        visibility: "public",
                        action: "edit"
                    }),
                })
            );
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
        <div>
            {notification && (
                <div className={`p-4 mb-4 text-white rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.message}
                    <button onClick={() => setNotification(null)} className="ml-4 font-bold float-right">&times;</button>
                </div>
            )}
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold mb-4">Los productos a editar son:</h1>
                {manyProducts.map((i) => {
                    return (
                        <p key={i.id} className="mb-2">Name: {i.name}, Foto: {i.img}, Precio: {i.price}</p>
                    )
                })}
            </div>
            <div className="flex flex-col">
                <label hidden={isHidden} className="mb-1 font-medium">
                    Nombre
                </label>
                <input
                    hidden={isHidden}
                    disabled={isOne}
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    type="text"
                    id="name"
                    className="border rounded p-2"
                />
            </div>
            <div className="flex flex-col">
                <label hidden={isHidden} className="mb-1 font-medium">
                    Descripción
                </label>
                <textarea
                    hidden={isHidden}
                    disabled={isOne}
                    value={values.desc}
                    onChange={(e) => setValues({ ...values, desc: e.target.value })}
                    id="desc"
                    className="border rounded p-2"
                />
            </div>
            <div className="flex flex-col">
                <label hidden={isHidden} className="mb-1 font-medium">
                    Imagen (URL)
                </label>
                <input
                    hidden={isHidden}
                    disabled={isOne}
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
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    id="price"
                    className="border rounded p-2"
                />
            </div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium">
                    Inventario
                </label>
                <input
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    id="stock"
                    className="border rounded p-2"
                />
            </div>
            <button
                onClick={() => editedProduct()}
                disabled={isDisabledButton}
                type="submit"
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
                Guardar
            </button>
        </div>
    );

}