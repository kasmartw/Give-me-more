"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditProduct() {
    const [valueName, setValueName] = useState('')
    const [valueDesc, setValueDesc] = useState('')
    const [valueImg, setValueImg] = useState('')
    const [valuePrice, setValuePrice] = useState('')
    const params = useParams();
    const { id } = params;
    const ids = id.map(i => `id=${i}`).join('&');
    let isOne = true;

    if (id.length === 1) {
        isOne = false;
    }
    console.log(id)
    console.log(ids)

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
                }


            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])

    async function editedProduct(ids, name, desc, img, price) {
        const priceFloat = parseFloat(price)

        if (typeof name !== "string" || typeof desc !== "string" || typeof img !== "string" || typeof priceFloat !== "float") return;
        try {
            const response = await fetch(`/api/products`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: ids,
                    name,
                    desc,
                    img,
                    price: priceFloat
                }),
            });
            if (!response.ok) {
                console.error("Error al actualizar. Revertiendo cambio.");
            }
            setRowSelection([])
        } catch (error) {
            console.error("Error de red al intentar actualizar el producto:", error);
        }
    }

    return (
        <div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium">
                    Nombre
                </label>
                <input
                    disabled={isOne}
                    value={valueName}
                    onChange={(e) => setValueName(e)}
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
                    disabled={isOne}
                    value={valueDesc}
                    onChange={(e) => setValueDesc(e)}
                    id="desc"
                    className="border rounded p-2"
                />
            </div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium">
                    Imagen (URL)
                </label>
                <input
                    disabled={isOne}
                    value={valueImg}
                    onChange={(e) => setValueImg(e)}
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
                    onChange={(e) => setValuePrice(e)}
                    id="price"
                    className="border rounded p-2"
                />
            </div>
            <button
                onClick={() => editedProduct(id, valueName, valueDesc, valueImg, valuePrice)}
                type="submit"
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
                Guardar
            </button>
        </div>
    );

}