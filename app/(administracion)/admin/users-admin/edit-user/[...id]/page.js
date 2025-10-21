"use client"
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditUser() {
    const params = useParams();
    const [res, setRes] = useState({})
    const [notification, setNotification] = useState(null);
    const [pass, setPass] = useState({
        newPass: "",
        confirmPass: ""
    })
    const { id } = params;

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/users/?id=${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })
                if (!res.ok) {
                    console.log("error en la peticion")

                } else {
                    const user = await res.json()
                    console.log(user)
                    setRes(user[0])
                }

                setPass({
                    newPass: "",
                    confirmPass: ""
                })
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])
    async function handleNewPass() {
        console.log(pass.newPass, pass.confirmPass, res.username)
        if (pass.newPass !== pass.confirmPass || pass.newPass.trim() === "" || pass.confirmPass.trim() === "") {
            alert("Las contraseñas no coinciden o están vacías")
            return
        }
        try {
            const response = await fetch(`/api/users`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: res.id, password: pass.newPass, username: res.username }),
            })
            if (response.ok) {
                setNotification({ message: 'Contraseña actualizada correctamente', type: 'success' })
                setPass({
                    newPass: "",
                    confirmPass: ""
                })
            } else {
                setNotification({ message: 'Error al actualizar la contraseña', type: 'error' })
            }
        } catch (error) {
            console.error(error)
            setNotification({ message: 'Error al actualizar la contraseña', type: 'error' })
        }
    }
    return (
        <div>
            <div className="flex flex-col">
                {notification && (
                    <div className={`p-4 mb-4 text-white rounded ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {notification.message}
                        <button onClick={() => setNotification(null)} className="ml-4 font-bold float-right">&times;</button>
                    </div>
                )}
                <h1 className="text-2xl font-bold mb-4">Usuario a editar: {res.username}</h1>
            </div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium">
                    Nueva contraseña:
                </label>
                <input type="text" className="border border-gray-300 rounded-md p-2 mb-4"
                    value={pass.newPass}
                    onChange={(e) => setPass({ ...pass, newPass: e.target.value })} />
                <label>
                    Confirmar contraseña:
                </label>
                <input type="text" className="border border-gray-300 rounded-md p-2 mb-4"
                    value={pass.confirmPass}
                    onChange={(e) => setPass({ ...pass, confirmPass: e.target.value })} />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={() => handleNewPass()}>
                    Cambiar contraseña
                </button>
            </div>
        </div>
    )

}