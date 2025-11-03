"use client"
import { MoreVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useNotification } from "@/components/globalContextNotification"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/globalContextUsers"


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
            const { setNotification } = useNotification()
            const user = row.original
            const router = useRouter()
            const { setDataCurated } = useUser();
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
            async function handleDeleteUser(userId) {
                try {
                    const response = await fetch(`/api/users`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: userId }),
                    })
                    const result = await response.json();
                    if (response.ok) {
                        setNotification({ type: 'success', message: 'Usuario eliminado correctamente' })
                        setDataCurated((prev) => prev.filter((item) => item.id !== userId));
                        setIsDeleteDialogOpen(false);
                        if (result?.currentUserDeleted) {
                            router.push('/login');
                        }


                    } else {
                        setNotification({ type: 'error', message: result?.message || 'Error al eliminar el usuario' })
                    }
                } catch (error) {
                    setNotification({ type: 'error', message: 'Error al eliminar el usuario' })
                    console.error(error)
                }
            }

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onSelect={(event) => {
                                    event.preventDefault();
                                    setIsDeleteDialogOpen(true);
                                }}
                            >
                                Eliminar usuario
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={`/admin/users-admin/edit-user/${user.id}`}>Cambiar contraseña</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción eliminará permanentemente este administrador.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                    Eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )
        },
    },
]
