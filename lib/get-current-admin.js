"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { readSomeUser } from "@/lib/manage-db";

export async function getCurrentAdmin() {
    const token = cookies().get("session")?.value;
    if (!token) {
        return null;
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        let userId = null;
        if (typeof payload.userId === "number") {
            userId = payload.userId;
        } else if (typeof payload.userId === "string") {
            const parsed = parseInt(payload.userId, 10);
            if (Number.isInteger(parsed)) {
                userId = parsed;
            }
        }

        if (!Number.isInteger(userId)) {
            return null;
        }

        const user = await readSomeUser(userId);
        if (!user) {
            return null;
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email ?? "",
        };
    } catch (error) {
        console.error("Error retrieving current admin:", error);
        return null;
    }
}
