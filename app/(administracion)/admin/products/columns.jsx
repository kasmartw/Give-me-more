"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useProduct } from "@/components/contextoGlobal"



export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    style={{ paddingLeft: 0 }}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const name = row.getValue("name")
            return <div className="text-left font-medium">{name}</div>
        },
    },
    {
        accessorKey: "img",
        header: () => <div className="text-center">Image</div>,
        cell: ({ row }) => {
            const img = row.getValue("img")
            return (
                <div className="flex justify-center">
                    <img src="/vista.jpg" alt="product" className="h-10 w-10 object-cover rounded-md" />
                </div>
            )
        },
    },
    {
        accessorKey: "price",
        header: () => <div className="text-center">Price</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-center font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "stock",
        header: () => <div className="text-center">Inventario</div>,
        cell: ({ row }) => {
            const stock = row.getValue("stock")
            return <div className="text-center font-medium">{stock}</div>
        }
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => {
            const { dataCurated, setDataCurated } = useProduct([{}]);
            const product = row.original

            const handleStatusChange = async () => {
                setDataCurated(
                    dataCurated.map((e) => {
                        if (product.id == e.id) {
                            return {
                                id: e.id,
                                status: !e.status
                            }
                        } else {
                            return e
                        }
                    })
                )

                try {
                    const response = await fetch(`/api/products`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: product.id, action: "status", status: !dataCurated.filter((e) => {
                                return e.id == product.id
                            })[0].status
                        }),
                    });

                    if (!response.ok) {
                        console.error("Error al actualizar. Revertiendo cambio.");
                    }
                } catch (error) {
                    console.error("Error de red al intentar actualizar el estado:", error);
                }
            }



            return (
                <div className="flex items-center justify-center gap-2">
                    <Switch checked={
                        dataCurated.filter((e) => {
                            return e.id == product.id
                        })[0].status
                    } onCheckedChange={handleStatusChange} />
                    <span className="capitalize w-14 text-left">{dataCurated.filter((e) => {
                        return e.id == product.id
                    })[0].status ? "Activo" : "Inactivo"}</span>

                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Link href={`/admin/products/product-overview${product.id}`}>Ver producto</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={`/admin/products/edit-product/${product.id}`}>Editar producto</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={`/admin/products/move-to-trash/${product.id}`}>Mover a la papelera</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }

]
