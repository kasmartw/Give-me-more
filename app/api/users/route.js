import { NextResponse } from "next/server";
import { validUser } from "@/lib/valid-user";
import { createUser, getUserByName, readAdminUsers, deleteUser, readSomeUser, changePassword } from "@/lib/manage-db";
import { SignJWT } from 'jose'
import rateLimiterMiddleware from "@/lib/ratelimiter";


export async function GET(request) {
    console.log("GET /api/users called");
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("id")
    console.log(ids);
    const idsInt = ids.map((id) => parseInt(id))
    if (idsInt.length == 0) {
        try {
            const data = await readAdminUsers();
            if (data) {
                return NextResponse.json(data, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
            }
        } catch (error) {
            console.error('API Error:', error);
            const message = error instanceof Error ? error.message : 'Error inesperado';
            return NextResponse.json({ message }, { status: 500 });
        }
    } else {
        try {
            const someUser = await Promise.all(idsInt.map(id => readSomeUser(id)));
            return NextResponse.json(someUser, { status: 200 });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected exception'
            return new Response(message, { status: 500 })
        }
    }
}

export async function POST(request) {
    console.log("POST /api/users called");
    try {
        const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";
        const isRateLimited = await rateLimiterMiddleware(ip);
        if (isRateLimited) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }
        const formData = await request.json();
        const { username, password, id, email, role } = formData;
        const validation = await validUser(username, password, id)

        switch (validation) {
            case "signup":
                await createUser(username, password, email, role)
                return NextResponse.json({ message: "Welcome, ", username }, { status: 201 })
                break;
            case "login":
                const user = await getUserByName(username, password)
                if (!user) {
                    return NextResponse.json({ message: 'Usuario o contrasena incorrecta' }, { status: 400 });
                }

                const secret = new TextEncoder().encode(process.env.JWT_SECRET)
                const token = await new SignJWT({ userId: user.id })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setExpirationTime('3h')
                    .sign(secret)

                const response = NextResponse.json({ message: "Welcome back, ", username }, { status: 200 })

                response.cookies.set('session', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 3 * 60 * 60,
                })
                return response
                break;
            default:
                return NextResponse.json({ message: 'Data invalida' }, { status: 400 });
        }
    } catch (error) {
        console.error('API Error:', error)
        const message = error instanceof Error ? error.message : 'Error inesperado'
        return NextResponse.json({ message }, { status: 500 })
    }

}

export async function PATCH(request) {
    console.log("PATCH /api/users called");
    const { id, password, username } = await request.json();
    const idInt = parseInt(id)
    console.log(id, password, username);
    try {
        if (typeof idInt === 'number' && typeof password === 'string' && typeof username === 'string') {
            console.log("ahora vamos a db")
            const newPass = await changePassword(idInt, password, username);
            return NextResponse.json({ status: 200 });
        } else {
            return new Response({ status: 400 });

        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected exception'
        return new Response(message, { status: 500 });
    }

}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const idInt = parseInt(id)
        console.log(id);
        if (typeof idInt === 'number') {
            console.log(`Deleting user with id: ${idInt}`);
            await deleteUser(idInt);
            return NextResponse.json({ message: "User deleted" }, { status: 200 });
        } else {
            return new Response({ status: 400 });
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected exception'

        return new Response(message, { status: 500 });
    }
}

// usar libreria zod para validar datos de entrada
