import Groq from "groq-sdk";
import { NextResponse} from "next/server";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req:Request) {
    try{
        const {message} = await req.json();
        const startTime = Date.now();

        if(!message){
            return NextResponse.json(
                { error: "No message provided." },
                { status: 400 });
        }


        const chatCompletion = await groq.chat.completions.create({ 
            messages: [
                {role: "user", content: message},
            ], 
            model: "mixtral-8x7b-32768",
        });


        const responseMessage = chatCompletion.choices[0]?.message?.content || "";

        const endTime = Date.now();
        const duration = endTime - startTime;

        return NextResponse.json(
            { content: responseMessage, duration: duration },
        );

    }catch(error){
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to get groq chat completion." }, 
            { status: 500 });
    }
}