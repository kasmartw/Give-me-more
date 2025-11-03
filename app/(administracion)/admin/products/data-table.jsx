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
import { useState, useEffect } from "react"
import Link from "next/link"
import { useNotification } from "@/components/globalContextNotification"
import { MoreVertical } from "lucide-react"

export function DataTable({ columns, data, dataCurated, setDataCurated }) {
    const [sorting, setSorting] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const [isTabletOrLarger, setIsTabletOrLarger] = useState(undefined)
    const { notification, setNotification } = useNotification();
    useEffect(() => {
        const updateMatch = () => {
            setIsTabletOrLarger(window.innerWidth >= 768)
        }

        updateMatch()
        window.addEventListener("resize", updateMatch)
        return () => window.removeEventListener("resize", updateMatch)
    }, [])
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
    })
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(
        (row) => row.original.id
    );
    const selectedProduct = table.getFilteredSelectedRowModel().rows.map(
        (row) => row.original
    );

    async function handleStatus(status) {
        const estadolocura = status ? true : false;
        const queryParams = selectedIds.map(id => `id=${id}`).join('&');
        setDataCurated(
            dataCurated.map((e) => {
                if (selectedIds.includes(e.id)) {
                    return {
                        ...e,
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
        const queryParams = selectedIds.map(id => `id=${id}`).join('&');

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
                        visibility: "trash",
                        action: "move"
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Error restaurando producto ${product.id}`);
                }
                return await response.json();
            });
            const results = await Promise.all(promises);
            if (results.every(res => res.message === "Product updated")) {
                setNotification({ type: 'success', message: 'Productos movidos a la papelera correctamente.' });
                setDataCurated(dataCurated.filter((e) => !selectedIds.includes(e.id)));
            } else {
                setNotification({ type: 'error', message: 'Error al mover productos a la papelera.' });
            }
            setDataCurated(
                dataCurated.filter((e) => !selectedIds.includes(e.id))
            );
            setRowSelection([]);
        } catch (error) {
            console.log("Error de red al intentar mover a la papelera:", error);
            setNotification({ type: 'error', message: 'Error al mover productos a la papelera.' })
        }
    }

    if (isTabletOrLarger === undefined) {
        return null
    }

    return isTabletOrLarger ? (
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
    ) : (
        <div>
            {notification && (
                <div className={`p-4 mb-4 text-white rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.message}
                    <button onClick={() => setNotification(null)} className="ml-4 font-bold float-right">&times;</button>
                </div>
            )}

            <div className="flex flex-col gap-3 mb-4">
                <div className="text-muted-foreground text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} seleccionados
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">Acciones</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
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

            <div className="space-y-3">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <div
                            key={row.id}
                            className={`bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow ${row.getIsSelected() ? 'ring-2 ring-blue-500' : ''
                                }`}
                        >
                            <ProductCardRow
                                row={row}
                            />
                        </div>
                    ))
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                        No hay resultados.
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="flex-1"
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="flex-1"
                >
                    Siguiente
                </Button>
            </div>
        </div>
    )
}

function ProductCardRow({ row }) {
    const cells = row.getVisibleCells()
    const checkboxCell = cells.find((cell) => cell.column.id === "select")
    const nameCell = cells.find((cell) => cell.column.id === "name")
    const imgCell = cells.find((cell) => cell.column.id === "img")
    const priceCell = cells.find((cell) => cell.column.id === "price")
    const stockCell = cells.find((cell) => cell.column.id === "stock")
    const statusCell = cells.find((cell) => cell.column.id === "status")
    const actionsCell = cells.find((cell) => cell.column.id === "actions")

    return (
        <div className="flex w-full items-center gap-3">
            <div className="flex-shrink-0">
                {checkboxCell &&
                    flexRender(
                        checkboxCell.column.columnDef.cell,
                        checkboxCell.getContext()
                    )}
            </div>

            <div className="flex flex-1 items-center gap-3">
                <div className="min-w-0 flex-1">
                    {nameCell && (
                        <div className="text-sm font-medium text-gray-900">
                            {flexRender(nameCell.column.columnDef.cell, nameCell.getContext())}
                        </div>
                    )}
                    {stockCell && (
                        <div className="text-xs text-gray-500 flex gap-1">
                            <span>Inventario:</span>
                            <span className="text-gray-900">
                                {flexRender(stockCell.column.columnDef.cell, stockCell.getContext())}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 flex items-center justify-center mx-auto">
                    {imgCell &&
                        flexRender(
                            imgCell.column.columnDef.cell,
                            imgCell.getContext()
                        )}
                </div>

                <div className="flex flex-col items-end gap-1">
                    {priceCell && (
                        <div className="text-sm font-semibold text-gray-900">
                            {flexRender(priceCell.column.columnDef.cell, priceCell.getContext())}
                        </div>
                    )}
                    {statusCell && (
                        <div>
                            {flexRender(
                                statusCell.column.columnDef.cell,
                                statusCell.getContext()
                            )}
                        </div>
                    )}
                </div>
            </div>

            {actionsCell && (
                <div className="flex-shrink-0">
                    {flexRender(
                        actionsCell.column.columnDef.cell,
                        actionsCell.getContext()
                    )}
                </div>
            )}
        </div>
    )
}
