"use client"
import { useState, useEffect } from "react";
import { columns } from "./columns"
import { DataTable } from "./data-table"


export default function TrashProducts() {
    const [data, setData] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/products?from=trash", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })

                if (res.ok) {
                    const products = await res.json()
                    const ordenedProducts = products.sort((a, b) => a.name.localeCompare(b.name))
                    setData(ordenedProducts)
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
            <DataTable columns={columns} data={data} />
        </div>
    )

}