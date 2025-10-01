"use client"

import { useState, useContext, createContext } from "react";

const ProductContext = createContext(undefined);


export default function ProductProvider({ children }) {
    const [dataCurated, setDataCurated] = useState([{}]);
    return (
        <ProductContext.Provider value={{ dataCurated, setDataCurated }}>
            {children}
        </ProductContext.Provider>
    )
}

export function useProduct() {
    const contextoBonito = useContext(ProductContext);
    if (!contextoBonito) throw new Error("Contexto undefined")
    return contextoBonito;
}


