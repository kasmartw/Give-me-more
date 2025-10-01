import { PrismaClient } from '../app/generated/prisma/index.js'

const prisma = new PrismaClient();

// Función para limpiar strings de bytes nulos y caracteres problemáticos
function cleanString(str) {
    if (typeof str !== 'string') return str;
    // Elimina bytes nulos (0x00) y otros caracteres de control problemáticos
    return str.replace(/\0/g, '').replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '');
}

// Función para limpiar todos los campos string de un objeto
function cleanProductData(product) {
    return {
        name: cleanString(product.name),
        desc: product.desc ? cleanString(product.desc) : null,
        img: cleanString(product.img),
        price: product.price,
        status: product.status,
        stock: product.stock
    };
}

const productData = [
    { name: "Muneca", desc: "for girls", img: "muneca.jpg", price: 18.50, status: true, stock: 21 },
    { name: "Casa", desc: "for girls", img: "casa.jpg", price: 32.30, status: false, stock: 0 },
    { name: "Pelota", desc: "unisex", img: "pelota.jpg", price: 12.99, status: true, stock: 15 },
    { name: "Camion", desc: "for boys", img: "camion.jpg", price: 23.66, status: true, stock: 10 },
    { name: "Rompecabezas", desc: "family game", img: "rompecabezas.jpg", price: 9.75, status: false, stock: 0 },
    { name: "Lego", desc: "building blocks", img: "lego.jpg", price: 45.20, status: true, stock: 30 },
    { name: "Carrito", desc: "for boys", img: "carrito.jpg", price: 14.10, status: true, stock: 8 },
    { name: "Patineta", desc: "unisex", img: "patineta.jpg", price: 55.00, status: false, stock: 0 },
    { name: "Bicicleta", desc: "unisex", img: "bicicleta.jpg", price: 120.99, status: true, stock: 5 },
    { name: "Robot", desc: "for boys", img: "robot.jpg", price: 38.75, status: true, stock: 12 },
    { name: "Peluche Oso", desc: "for girls", img: "peluche_oso.jpg", price: 16.40, status: true, stock: 19 },
    { name: "Cocina", desc: "for girls", img: "cocina.jpg", price: 60.25, status: false, stock: 0 },
    { name: "Tren", desc: "for boys", img: "tren.jpg", price: 27.80, status: true, stock: 7 },
    { name: "Avion", desc: "for boys", img: "avion.jpg", price: 33.00, status: true, stock: 14 },
    { name: "Puzzle 3D", desc: "family game", img: "puzzle3d.jpg", price: 19.90, status: true, stock: 11 },
    { name: "Muneco Accion", desc: "for boys", img: "muneco_accion.jpg", price: 22.15, status: true, stock: 20 },
    { name: "Pista Carros", desc: "for boys", img: "pista_carros.jpg", price: 49.99, status: false, stock: 0 },
    { name: "Bloques Madera", desc: "educational", img: "bloques_madera.jpg", price: 13.50, status: true, stock: 25 },
    { name: "Tablet Ninos", desc: "educational", img: "tablet_ninos.jpg", price: 89.99, status: true, stock: 6 },
    { name: "Microfono Karaoke", desc: "unisex", img: "microfono.jpg", price: 27.49, status: true, stock: 18 },
    { name: "Castillo Princesa", desc: "for girls", img: "castillo.jpg", price: 75.00, status: false, stock: 0 },
    { name: "Superheroe", desc: "for boys", img: "superheroe.jpg", price: 21.75, status: true, stock: 16 },
    { name: "Coche Control", desc: "for boys", img: "coche_control.jpg", price: 58.40, status: true, stock: 9 },
    { name: "Peluche Gato", desc: "for girls", img: "peluche_gato.jpg", price: 17.60, status: true, stock: 13 },
    { name: "Juego Mesa", desc: "family game", img: "juego_mesa.jpg", price: 29.99, status: false, stock: 0 },
    { name: "Barco Pirata", desc: "for boys", img: "barco_pirata.jpg", price: 41.20, status: true, stock: 10 },
    { name: "Dinosaurio", desc: "for boys", img: "dinosaurio.jpg", price: 26.50, status: true, stock: 22 },
    { name: "Set Pintura", desc: "educational", img: "set_pintura.jpg", price: 15.30, status: true, stock: 17 },
    { name: "Ajedrez", desc: "family game", img: "ajedrez.jpg", price: 24.45, status: true, stock: 8 },
    { name: "Drone", desc: "for boys", img: "drone.jpg", price: 150.00, status: false, stock: 0 }
];

export async function createProducts() {
    // Limpia todos los productos antes de insertarlos
    const cleanedProducts = productData.map(cleanProductData);

    await prisma.product.createMany({
        data: cleanedProducts,
        skipDuplicates: true,
    });

    console.log('✅ Productos creados exitosamente');
}

async function main() {
    try {
        await createProducts();

        await prisma.user.upsert({
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

        await prisma.user.upsert({
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

        console.log('✅ Seed completado exitosamente');
    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });