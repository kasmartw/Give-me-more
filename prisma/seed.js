import { PrismaClient } from '../app/generated/prisma/index.js'

const prisma = new PrismaClient()

// ===== LIMPIADOR DE STRINGS =====
function cleanString(str) {
    if (typeof str !== 'string') return str
    return str.replace(/\0/g, '').replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '')
}

function cleanProductData(product) {
    return {
        name: cleanString(product.name),
        desc: product.desc ? cleanString(product.desc) : null,
        img: cleanString(product.img),
        price: product.price,
        status: product.status,
        stock: product.stock,
        visibility: cleanString(product.visibility)
    }
}

// ===== DATA DE PRODUCTOS =====
const productData = [
    { name: "Muneca", desc: "for girls", img: "muneca.jpg", price: 18.50, status: true, stock: 21, visibility: "public" },
    { name: "Casa", desc: "for girls", img: "casa.jpg", price: 32.30, status: false, stock: 0, visibility: "trash" },
    { name: "Pelota", desc: "unisex", img: "pelota.jpg", price: 12.99, status: true, stock: 15, visibility: "public" },
    { name: "Camion", desc: "for boys", img: "camion.jpg", price: 23.66, status: true, stock: 10, visibility: "public" },
    { name: "Rompecabezas", desc: "family game", img: "rompecabezas.jpg", price: 9.75, status: false, stock: 0, visibility: "trash" },
    { name: "Lego", desc: "building blocks", img: "lego.jpg", price: 45.20, status: true, stock: 30, visibility: "public" },
    { name: "Carrito", desc: "for boys", img: "carrito.jpg", price: 14.10, status: true, stock: 8, visibility: "public" },
    { name: "Patineta", desc: "unisex", img: "patineta.jpg", price: 55.00, status: false, stock: 0, visibility: "trash" },
    { name: "Bicicleta", desc: "unisex", img: "bicicleta.jpg", price: 120.99, status: true, stock: 5, visibility: "public" },
    { name: "Robot", desc: "for boys", img: "robot.jpg", price: 38.75, status: true, stock: 12, visibility: "public" },
    { name: "Peluche Oso", desc: "for girls", img: "peluche_oso.jpg", price: 16.40, status: true, stock: 19, visibility: "public" },
    { name: "Cocina", desc: "for girls", img: "cocina.jpg", price: 60.25, status: false, stock: 0, visibility: "trash" },
    { name: "Tren", desc: "for boys", img: "tren.jpg", price: 27.80, status: true, stock: 7, visibility: "public" },
    { name: "Avion", desc: "for boys", img: "avion.jpg", price: 33.00, status: true, stock: 14, visibility: "public" },
    { name: "Puzzle 3D", desc: "family game", img: "puzzle3d.jpg", price: 19.90, status: true, stock: 11, visibility: "public" },
    { name: "Muneco Accion", desc: "for boys", img: "muneco_accion.jpg", price: 22.15, status: true, stock: 20, visibility: "public" },
    { name: "Pista Carros", desc: "for boys", img: "pista_carros.jpg", price: 49.99, status: false, stock: 0, visibility: "trash" },
    { name: "Bloques Madera", desc: "educational", img: "bloques_madera.jpg", price: 13.50, status: true, stock: 25, visibility: "public" },
    { name: "Tablet Ninos", desc: "educational", img: "tablet_ninos.jpg", price: 89.99, status: true, stock: 6, visibility: "public" },
    { name: "Microfono Karaoke", desc: "unisex", img: "microfono.jpg", price: 27.49, status: true, stock: 18, visibility: "public" },
    { name: "Castillo Princesa", desc: "for girls", img: "castillo.jpg", price: 75.00, status: false, stock: 0, visibility: "trash" },
    { name: "Superheroe", desc: "for boys", img: "superheroe.jpg", price: 21.75, status: true, stock: 16, visibility: "public" },
    { name: "Coche Control", desc: "for boys", img: "coche_control.jpg", price: 58.40, status: true, stock: 9, visibility: "public" },
    { name: "Peluche Gato", desc: "for girls", img: "peluche_gato.jpg", price: 17.60, status: true, stock: 13, visibility: "public" },
    { name: "Juego Mesa", desc: "family game", img: "juego_mesa.jpg", price: 29.99, status: false, stock: 0, visibility: "trash" },
    { name: "Barco Pirata", desc: "for boys", img: "barco_pirata.jpg", price: 41.20, status: true, stock: 10, visibility: "public" },
    { name: "Dinosaurio", desc: "for boys", img: "dinosaurio.jpg", price: 26.50, status: true, stock: 22, visibility: "public" },
    { name: "Set Pintura", desc: "educational", img: "set_pintura.jpg", price: 15.30, status: true, stock: 17, visibility: "public" },
    { name: "Ajedrez", desc: "family game", img: "ajedrez.jpg", price: 24.45, status: true, stock: 8, visibility: "public" },
    { name: "Drone", desc: "for boys", img: "drone.jpg", price: 150.00, status: false, stock: 0, visibility: "trash" }
]

const admins = [
    { username: "kassandra", email: "kassandra@gmail.com", role: "admin", password: "kass24" },
    { username: "jose", email: "jose@gmail.com", role: "admin", password: "jose24" },
    { username: "luis", email: "luis@gmail.com", role: "admin", password: "luis24" },
]

const users = [
    { name: "Alice", email: "alice@prisma.io", number: "1234567890" },
    { name: "Bob", email: "bob@prisma.io", number: "0987654321" },
    { name: "Carlos", email: "carlos@toyshop.com", number: "1112223333" },
    { name: "Diana", email: "diana@toyshop.com", number: "4445556666" },
]

// ===== FUNCIONES DE CREACIÓN =====
async function createProducts() {
    const cleanedProducts = productData.map(cleanProductData)
    await prisma.product.createMany({ data: cleanedProducts, skipDuplicates: true })
    console.log('✅ Productos creados')
}

async function createAdmins() {
    await prisma.admin.createMany({ data: admins, skipDuplicates: true })
    console.log('✅ Admins creados')
}

async function createUsersAndOrders() {
    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                ...user,
                order: {
                    create: generateOrdersForUser(user.name)
                }
            }
        })
    }
    console.log('✅ Usuarios y órdenes creados')
}

// ===== GENERADOR DE ÓRDENES =====
function generateOrdersForUser(name) {
    switch (name) {
        case "Alice":
            return [
                {
                    total: 100,
                    orderItem: {
                        create: [
                            { quantity: 2, productId: 1 }, // Muneca
                            { quantity: 1, productId: 6 }, // Lego
                        ]
                    }
                }
            ]
        case "Bob":
            return [
                {
                    total: 180,
                    orderItem: {
                        create: [
                            { quantity: 1, productId: 9 }, // Bicicleta
                            { quantity: 2, productId: 3 }, // Pelota
                        ]
                    }
                }
            ]
        case "Carlos":
            return [
                {
                    total: 220,
                    orderItem: {
                        create: [
                            { quantity: 1, productId: 19 }, // Tablet Ninos
                            { quantity: 2, productId: 18 }, // Bloques Madera
                        ]
                    }
                },
                {
                    total: 60,
                    orderItem: {
                        create: [
                            { quantity: 3, productId: 15 }, // Puzzle 3D
                        ]
                    }
                }
            ]
        case "Diana":
            return [
                {
                    total: 95,
                    orderItem: {
                        create: [
                            { quantity: 1, productId: 23 }, // Coche Control
                            { quantity: 2, productId: 11 }, // Peluche Oso
                        ]
                    }
                }
            ]
        default:
            return []
    }
}

// ===== MAIN =====
async function main() {
    try {
        await createProducts()
        await createAdmins()
        await createUsersAndOrders()
        console.log('🎉 Seed completado exitosamente')
    } catch (error) {
        console.error('❌ Error durante el seed:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
