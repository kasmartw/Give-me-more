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
            const { dataCurated, setDataCurated } = useProduct();
            const product = row.original


            const productFromState = dataCurated.find(p => p.id === product.id);


            if (!productFromState) {
                return null;
            }

            const currentStatus = productFromState.status;

            const handleStatusChange = async () => {

                setDataCurated(
                    dataCurated.map((p) => {
                        if (product.id === p.id) {

                            return { ...p, status: !p.status };
                        }
                        return p;
                    })
                );


                try {
                    const response = await fetch(`/api/products?id=${product.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: "status", status: !currentStatus }),
                    });

                    if (!response.ok) {

                        setDataCurated(dataCurated);
                    }
                } catch (error) {

                    console.error("Error de red:", error);
                    setDataCurated(dataCurated);
                }
            }

            return (
                <div className="flex items-center justify-center gap-2">
                    <Switch
                        checked={currentStatus}
                        onCheckedChange={handleStatusChange}
                    />
                    <span className="capitalize w-14 text-left">
                        {currentStatus ? "Activo" : "Inactivo"}
                    </span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { dataCurated, setDataCurated } = useProduct();
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
                                        visibility: "trash",
                                        action: "move"
                                    }),
                                });

                                if (!response.ok) {
                                    console.log(`Error moviendo producto ${product.id}`);
                                }
                                setDataCurated(dataCurated.filter((e) => e.id !== product.id))
                                return await response.json();
                            } catch (error) {
                                console.log(error)
                            }
                        }}>Mover a la papelera</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu >
            )
        },
    }

]
