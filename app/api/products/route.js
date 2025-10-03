import { NextResponse } from "next/server";
import { readProducts, createProduct, deleteProduct, updateProductStatus, readSomeProducts, updateProduct } from "@/lib/manage-db";
import { isValidProduct } from "@/lib/valid-product";


export const revalidate = 0;


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.getAll("id")
  const idsInt = ids.map((id) => parseInt(id))
  try {
    console.log(idsInt)
    if (idsInt.length === 0) {
      console.log("todos los productos")
      const products = await readProducts();
      return NextResponse.json(products, { status: 200 });
    } else {
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
    const formData = await request.formData();
    const name = formData.get("name");
    const desc = formData.get("desc");
    const img = formData.get("img");
    const price = formData.get("price");
    const priceFloat = Number(price);

    if (isValidProduct(name, desc, img, priceFloat)) {
      await createProduct(name, desc, img, priceFloat);
      return NextResponse.json({ status: 201 });
    } else {
      return new Response('Invalid product data', { status: 400 });
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
  const { action, name, desc, img, price, status } = await request.json();
  if (action == "status") {
    try {
      const idList = Array.isArray(idsInt) ? idsInt : [idsInt];

      if (!idList.every((id) => typeof id === "number") || typeof status !== 'boolean' || typeof action !== 'string') {
        return new Response('Invalid product data', { status: 400 });
      }
      for (const id of idList) {
        await updateProductStatus(id, status);
      }
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
        await updateProduct(id, name, desc, img, price);
      }
      return NextResponse.json({ message: "Product updated" }, { status: 200 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected exception"

      return new Response(message, { status: 500 })
    }
  }
}

export async function DELETE(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    if (typeof id === 'number') {
      await deleteProduct(id);
      return NextResponse.json({ status: 200 });
    } else {
      return new Response({ status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected exception'

    return new Response(message, { status: 500 });
  }
}