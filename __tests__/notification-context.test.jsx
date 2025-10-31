import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import NotificationProvider, { useNotification } from "@/components/globalContextNotification";
import { DataTable } from "@/app/(administracion)/admin/orders/data-table";

const columns = [
    {
        accessorKey: "id",
        header: () => <span>Identificador</span>,
        cell: ({ row }) => {
            const { setNotification } = useNotification();
            return (
                <button
                    type="button"
                    onClick={() =>
                        setNotification({
                            type: "success",
                            message: `Pedido ${row.original.id} notificado`,
                        })
                    }
                >
                    Notificar {row.original.id}
                </button>
            );
        },
    },
];

function Wrapper() {
    const [dataCurated, setDataCurated] = useState([{ id: 42 }]);

    return (
        <NotificationProvider>
            <DataTable
                columns={columns}
                data={dataCurated}
                dataCurated={dataCurated}
                setDataCurated={setDataCurated}
            />
        </NotificationProvider>
    );
}

describe("Notification global en tablas", () => {
    it("muestra y limpia la notificación cuando se actualiza el contexto", async () => {
        const user = userEvent.setup();
        render(<Wrapper />);

        await user.click(screen.getByRole("button", { name: /Notificar 42/i }));
        expect(screen.getByText("Pedido 42 notificado")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "×" }));
        expect(screen.queryByText("Pedido 42 notificado")).not.toBeInTheDocument();
    });
});
