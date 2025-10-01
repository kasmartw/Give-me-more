import { NextResponse } from "next/server";
import { readProducts, createProduct, deleteProduct, updateProductStatus } from "@/lib/manage-db";
import { isValidProduct } from "@/lib/valid-product";

export const revalidate = 0;


export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? reason.message : 'Unexpected exception'

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
  try {
    const { id, status } = await request.json();
    const idList = Array.isArray(id) ? id : [id];

    if (!idList.every((id) => typeof id === "number") || typeof status !== 'boolean') {
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