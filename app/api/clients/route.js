import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { fullName, phone, email } = await request.json();

        if (typeof email !== "string" || !email.trim()) {
            return NextResponse.json({ message: "Email inválido" }, { status: 400 });
        }

        if (typeof phone !== "string" || !phone.trim()) {
            return NextResponse.json({ message: "Número telefónico inválido" }, { status: 400 });
        }

        const safeEmail = email.trim().toLowerCase();
        const safeNumber = phone.trim();
        const safeName = (fullName ?? "").trim();

        const existingUser = await prisma.user.findUnique({
            where: { email: safeEmail },
            select: { id: true },
        });

        if (existingUser) {
            return NextResponse.json({ userId: existingUser.id }, { status: 200 });
        }

        const existingByNumber = await prisma.user.findUnique({
            where: { number: safeNumber },
            select: { id: true },
        });

        if (existingByNumber) {
            return NextResponse.json({ userId: existingByNumber.id }, { status: 200 });
        }

        const createdUser = await prisma.user.create({
            data: {
                name: safeName,
                number: safeNumber,
                email: safeEmail,
            },
            select: { id: true },
        });

        return NextResponse.json({ userId: createdUser.id }, { status: 201 });
    } catch (error) {
        console.error("POST /api/clients error", error);
        const message = error instanceof Error ? error.message : "Unexpected error";
        return NextResponse.json({ message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { userId, fullName, phone } = await request.json();

        if (typeof userId !== "number" || Number.isNaN(userId)) {
            return NextResponse.json({ message: "ID de usuario inválido" }, { status: 400 });
        }

        if (typeof phone !== "string" || !phone.trim()) {
            return NextResponse.json({ message: "Número telefónico inválido" }, { status: 400 });
        }

        const safeNumber = phone.trim();
        const safeName = (fullName ?? "").trim();

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        if (!currentUser) {
            return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
        }

        const duplicatedNumber = await prisma.user.findUnique({
            where: { number: safeNumber },
            select: { id: true },
        });

        if (duplicatedNumber && duplicatedNumber.id !== userId) {
            return NextResponse.json({ message: "El número telefónico ya está en uso" }, { status: 409 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: safeName,
                number: safeNumber,
            },
            select: { id: true },
        });

        return NextResponse.json({ userId: updatedUser.id }, { status: 200 });
    } catch (error) {
        console.error("PATCH /api/clients error", error);
        const message = error instanceof Error ? error.message : "Unexpected error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
