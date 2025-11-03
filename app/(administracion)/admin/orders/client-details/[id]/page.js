"use client"
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function ClientDetailsPage() {
    const params = useParams();
    const [clientData, setClientData] = useState({
        name: "",
        phone: "",
        email: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!params?.id) {
            setError("Identificador de cliente no proporcionado.");
            setIsLoading(false);
            return;
        }

        async function fetchClientData() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/clients?id=${params.id}`);
                const payload = await response.json().catch(() => ({}));

                if (!response.ok) {
                    const message = payload?.message || "No se pudo obtener la información del cliente.";
                    throw new Error(message);
                }

                setClientData({
                    name: payload?.name ?? "",
                    phone: payload?.phone ?? "",
                    email: payload?.email ?? "",
                });
            } catch (fetchError) {
                console.error("Error fetching client data:", fetchError);
                setClientData({
                    name: "",
                    phone: "",
                    email: "",
                });
                setError(fetchError instanceof Error ? fetchError.message : "Error inesperado al cargar el cliente.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchClientData();
    }, [params?.id]);

    return (
        <FieldSet>
            <FieldLegend>Informacion del comprador</FieldLegend>
            <FieldDescription>
                {isLoading
                    ? "Cargando información del comprador..."
                    : error || "Se le contactara a traves de la informacion proporcionada"}
            </FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                    <Input
                        id="name"
                        autoComplete="off"
                        value={clientData.name}
                        disabled
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="number">Numero telefonico</FieldLabel>
                    <Input
                        id="number"
                        autoComplete="off"
                        value={clientData.phone}
                        disabled
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Correo electronico</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="off"
                        value={clientData.email}
                        disabled
                    />
                </Field>
            </FieldGroup>
        </FieldSet>
    )
}
