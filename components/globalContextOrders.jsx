"use client"

import { useState, useContext, createContext } from "react";
const OrderContext = createContext(undefined);

export default function OrderProvider({ children }) {
    const [dataCurated, setDataCurated] = useState([{}]);
    return (
        <OrderContext.Provider value={{ dataCurated, setDataCurated }}>
            {children}
        </OrderContext.Provider>
    )
}

export function useOrder() {
    const contextoBonito = useContext(OrderContext);
    if (!contextoBonito) throw new Error("Contexto undefined")
    return contextoBonito;
}