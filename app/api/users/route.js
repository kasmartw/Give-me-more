import { NextResponse } from "next/server";
import { validUser } from "@/lib/valid-user";
import { createUser, getUserByName } from "@/lib/manage-db";
import { SignJWT } from 'jose'

export async function POST(request){
    try {
        const formData = await request.json();
        const { username, password, id } = formData;
        const validation = await validUser(username, password, id)

        switch (validation) {
            case "create":
                await createUser(username, password)
                return NextResponse.json({message: "Welcome, ", username}, {status: 201})
                break;
            case "login":
                const user = await getUserByName(username, password)
                if (!user) {
                    return NextResponse.json({message: 'User not found'}, { status: 404 });
                }
                
                const secret = new TextEncoder().encode(process.env.JWT_SECRET)
                const token = await new SignJWT({ userId: user.id })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setExpirationTime('3h')
                    .sign(secret)
                
                const response = NextResponse.json({message: "Welcome back, ", username}, {status: 200})

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
                return NextResponse.json({message: 'Invalid information data'}, { status: 400 });
        }
    } catch (error) {
        console.error('API Error:', error)
        const message = error instanceof Error ? error.message : 'Unexpected exception'
        return NextResponse.json({message}, { status: 500 })
    }
}

//bacend hecho por ahora, no se si en el futuro tenga que modificarlo o cambiar algo
// usar libreria zod para validar datos de entrada
// diseno layout y empezar con frontend