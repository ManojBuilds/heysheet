import { createDodopaymentsCheckoutSession } from "@/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, email, name } = body;

    if (!productId || !email) {
      return new NextResponse("Product ID and Email are required", {
        status: 400,
      });
    }

    const checkout = await createDodopaymentsCheckoutSession({
      email,
      name: name || email,
      productId,
    });

    if (checkout.success && checkout.link) {
      return NextResponse.json({ url: checkout.link });
    } else {
      return new NextResponse(
        checkout.message || "Failed to create checkout session",
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("[CHECKOUT_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
