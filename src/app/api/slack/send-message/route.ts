import { sendMessage } from "@/lib/slack/sendMessage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
       const {channel, text } = await req.json()
       await sendMessage(channel, text)
       return NextResponse.json({message: "success"}, {status: 200})
    } catch (error: any) {
        console.log(error)
       return NextResponse.json({message: error.message}, {status: 500}) 
    }
}