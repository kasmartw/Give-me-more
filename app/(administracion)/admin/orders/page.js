"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import { useOrder } from "@/components/globalContextOrders"


export default function AdminPage() {
    const [data, setData] = useState([])
    const { dataCurated, setDataCurated } = useOrder()

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/orders", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })

                if (res.ok) {
                    const orders = await res.json()
                    setData(orders)
                    setDataCurated(orders.map((order) => {
                        return {
                            id: order.id,
                            userId: order.userId,
                            total: order.total,
                            date: order.date,
                            products: order.products
                        }
                    }))
                    console.log("Pedidos cargadas")
                } else {
                    console.error("Error al cargar pedidos")
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