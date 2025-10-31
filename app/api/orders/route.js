import { NextResponse } from "next/server";
import { validOrder } from "@/lib/valid-order";
import { readOrder, readSomeOrder, createOrder, updateOrder, deleteOrder } from "@/lib/manage-db"

export async function GET(request) {
    console.log("GET /api/orders called");
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("id");
    const idsInt = ids.map((id) => parseInt(id));
    if (idsInt.length === 0) {
        try {
            const data = await readOrder();
            if (data) {
                return NextResponse.json(data, { status: 200 });
            } else {
                return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
            }
        } catch (error) {
            console.error("API Error:", error);
            const message = error instanceof Error ? error.message : "Error inesperado";
            return NextResponse.json({ message }, { status: 500 });
        }
    } else if (idsInt.length === 1) {
        try {
            const data = await readSomeOrder(idsInt[0]);
            return NextResponse.json(data, { status: 200 });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected exception'
            return new Response(message, { status: 500 })
        }
    }
}

export async function POST(request) {
    console.log("POST /api/orders called");
    try {
        const { id, userId, total, date, products } = await request.json();
        if (validOrder(userId, total, date, products)) {
            const data = await createOrder(id, userId, total, date, products);
            return NextResponse.json(data, { status: 201 });
        } else {
            return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
        }

    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected exception";
        return new Response(message, { status: 500 });
    }
}

export async function PATCH(request) {
    console.log("PATCH /api/orders called");
    try {
        const { id, userId, date, total, products } = await request.json();
        console.log(id, userId, date, total, products)
        if (id && validOrder(userId, total, date, products)) {
            console.log("going to update")
            const data = await updateOrder(id, userId, date, total, products);
            console.log("updated")
            return NextResponse.json(data, { status: 200 });
        } else {
            return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
        }
    } catch (error) {
        console.error("API Error:", error);
        const message = error instanceof Error ? error.message : "Unexpected error";
        return new Response(message, { status: 500 });

    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();

        if (typeof id === "number") {
            console.log("going to delete")
            await deleteOrder(id);
            console.log("deleted")
            return NextResponse.json({ message: "Orders deleted" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected exception'

        return NextResponse.json({ message }, { status: 500 });
    }
}
