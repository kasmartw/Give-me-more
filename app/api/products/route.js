import { NextResponse } from "next/server";
import { readProducts, createProduct, deleteProduct, updateProductStatus, readSomeProducts, updateProduct, MoveToTrash } from "@/lib/manage-db";
import { isValidProduct } from "@/lib/valid-product";


export const revalidate = 0;


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.getAll("id")
  const from = searchParams.get("from");
  const idsInt = ids.map((id) => parseInt(id))
  console.log(from)
  try {
    console.log(idsInt)
    if (from === "public") {
      console.log("todos los productos")
      const products = await readProducts("public");
      return NextResponse.json(products, { status: 200 });
    } else if (from === "trash") {
      console.log("productos en la papelera")
      const allProducts = await readProducts("trash");
      return NextResponse.json(allProducts, { status: 200 });
    }
    else {
      console.log("algunos productos")
      const someProducts = await Promise.all(idsInt.map(id => readSomeProducts(id)));
      return NextResponse.json(someProducts)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}

export async function POST(request) {
  try {
    console.log("post")
    const { action, name, desc, img, price, stock, status } = await request.json();
    const priceFloat = Number(price);
    const statusBool = typeof status === 'boolean' ? status : (status === 'active');
    const stockInt = parseInt(stock);


    if (action == "create") {
      console.log("create")

      if (isValidProduct(name, desc, img, priceFloat, statusBool, stockInt)) {
        await createProduct(name, desc, img, priceFloat, statusBool, stockInt);
        return NextResponse.json({ status: 201 });
      } else {
        return new Response('Invalid product data', { status: 400 });
      }
    } else if (action == "moveToTrash") {
      console.log("moveToTrash")
      if (isValidProduct(name, desc, img, priceFloat, statusBool, stockInt)) {
        console.log("es valido")
        await MoveToTrash(name, desc, img, priceFloat, statusBool, stockInt);
        console.log("se movio")
        return NextResponse.json({ status: 201 });
      } else {
        return new Response('Invalid product data', { status: 400 });
      }
    } else {
      return new Response('Invalid action', { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.getAll("id")
  const idsInt = ids.map((id) => parseInt(id))
  const { action, name, desc, img, price, status, stock, visibility } = await request.json();
  if (action == "status") {
    try {
      const idList = Array.isArray(idsInt) ? idsInt : [idsInt];

      if (!idList.every((id) => typeof id === "number") || typeof status !== 'boolean' || typeof action !== 'string') {
        return new Response('Invalid product data', { status: 400 });
      }
      for (const id of idList) {
        console.log("ahora vamos a db")
        await updateProductStatus(id, status);

      }
      console.log("se cambio el estado")
      return NextResponse.json({ message: "Status updated" }, { status: 200 });

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected exception'

      return new Response(message, { status: 500 })
    }
  } else if (action == "edit") {
    console.log("edit")
    try {
      const idList = Array.isArray(idsInt) ? idsInt : [idsInt];

      if (!idList.every((id) => typeof id === "number") || typeof name !== 'string' || typeof desc !== 'string' || typeof img !== 'string' || typeof price !== 'number') {
        return new Response('Invalid product data', { status: 400 });
      }
      for (const id of idList) {
        console.log("ahora vamos a db")
        await updateProduct(id, name, desc, img, price, stock, visibility);
      }
      return NextResponse.json({ message: "Product updated" }, { status: 200 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected exception"

      return new Response(message, { status: 500 })
    }
  } else if (action == "move") {
    console.log("move")
    try {
      const idList = Array.isArray(idsInt) ? idsInt : [idsInt];

      if (!idList.every((id) => typeof id === "number") || typeof action !== 'string') {
        return new Response('Invalid product data', { status: 400 });
      }
      for (const id of idList) {
        console.log("ahora vamos a db")
        await updateProduct(id, name, desc, img, price, stock, visibility);
      }
      return NextResponse.json({ message: "Product updated" }, { status: 200 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected exception"

      return new Response(message, { status: 500 })
    }
  } else {
    return new Response('Invalid action', { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("id")
    const idsInt = ids.map((id) => parseInt(id))
    console.log(idsInt)
    if (idsInt.every((id) => typeof id === "number")) {
      console.log("going to delete")
      for (const id of idsInt) {
        await deleteProduct(id);
      }
      console.log("deleted")
      return NextResponse.json({ message: "Products deleted" }, { status: 200 });
    } else {
      return new Response({ status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected exception'

    return new Response(message, { status: 500 });
  }
}