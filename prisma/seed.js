import { PrismaClient } from '../app/generated/prisma/index.js'

const prisma = new PrismaClient();

const productData = [
    { name: "Toy Car", desc: "A small toy car", img: "toycar.jpg", price: 10.99 },
    { name: "Doll", desc: "A beautiful doll", img: "doll.jpg", price: 15.99 },
    { name: "Puzzle", desc: "A 1000-piece puzzle", img: "puzzle.jpg", price: 12.99 },
];

export async function createProducts() {
    for (const p of productData) {
        await prisma.product.create({ data: p });
    }
}

async function main() {

    await createProducts();

    const alice = await prisma.user.upsert({
        where: { email: "alice@prisma.io" },
        update: {},
        create: {
            name: "Alice",
            email: "alice@prisma.io",
            number: "1234567890",
            order: {
                create: [
                    {
                        total: 100,
                        orderItem: {
                            create: [
                                {
                                    quantity: 2,
                                    productId: 1,
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    const bob = await prisma.user.upsert({
        where: { email: "bob@prisma.io" },
        update: {},
        create: {
            name: "Bob",
            email: "bob@prisma.io",
            number: "0987654321",
            order: {
                create: [
                    {
                        total: 200,
                        orderItem: {
                            create: [
                                {
                                    quantity: 1,
                                    productId: 2,
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });
}



main()
