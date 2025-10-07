"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import { useUser } from "@/components/globalContextUsers"


export default function AdminPage() {
    const [data, setData] = useState([])
    const { dataCurated, setDataCurated } = useUser()

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/users", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })

                if (res.ok) {
                    const products = await res.json()
                    setData(products)
                    setDataCurated(products)
                    console.log("productos cargados")
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
