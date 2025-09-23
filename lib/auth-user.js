import "server-only"
import { singJWT, jwtVerify } from "jose";

const secretKey = process.env.SESSION_KEY
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {
    return new singJWT(payload)
}