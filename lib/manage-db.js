import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

async function readProducts(from) {
    return await prisma.product.findMany({
        where: {
            visibility: from
        }
    });
}
async function readSomeProducts(id) {
    return await prisma.product.findUnique({
        where: {
            id,
        }
    })
}
async function createProduct(name, desc, img, price, status, stock, visibility) {
    await prisma.product.create({
        data: {
            name: name,
            desc: desc,
            img: img,
            price: price,
            status: status,
            stock: stock,
            visibility: visibility
        }
    })
}

async function MoveToTrash(name, desc, img, price, status, stock) {
    try {
        await prisma.trash.create({
            data: {
                name: name,
                desc: desc || '', // valor por defecto si viene vacío
                img: img,
                price: price,
                status: status || false, // valor por defecto
                stock: stock || 0 // valor por defecto
            }
        });
    } catch (error) {
        console.error('Error en MoveToTrash:', error);
        throw error; // re-lanzar el error para que lo capture el catch del endpoint
    }
}

async function updateProduct(id, name, desc, img, price, stock, visibility) {
    await prisma.product.update({
        where: {
            id: id
        },
        data: {
            name: name,
            desc: desc,
            img: img,
            price: price,
            stock: stock,
            visibility: visibility
        }
    })
}

async function updateProductStatus(id, status) {
    console.log(`Updating product ${id} to status ${status}`);
    const someProducts = await prisma.product.update({
        where: {
            id: id
        },
        data: { status: status }
    });
    console.log(`Updated product:`, someProducts);
}

async function deleteProduct(id) {
    const res = await prisma.product.delete({
        where: { id: id }
    })
    if (!res) {
        throw new Error('Error deleting product');
    } else {
        console.log('se borro')
    }

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

async function createUser(username, password, email, role) {
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
                email,
                role
            }
        })
    }

}
async function readAdminUsers() {
    try {
        const adminUsers = await prisma.admin.findMany();
        return adminUsers;
    } catch (error) {
        console.error(`Error fetching users: ${error}`);
    }
}
async function readSomeUser(id) {
    const user = await prisma.admin.findUnique({
        where: { id: id }
    })
    return user;
}
async function changePassword(id, password, username) {
    const hash = await hashPassword(password);
    await prisma.admin.update({
        where: {
            id: id,
            username: username
        },
        data: { password: hash }
    })
}

async function deleteUser(id) {
    const user = await prisma.admin.delete({
        where: { id: id }
    })

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

async function readOrder() {
    return await prisma.order.findMany();
}
async function readSomeOrder(id) {
    const data = await prisma.order.findUnique({
        where: {
            id: id
        },
        include: {
            orderItem: {
                include: {
                    product: true
                }
            },
            user: true,
        }
    })
    console.log(data)
    return data;
}

async function createOrder(id, userId, total, date, products) {
    return await prisma.order.create({
        data: {
            id,
            userId,
            total,
            date,
            orderItem: {
                create: products.map((product) => ({
                    quantity: product.quantity,
                    productId: product.productId ?? product.id,
                })),
            },
        },
        include: {
            orderItem: true,
        },
    })
}

async function updateOrder(id, userId, date, total, products) {
    return await prisma.$transaction(async (tx) => {
        await tx.orderItem.deleteMany({
            where: { orderId: id },
        });

        return await tx.order.update({
            where: {
                id: id
            },
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                date,
                total,
                orderItem: {
                    create: products.map(product => ({
                        quantity: product.quantity,
                        product: { 
                            connect: { 
                                id: product.productId 
                            } 
                        }
                    })),
                }
            },
            include: {
                orderItem: true
            }
        })
    });
}

async function deleteOrder(id) {
    return await prisma.$transaction(async (tx) => {
        await tx.orderItem.deleteMany({
            where: { orderId: id },
        });
        return await tx.order.delete({
            where: { id },
        });
    });
}

export {
    readProducts, createProduct, deleteProduct, createUser, getUserByName,
    deleteUser, readSomeUser, changePassword, readOrder, readSomeOrder, createOrder, updateOrder, deleteOrder,
    readAdminUsers, updateProductStatus, readSomeProducts, updateProduct, MoveToTrash
};
