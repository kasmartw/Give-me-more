import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

async function readProducts() {
    return await prisma.product.findMany({
        cacheStrategy: { ttl: 0 }
    });
}

async function createProduct(name, desc, img, price) {
    await prisma.product.create({
        data: {
            name: name,
            desc: desc,
            img: img,
            price: price
        }
    })
}

async function updateProductStatus(id, status) {
    await prisma.product.update({
        where: {
            id: id
        },
        data: { status: status }
    })
}

async function deleteProduct(id) {
    await prisma.product.delete({
        where: { id: id }
    })
}

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt
        .hash(password, saltRounds)
        .then(hash => {

            return hash;
        })
        .catch(err => {
            console.error(err.message);
        });
}

function verifyPassword(password, hash) {
    return bcrypt
        .compare(password, hash)
        .then(res => {
            return res;
        })
        .catch(err => console.error(err.message));
}

async function createUser(username, password) {
    const getUser = await prisma.admin.findUnique({
        where: { username: username }
    })
    if (getUser) {
        throw new Error('El nombre de usuario ya existe')
    } else {
        const hash = await hashPassword(password);
        await prisma.admin.create({
            data: {
                username,
                password: hash,
            }
        })
    }

}

async function getUserByName(username, password) {
    const user = await prisma.admin.findUnique({
        where: { username: username }
    })
    if (!user) {
        console.log(`User not found`)
        return null;
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        console.log(`Invalid password`)
        return null;
    }

    return user;
}

function logout() {
    cookies().delete('session');
    return { message: "Logout successful" };
}

export { readProducts, createProduct, deleteProduct, createUser, getUserByName, logout, updateProductStatus };