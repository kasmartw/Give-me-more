/*"use client"

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
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
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useNotification } from "@/components/globalContextNotification"




export function DataTable({ columns, data, dataCurated, setDataCurated }) {
    const [sorting, setSorting] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
    })
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(
        (row) => row.original.id
    );
    const selectedOrders = table.getFilteredSelectedRowModel().rows.map(
        (row) => row.original
    );
    async function handleDeleteOrders() {
        try {
            const deletedIds = await Promise.all(
                selectedOrders.map(async (order) => {
                    const id = Number(order.id);
                    const resp = await fetch('/api/orders', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id }),
                    });
                    const data = await resp.json();
                    if (!resp.ok) {
                        throw new Error(data.message || 'Error al eliminar pedido');
                    }
                    return id;
                })
            );

            setNotification({ type: 'success', message: 'Pedidos eliminados correctamente.' });
            setDataCurated((prev) =>
                prev.filter((row) => !deletedIds.includes(Number(row.id)))
            );
            table.resetRowSelection();
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error(error);
            setNotification({ type: 'error', message: error.message || 'Error al eliminar pedidos.' });
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
                        <DropdownMenuItem
                            disabled={!selectedIds.length}
                            onSelect={(event) => {
                                event.preventDefault();
                                if (selectedIds.length) {
                                    setIsDeleteDialogOpen(true);
                                }
                            }}
                        >
                            Eliminar Pedido
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar pedidos seleccionados</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente los pedidos seleccionados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteOrders}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
        </div>
    )
}*/

"use client"

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
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
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useNotification } from "@/components/globalContextNotification"
import Link from "next/link"

export function DataTable({ columns, data, dataCurated, setDataCurated }) {
    const [sorting, setSorting] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isTabletOrLarger, setIsTabletOrLarger] = useState(undefined)
    const { notification, setNotification } = useNotification()

    useEffect(() => {
        const updateMatch = () => {
            setIsTabletOrLarger(window.innerWidth >= 768)
        }

        updateMatch()
        window.addEventListener('resize', updateMatch)
        return () => window.removeEventListener('resize', updateMatch)
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
    )
    const selectedOrders = table.getFilteredSelectedRowModel().rows.map(
        (row) => row.original
    )

    async function handleDeleteOrders() {
        try {
            const deletedIds = await Promise.all(
                selectedOrders.map(async (order) => {
                    const id = Number(order.id)
                    const resp = await fetch('/api/orders', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id }),
                    })
                    const data = await resp.json()
                    if (!resp.ok) {
                        throw new Error(data.message || 'Error al eliminar pedido')
                    }
                    return id
                })
            )

            setNotification({ type: 'success', message: 'Pedidos eliminados correctamente.' })
            setDataCurated((prev) =>
                prev.filter((row) => !deletedIds.includes(Number(row.id)))
            )
            table.resetRowSelection()
            setIsDeleteDialogOpen(false)
        } catch (error) {
            console.error(error)
            setNotification({ type: 'error', message: error.message || 'Error al eliminar pedidos.' })
        }
    }

    if (isTabletOrLarger === undefined) {
        return null
    }

    return isTabletOrLarger ? (
        // Vista de tabla para tablet y desktop
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
                        <DropdownMenuItem
                            disabled={!selectedIds.length}
                            onSelect={(event) => {
                                event.preventDefault()
                                if (selectedIds.length) {
                                    setIsDeleteDialogOpen(true)
                                }
                            }}
                        >
                            Eliminar Pedido
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar pedidos seleccionados</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente los pedidos seleccionados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteOrders}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
        </div>
    ) : (
        // Vista de tarjetas para móvil
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
                        <DropdownMenuItem
                            disabled={!selectedIds.length}
                            onSelect={(event) => {
                                event.preventDefault()
                                if (selectedIds.length) {
                                    setIsDeleteDialogOpen(true)
                                }
                            }}
                        >
                            Eliminar Pedido
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar pedidos seleccionados</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente los pedidos seleccionados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteOrders}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="space-y-3">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <div
                            key={row.id}
                            className={`bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow ${row.getIsSelected() ? 'ring-2 ring-blue-500' : ''
                                }`}
                        >
                            <OrderCardRow row={row} />
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

function OrderCardRow({ row }) {
    const cells = row.getVisibleCells()
    const findCell = (id) => cells.find((cell) => cell.column.id === id)

    const checkboxCell = findCell("select")
    const actionsCell = findCell("actions")
    const order = row.original
    const formattedDate = typeof order.date === "string" ? order.date.split("T")[0] : "Sin fecha"

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
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                        <Link href={`/admin/orders/client-details/${order.userId}`}>
                            {order.userId}
                        </Link>
                    </div>
                    <div className="text-xs text-gray-500">
                        <span className="font-medium text-gray-600">Fecha:</span>{" "}
                        <span className="text-gray-900">{formattedDate}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <div className="text-sm font-semibold text-gray-900">
                        <span className="font-medium text-gray-600">Total:</span>{" "}
                        <span className="text-gray-900">{order.total}</span>
                    </div>
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
