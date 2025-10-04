import { NextResponse } from "next/server";
import { validUser } from "@/lib/valid-user";
import { createUser, getUserByName, readAdminUsers } from "@/lib/manage-db";
import { SignJWT } from 'jose'
import rateLimiterMiddleware from "@/lib/ratelimiter";


export async function GET() {
    console.log("GET /api/users called");
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

//bacend hecho por ahora, no se si en el futuro tenga que modificarlo o cambiar algo
// usar libreria zod para validar datos de entrada

//creando las tablas de productos, usuarios y pedidos.
// crear pagina para un producto especifico