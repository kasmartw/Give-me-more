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
                const res = await fetch("/api/products", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })

                if (res.ok) {
                    const products = await res.json()
                    console.log(products)
                    setData(products)
                    setDataCurated(
                        products.map((e) => {
                            return {
                                id: e.id,
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
    console.log(dataCurated)
    return (

        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} dataCurated={dataCurated} setDataCurated={setDataCurated} />
        </div>
    )
}
