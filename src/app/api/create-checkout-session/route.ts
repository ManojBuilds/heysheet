import dodo from "@/lib/dodopayments";
import { createClient } from "@/lib/supabase/server";
import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    await auth.protect();
    const { productId } = await req.json()
    const user = await currentUser()
    const name = user?.fullName || user?.firstName || user?.lastName || "Guest User"
    const email = user?.emailAddresses[0]?.emailAddress || ""
    let customerId = null;
    try {
        const supabase = await createClient()
        const { data: userDB } = await supabase.from('users').select('id, email, customer_id').eq('clerk_user_id', user?.id).single();
        if (userDB?.customer_id) {
            customerId = userDB.customer_id;
        } else {
            const customer = await dodo.customers.create({
                name, email
            })
            customerId = customer.customer_id;
        }

        const subscription = await dodo.subscriptions.create({
            billing: { city: '', country: 'AF', state: 'state', street: 'street', zipcode: 'zipcode' },
            customer: { customer_id: customerId },
            product_id: productId,
            quantity: 1,
            metadata: {
                userId: user?.id || '',
            }
        })
        return NextResponse.json({ url: subscription.payment_link }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}
