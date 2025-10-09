/*
  Warnings:

  - You are about to drop the `Trash` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `visibility` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "visibility" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Trash";
