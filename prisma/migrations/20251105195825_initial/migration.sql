/*
  Warnings:

  - You are about to drop the column `productCost` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Shipping` table. All the data in the column will be lost.
  - Added the required column `shippedAt` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCost` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalItems` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWeight` to the `Shipping` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Shipping" DROP CONSTRAINT "Shipping_productId_fkey";

-- AlterTable
ALTER TABLE "Shipping" DROP COLUMN "productCost",
DROP COLUMN "productId",
DROP COLUMN "weight",
ADD COLUMN     "shippedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalItems" INTEGER NOT NULL,
ADD COLUMN     "totalWeight" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "ShippingItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "unitWeight" DOUBLE PRECISION NOT NULL,
    "shippingId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ShippingItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShippingItem" ADD CONSTRAINT "ShippingItem_shippingId_fkey" FOREIGN KEY ("shippingId") REFERENCES "Shipping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingItem" ADD CONSTRAINT "ShippingItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
