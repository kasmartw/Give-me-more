"use client";
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
import { useNotification } from "@/components/globalContextNotification"


export function DataTable({ columns, data, dataCurated, setDataCurated }) {
    const [sorting, setSorting] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const { notification, setNotification } = useNotification();
    const table = useReactTable({
        data: dataCurated,
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
    });

    const selectedProduct = table.getFilteredSelectedRowModel().rows.map(
        (row) => row.original
    );
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(
        (row) => row.original.id
    );

    async function handleRestore() {
        const queryParams = selectedProduct.map(product => `id=${product.id}`).join('&');

        try {
            const promises = selectedProduct.map(async product => {
                const response = await fetch(`/api/products?${queryParams}`, {
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
                    const errorText = await response.text();
                    throw new Error(`Error restaurando producto ${product.id}: ${errorText}`);
                }

                return await response.json();
            });

            const results = await Promise.all(promises);

            if (results.every(res => res.message === "Product updated")) {
                setNotification({ type: 'success', message: 'Productos restaurados correctamente.' });
                setDataCurated(
                    dataCurated.filter((e) => !selectedIds.includes(e.id))
                );
            } else {
                setNotification({ type: 'error', message: 'Error al restaurar productos.' });
            }
            setRowSelection([]);

        } catch (error) {
            console.error("Error restaurando productos:", error);
            setNotification({ type: 'error', message: 'Error al restaurar productos.' });
        }
    }
    async function handleDelete() {
        const queryParams = selectedProduct.map(product => `id=${product.id}`).join('&');

        try {
            const promises = selectedProduct.map(async product => {
                const response = await fetch(`/api/products?${queryParams}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error eliminando producto ${product.id}: ${errorText}`);
                }

                return await response.json();
            });

            const results = await Promise.all(promises);

            if (results.every(res => res.message === "Products deleted")) {
                setNotification({ type: 'success', message: 'Productos eliminados correctamente.' });
                setDataCurated(
                    dataCurated.filter((e) => !selectedIds.includes(e.id))
                );
            } else {
                setNotification({ type: 'error', message: 'Error al eliminar productos.' });
            }
            setRowSelection([]);
        } catch (error) {
            console.error("Error eliminando productos:", error);
            setNotification({ type: 'error', message: 'Error al eliminar productos.' });
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
                        <DropdownMenuItem disabled={!selectedProduct.length} onClick={() => { handleRestore() }}>Restaurar</DropdownMenuItem>
                        <DropdownMenuItem disabled={!selectedProduct.length} onClick={() => { handleDelete() }}>Eliminar permanentemente</DropdownMenuItem>
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
                                    );
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
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
