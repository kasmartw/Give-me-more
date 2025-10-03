-- CreateTable
CREATE TABLE "public"."Trash" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "desc" TEXT,
    "img" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "Trash_pkey" PRIMARY KEY ("id")
);
