"use client"

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

export function DataTable({ columns, data, dataCurated, setDataCurated }) {
    const [sorting, setSorting] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const [notification, setNotification] = useState(null);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        state: {
            sorting,
            rowSelection,
        },
    })
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(
        (row) => row.original.id
    );
    async function handleStatus(status) {
        const estadolocura = status ? true : false;
        const queryParams = selectedIds.map(id => `id=${id}`).join('&');
        setDataCurated(
            dataCurated.map((e) => {
                if (selectedIds.includes(e.id)) {
                    return {
                        id: e.id,
                        status: estadolocura
                    }
                } else {
                    return e
                }
            })
        )
        try {
            const response = await fetch(`/api/products?${queryParams}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: status, action: "status"
                }),
            });
            if (!response.ok) {
                console.error("Error al actualizar. Revertiendo cambio.");
            }
            setRowSelection([])
        } catch (error) {
            console.error("Error de red al intentar actualizar el estado:", error);
        }
    }
    async function handleMoveToTrash() {
        const data = dataCurated.filter((e) => selectedIds.includes(e.id));
        try {
            const postPromises = data.map((i) =>
                fetch(`/api/products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: i.name,
                        desc: i.desc,
                        img: i.img,
                        price: i.price,
                        status: i.status,
                        stock: i.stock,
                        action: "moveToTrash",
                    }),
                })
            );

            const postResponses = await Promise.all(postPromises);

            if (postResponses.every((res) => res.ok)) {
                const deletePromises = data.map((i) =>
                    fetch(`/api/products`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: i.id }),
                    })
                );

                const deleteResponses = await Promise.all(deletePromises);

                if (deleteResponses.every((res) => res.ok)) {
                    setNotification({ type: 'success', message: 'Productos movidos a la papelera correctamente.' });
                } else {
                    setNotification({ type: 'error', message: 'Error al eliminar productos después de moverlos.' });
                }
            } else {
                setNotification({ type: 'error', message: 'Error al mover productos a la papelera.' });
            }
            setRowSelection([])
        } catch (error) {
            setNotification({ type: 'error', message: 'Error en el proceso de mover a la papelera.' });
            console.error("Error in handleMoveToTrash:", error);
        }
    }

    return (
        <div>
            {notification && (
                <div className={`p-4 mb-4 text-white rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.message}
                    <button onClick={() => setNotification(null)} className="ml-4 font-bold float-right">&times;</button>
                </div>
            )}
            <div className="flex flex-row">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Acciones</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem disabled={!selectedIds.length}>
                            <Link href={`/admin/products/edit-product/${selectedIds.join('/')}`}>
                                Editar precio e inventario
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={!selectedIds.length} onClick={() => handleMoveToTrash()}>Mover a la papelera</DropdownMenuItem>
                        <DropdownMenuItem disabled={!selectedIds.length} onClick={() => handleStatus(true)}>Activar productos</DropdownMenuItem>
                        <DropdownMenuItem disabled={!selectedIds.length} onClick={() => handleStatus(false)}>Desactivar productos</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Siguiente
                </Button>
            </div>
        </div >
    )
}
