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
        header: () => <div className="text-center">Imagen</div>,
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
        header: () => <div className="text-center">Precio</div>,
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
            const status = row.getValue("status")
            return <div className="text-center font-medium">{status ? "Activo" : "Inactivo"}</div>
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
                        <DropdownMenuItem onClick={async () => {
                            try {
                                const response = await fetch(`/api/products?id=${product.id}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        name: product.name,
                                        img: product.img,
                                        price: product.price,
                                        stock: product.stock,
                                        status: product.status,
                                        visibility: "public",
                                        action: "move"
                                    }),
                                });

                                if (!response.ok) {
                                    console.log(`Error restaurando producto ${product.id}`);
                                }

                                return await response.json();
                            } catch (error) {
                                console.log(error)
                            }
                        }}
                        >Restaurar</DropdownMenuItem>
                        <DropdownMenuItem onClick={async () => {
                            try {
                                const response = await fetch(`/api/products?id=${product.id}`, {
                                    method: 'DELETE',
                                });

                                if (!response.ok) {
                                    console.log(`Error eliminando producto ${product.id}`);
                                }

                                return await response.json();
                            } catch (error) {
                                console.error("Error eliminando productos:", error);
                            }
                        }}
                        >Eliminar permanentemente</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu >
            )
        },
    }
]