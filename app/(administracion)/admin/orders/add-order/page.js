
"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export default function AddOrderPage() {
  const [isDisabled, setIsDisabled] = useState(false)
  const [notification, setNotification] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
  })
  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [orderItems, setOrderItems] = useState([])
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false)
  const pickerRef = useRef(null)

  useEffect(() => {
    async function fetchProducts() {
      setIsLoadingProducts(true)
      try {
        const response = await fetch("/api/products?from=public", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) {
          throw new Error("Error al cargar productos")
        }
        const data = await response.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error(error)
        setNotification({ type: "error", message: "No se pudieron cargar los productos." })
        setProducts([])
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const term = searchTerm.trim().toLowerCase()
      if (!term) return true
      return product.name?.toLowerCase().includes(term)
    })
  }, [products, searchTerm])

  function handleSelectProduct(product) {
    setSelectedProduct(product)
    setSelectedQuantity(1)
    setIsProductPickerOpen(false)
  }

  function handleConfirmProduct() {
    if (!selectedProduct) return
    const quantityNumber = Number(selectedQuantity)
    if (!Number.isFinite(quantityNumber) || quantityNumber <= 0) {
      setNotification({ type: "error", message: "Ingrese una cantidad válida." })
      return
    }

    setOrderItems((prev) => {
      const existing = prev.find((item) => item.id === selectedProduct.id)
      if (existing) {
        return prev.map((item) =>
          item.id === selectedProduct.id ? { ...item, quantity: item.quantity + quantityNumber } : item
        )
      }
      return [
        ...prev,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: typeof selectedProduct.price === "number" ? selectedProduct.price : Number(selectedProduct.price) || 0,
          quantity: quantityNumber,
        },
      ]
    })

    setSelectedProduct(null)
    setSelectedQuantity(1)
    setSearchTerm("")
    setIsProductPickerOpen(false)
  }

  function handleRemoveItem(productId) {
    setOrderItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const orderTotal = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }, [orderItems])

  function handleCustomerChange(key) {
    return (event) => {
      setCustomerInfo((prev) => ({ ...prev, [key]: event.target.value }))
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsProductPickerOpen(false)
      }
    }

    if (isProductPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isProductPickerOpen])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!orderItems.length) {
      setNotification({ type: "error", message: "Agrega al menos un producto al pedido." })
      return
    }

    if (!customerInfo.fullName.trim()) {
      setNotification({ type: "error", message: "El nombre completo es obligatorio." })
      return
    }

    if (!customerInfo.phone.trim()) {
      setNotification({ type: "error", message: "El número telefónico es obligatorio." })
      return
    }

    if (!customerInfo.email.trim()) {
      setNotification({ type: "error", message: "El correo es obligatorio." })
      return
    }

    setIsDisabled(true)
    setNotification(null)

    try {
      const generatedOrderId = Math.floor(Math.random() * 1_000_000_000)
      const clientResponse = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: customerInfo.fullName,
          phone: customerInfo.phone,
          email: customerInfo.email,
        }),
      })

      const clientData = await clientResponse.json().catch(() => ({}))

      if (!clientResponse.ok) {
        throw new Error(clientData.message || "No se pudo registrar al cliente.")
      }
      const userId = clientData?.userId

      if (typeof userId !== "number") {
        throw new Error("No se pudo obtener el identificador del cliente.")
      }

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: generatedOrderId,
          userId,
          total: orderTotal,
          date: new Date().toISOString(),
          products: orderItems.map(({ id, quantity, price }) => ({
            productId: id,
            quantity,
            price,
          })),
        }),
      })

      if (!orderResponse.ok) {
        const data = await orderResponse.json().catch(() => ({}))
        throw new Error(data.message || "No se pudo crear el pedido.")
      }

      setNotification({ type: "success", message: "Pedido creado correctamente." })
      setCustomerInfo({
        fullName: "",
        phone: "",
        email: "",
      })
      setOrderItems([])
    } catch (error) {
      console.error(error)
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Error inesperado al crear el pedido.",
      })
    } finally {
      setIsDisabled(false)
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
      <form className="space-y-8" onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Datos personales</FieldLegend>
          <FieldDescription>Se contactará al cliente con la información proporcionada.</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullName">Nombre completo</FieldLabel>
              <Input
                id="fullName"
                autoComplete="off"
                placeholder="Juan Perez"
                value={customerInfo.fullName}
                onChange={handleCustomerChange("fullName")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="number">Numero telefonico</FieldLabel>
              <Input
                id="number"
                autoComplete="off"
                placeholder="54267483"
                value={customerInfo.phone}
                onChange={handleCustomerChange("phone")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Correo electronico</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="juan@gmail.com"
                value={customerInfo.email}
                onChange={handleCustomerChange("email")}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Selecione producto y cantidad</FieldLegend>
          <FieldDescription>
            Agregue los productos que mas le gusten.
          </FieldDescription>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>Productos del pedido</FieldLabel>
              <FieldContent className="gap-4">
                <div ref={pickerRef} className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-fit"
                    onClick={() => setIsProductPickerOpen((prev) => !prev)}
                  >
                    <PlusCircle className="mr-2 size-4" />
                    Agregar producto
                  </Button>
                  {isProductPickerOpen && (
                    <div className="bg-popover text-popover-foreground absolute z-50 mt-2 w-80 rounded-md border shadow-lg">
                      <div className="border-b p-3">
                        <p className="text-sm font-medium">Buscar producto</p>
                        <Input
                          className="mt-2"
                          autoFocus
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          placeholder="Escribe para filtrar..."
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto p-2">
                        {isLoadingProducts && (
                          <p className="px-2 py-1.5 text-sm text-muted-foreground">
                            Cargando productos...
                          </p>
                        )}
                        {!isLoadingProducts && filteredProducts.length === 0 && (
                          <p className="px-2 py-1.5 text-sm text-muted-foreground">
                            No encontramos resultados.
                          </p>
                        )}
                        {!isLoadingProducts && filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleSelectProduct(product)}
                            className="flex w-full flex-col rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                          >
                            <span className="font-medium">{product.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {typeof product.price === "number"
                                ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(product.price)
                                : "Sin precio"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedProduct && (
                  <div className="rounded-md border p-4">
                    <div className="mb-3">
                      <p className="font-semibold">{selectedProduct.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {typeof selectedProduct.stock === "number"
                          ? `Stock disponible: ${selectedProduct.stock}`
                          : "Stock no disponible"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                      <Field className="sm:flex-1">
                        <FieldLabel htmlFor="quantity">Cantidad</FieldLabel>
                        <Input
                          id="quantity"
                          type="number"
                          min={1}
                          value={selectedQuantity}
                          onChange={(event) => setSelectedQuantity(event.target.value)}
                        />
                      </Field>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct(null)
                            setSelectedQuantity(1)
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button type="button" onClick={handleConfirmProduct}>
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {orderItems.length === 0 && (
                    <FieldDescription>
                      Aún no has seleccionado productos.
                    </FieldDescription>
                  )}
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {item.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(item.price * item.quantity)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Quitar
                      </Button>
                    </div>
                  ))}
                </div>
              </FieldContent>
            </Field>
            <Field orientation="horizontal" className="items-center justify-between rounded-md border p-4">
              <FieldLabel className="text-sm">Total estimado</FieldLabel>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(orderTotal)}
              </p>
            </Field>
          </FieldGroup>
        </FieldSet>

        <Field orientation="horizontal">
          <Button type="submit" disabled={isDisabled}>
            {isDisabled ? <Spinner size="sm" /> : "Crear pedido"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setCustomerInfo({
                fullName: "",
                phone: "",
                email: "",
              })
              setOrderItems([])
              setSelectedProduct(null)
              setSelectedQuantity(1)
              setSearchTerm("")
            }}
          >
            Limpiar
          </Button>
        </Field>
      </form>
    </div>
  );
};
