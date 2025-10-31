"use client"

import React, { useState, useContext, createContext } from "react";
const NotificationContext = createContext(undefined);

export default function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);
    return (
        <NotificationContext.Provider value={{ notification, setNotification }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotification() {
    const contextoBonito = useContext(NotificationContext);
    if (!contextoBonito) throw new Error("Contexto undefined")
    return contextoBonito;
}
