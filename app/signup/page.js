"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle } from "@/components/ui/alert"


function FormSignup() {
    const [value, setValue] = useState({ name: "", pass: "", email: "" });
    const [error, setError] = useState("")
    function handleChange(e) {
        setValue({ ...value, [e.target.name]: e.target.value })
    }
    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: value.name, password: value.pass, id: e.target.id, email: value.email, role: "admin" })
        })
        const data = await res.json();

        if (!res.ok) {
            setError(data.message)
        }
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    Give me more
                </a>
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Ingrese a su cuenta</CardTitle>
                        <CardDescription>Ingrese su nombre de usuario y contraseña</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert className="border-none mb-3 -mt-3 bg-[#ecc8c5]" variant="destructive">
                                <AlertTitle className="text-center">{error}</AlertTitle>
                            </Alert>
                        )}
                        <form id="signupForm" onSubmit={(e) => handleSubmit(e)}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Nombre de usuario</Label>
                                    <Input
                                        className="w-3/4"
                                        id="username"
                                        type="text"
                                        name="name"
                                        value={value.name}
                                        onChange={(e) => handleChange(e)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Email</Label>
                                    <Input
                                        className="w-3/4"
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={value.email}
                                        onChange={(e) => handleChange(e)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Contraseña</Label>
                                    </div>
                                    <Input
                                        className="w-3/4"
                                        id="password"
                                        type="password"
                                        name="pass"
                                        value={value.pass}
                                        onChange={(e) => handleChange(e)}
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" form="signupForm" className="w-full">
                            Registrarse
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default FormSignup