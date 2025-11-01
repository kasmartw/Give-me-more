"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useProduct } from "@/components/contextoGlobal"
import { useNotification } from "@/components/globalContextNotification"
import { useState } from "react"


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
        id: "actions",
        cell: ({ row }) => {
            const { dataCurated, setDataCurated } = useProduct();
            const { notification, setNotification } = useNotification();
            const product = row.original
            const [isDialogOpen, setIsDialogOpen] = useState(false);
            async function handleDeleteProduct() {
                try {
                    const response = await fetch(`/api/products?id=${product.id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        setNotification({ type: "error", message: "Error al eliminar el producto" })
                        console.log(`Error eliminando producto ${product.id}`);
                        return;
                    }
                    setNotification({ type: "success", message: "Producto eliminado con éxito" })
                    setDataCurated(dataCurated.filter((e) => e.id !== product.id))
                    await response.json();
                    setIsDialogOpen(false);
                } catch (error) {
                    setNotification({ type: "error", message: "Error al eliminar el producto" })
                    console.error("Error eliminando productos:", error);
                }
            }
            return (
                <>
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
                                <Link href={`/admin/products/edit-product/${product.id}`}>Terminar de editar</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={(event) => {
                                    event.preventDefault();
                                    setIsDialogOpen(true);
                                }}
                            >
                                Eliminar permanentemente
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu >
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción eliminará permanentemente el producto seleccionado.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteProduct}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )
        },
    }

]
