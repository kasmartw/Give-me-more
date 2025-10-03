"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditProduct() {
    const [valueName, setValueName] = useState('')
    const [valueDesc, setValueDesc] = useState('')
    const [valueImg, setValueImg] = useState('')
    const [valuePrice, setValuePrice] = useState('')
    const [isDisabledButton, setIsDisabledButton] = useState(false)
    const [manyProducts, setManyProducts] = useState([])
    const [isHidden, setIsHidden] = useState(true)
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
                        setIsHidden(false);
                        setValueName(product[0].name)
                        setValueDesc(product[0].desc)
                        setValueImg(product[0].img)
                        setValuePrice(product[0].price)
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
    async function editedProduct() {
        if (manyProducts.length >= 1) {
            editManyProducts()
        } else {
            editOneProduct()
        }
    }
    async function editOneProduct() {
        console.log("se hizo click en un producto")
        setIsDisabledButton(true);
        const priceFloat = parseFloat(valuePrice)

        if (typeof valueName !== "string" || typeof valueDesc !== "string" || typeof valueImg !== "string" || typeof priceFloat !== "number") return;
        try {
            const response = await fetch(`/api/products?${ids}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: valueName,
                    desc: valueDesc,
                    img: valueImg,
                    price: priceFloat,
                    action: "edit"
                }),
            });
            if (!response.ok) {
                console.error("Error al actualizar. Revertiendo cambio.");
            }
            setIsDisabledButton(false);
            alert("Producto actualizado")
        } catch (error) {
            console.error("Error de red al intentar actualizar el producto:", error);
        }
    }
    async function editManyProducts() {
        console.log("se hizo click en varios productos")
        setIsDisabledButton(true);
        const priceFloat = parseFloat(valuePrice)

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
                        price: priceFloat,
                        action: "edit"
                    }),
                })
            );

            const responses = await Promise.all(updatePromises);


            const allSuccessful = responses.every(res => res.ok);

            if (!allSuccessful) {
                console.error("Error al actualizar algunos productos");
            }

            setIsDisabledButton(false);
            alert("Productos actualizados")
        } catch (error) {
            console.error("Error de red al intentar actualizar los productos:", error);
        }
    }

    return (
        <div>
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
                    value={valueName}
                    onChange={(e) => setValueName(e.target.value)}
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
                    value={valueDesc}
                    onChange={(e) => setValueDesc(e.target.value)}
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
                    value={valueImg}
                    onChange={(e) => setValueImg(e.target.value)}
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
                    value={valuePrice}
                    onChange={(e) => setValuePrice(e.target.value)}
                    id="price"
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