"use client";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const { id } = params;

    return (
        <div>
            <h1>Producto</h1>
            <p>Capturado: {Array.isArray(id) ? id.join(", ") : id}</p>
        </div>
    );
}
