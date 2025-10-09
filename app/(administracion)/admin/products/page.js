"use client"

import { useState, useEffect } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useProduct } from "@/components/contextoGlobal"

export default function ProductsPage() {
    const { dataCurated, setDataCurated } = useProduct()
    const [data, setData] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/products?from=public", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })

                if (res.ok) {
                    const products = await res.json()
                    const ordenedProducts = products.sort((a, b) => a.name.localeCompare(b.name))
                    setData(ordenedProducts)
                    setDataCurated(
                        products.map((e) => {
                            return {
                                id: e.id,
                                name: e.name,
                                desc: e.desc,
                                img: e.img,
                                price: e.price,
                                stock: e.stock,
                                status: e.status
                            }
                        })
                    )
                } else {
                    console.error("Error al cargar productos")
                }
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])
    return (

        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} dataCurated={dataCurated} setDataCurated={setDataCurated} />
        </div>
    )
}
