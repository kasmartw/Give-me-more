"use client"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

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
        accessorKey: "userId",
        header: () => <div className="text-left">ID del comprador</div>,
        cell: ({ row }) => {
            const userId = row.getValue("userId")
            return <div className="text-left font-medium">
                <Link href="#" >{userId}</Link>
            </div>
        },
    },
    {
        accessorKey: "total",
        header: () => <div className="flex-center">Total de la compra</div>,
        cell: ({ row }) => {
            const total = row.getValue("total")
            return <div className="flex-center font-medium">{total}</div>
        },
    },
    {
        accessorKey: "date",
        header: () => <div className="text-center">Fecha</div>,
        cell: ({ row }) => {
            const date = row.getValue("date")
            const dateDay = typeof date === "string"
                ? date.split("T")[0]
                : "Sin fecha";
            return <div className="text-center font-medium">{dateDay}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { }}>Eliminar compra</DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={`#`}>Actualizar compra</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={`#`}>Ver detalle de la compra</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]