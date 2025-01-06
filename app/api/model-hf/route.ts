import { NextResponse} from "next/server";
import { inference } from "@/app/lib/utils/hf";

export async function POST(req:Request) {
    try{
    const {message} = await req.json();
    const startTime = Date.now();

    if(!message){
        return NextResponse.json(
            { error: "No message provided." },
            { status: 400 });
    }

    const chatCompletion = await inference.chatCompletion({
        model: "Qwen/Qwen2.5-72B-Instruct",
        messages: [{ role: "user", content: message}],
    });
    console.log("this is from qwen", chatCompletion)

    const responseMessage = chatCompletion.choices[0]?.message?.content || "";
    const endTime = Date.now();
    const duration = endTime - startTime;

    return NextResponse.json(
        { content: responseMessage, duration: duration },
    );
    } catch(error){
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to get qwen chat completion." },
            { status: 500 });
    }





}