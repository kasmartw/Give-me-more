"use client"

import { useState, useContext, createContext } from "react";
const UserContext = createContext(undefined);

export default function UserProvider({ children }) {
    const [dataCurated, setDataCurated] = useState([{}]);
    return (
        <UserContext.Provider value={{ dataCurated, setDataCurated }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const contextoBonito = useContext(UserContext);
    if (!contextoBonito) throw new Error("Contexto undefined")
    return contextoBonito;
}