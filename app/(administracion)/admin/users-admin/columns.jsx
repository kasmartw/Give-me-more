"use client"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
        accessorKey: "username",
        header: () => <div className="text-left">Nombre de usuario</div>,
        cell: ({ row }) => {
            const username = row.getValue("username")
            return <div className="text-left font-medium">{username}</div>
        },
    },
    {
        accessorKey: "email",
        header: () => <div className="flex-center">Correo electrónico</div>,
        cell: ({ row }) => {
            const email = row.getValue("email")
            return <div className="flex-center font-medium">{email}</div>
        },
    },
    {
        accessorKey: "role",
        header: () => <div className="text-center">Rol</div>,
        cell: ({ row }) => {
            const role = row.getValue("role")
            return <div className="text-center font-medium">{role}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const actions = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Eliminar usuario</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]