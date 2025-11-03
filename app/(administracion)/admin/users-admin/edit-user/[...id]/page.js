"use client"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

export default function EditUserPage() {
    const params = useParams();
    const [user, setUser] = useState(null);
    const [pass, setPass] = useState({ newPass: "", confirmPass: "" });
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(`/api/users/?id=${userId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error("No se pudo obtener la información del usuario.");
                }

                const data = await response.json();
                setUser(data?.[0] ?? null);
            } catch (error) {
                console.error(error);
                setNotification({
                    type: "error",
                    message: "No se pudo cargar la información del usuario.",
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [userId]);

    async function handleNewPass() {
        if (!user) {
            return;
        }

        if (!pass.newPass.trim() || !pass.confirmPass.trim()) {
            setNotification({
                type: "error",
                message: "Las contraseñas no pueden estar vacías.",
            });
            return;
        }

        if (pass.newPass !== pass.confirmPass) {
            setNotification({
                type: "error",
                message: "Las contraseñas no coinciden.",
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/users`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: user.id,
                    password: pass.newPass,
                    username: user.username,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar la contraseña.");
            }

            setNotification({
                type: "success",
                message: "Contraseña actualizada correctamente.",
            });
            setPass({ newPass: "", confirmPass: "" });
        } catch (error) {
            console.error(error);
            setNotification({
                type: "error",
                message: "Error al actualizar la contraseña.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const isSubmitDisabled =
        !user ||
        !pass.newPass.trim() ||
        !pass.confirmPass.trim() ||
        isSubmitting;

    return (
        <div className="space-y-6">
            {notification && (
                <Alert
                    variant={
                        notification.type === "success" ? "default" : "destructive"
                    }
                >
                    <AlertDescription>{notification.message}</AlertDescription>
                </Alert>
            )}

            <FieldSet>
                <FieldLegend>Información del administrador</FieldLegend>
                <FieldDescription>
                    Consulta los datos actuales antes de actualizar la contraseña.
                </FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Usuario</FieldLabel>
                        <Input
                            value={user?.username ?? ""}
                            disabled
                            placeholder={isLoading ? "Cargando..." : "Nombre de usuario"}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Correo electrónico</FieldLabel>
                        <Input
                            value={user?.email ?? ""}
                            disabled
                            placeholder={isLoading ? "Cargando..." : "Correo electrónico"}
                        />
                    </Field>
                </FieldGroup>
            </FieldSet>

            <FieldSet>
                <FieldLegend>Nueva contraseña</FieldLegend>
                <FieldDescription>
                    Ingresa y confirma la contraseña temporal que compartirás con el
                    administrador.
                </FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="newPassword">Nueva contraseña</FieldLabel>
                        <Input
                            id="newPassword"
                            type="password"
                            value={pass.newPass}
                            onChange={(event) =>
                                setPass((prev) => ({
                                    ...prev,
                                    newPass: event.target.value,
                                }))
                            }
                            autoComplete="new-password"
                            placeholder="Ingresa la nueva contraseña"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">
                            Confirmar contraseña
                        </FieldLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={pass.confirmPass}
                            onChange={(event) =>
                                setPass((prev) => ({
                                    ...prev,
                                    confirmPass: event.target.value,
                                }))
                            }
                            autoComplete="new-password"
                            placeholder="Confirma la nueva contraseña"
                        />
                    </Field>
                </FieldGroup>
                <FieldDescription>
                    Ambas contraseñas deben coincidir para habilitar la actualización.
                </FieldDescription>
                <div>
                    <Button onClick={handleNewPass} disabled={isSubmitDisabled}>
                        {isSubmitting ? (
                            <>
                                <Spinner className="mr-2" />
                                Guardando...
                            </>
                        ) : (
                            "Cambiar contraseña"
                        )}
                    </Button>
                </div>
            </FieldSet>
        </div>
    );
}
