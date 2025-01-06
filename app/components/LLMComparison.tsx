"use client"

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";


interface ResponseData {
  content: string;
  duration: number;
}


const LLMComparison: React.FC = () => {
    const[prompt, setPrompt] = useState<string>("");
    const [responseGroq, setResponseGroq] = useState<ResponseData | null>(null);
    const [responseQwen, setResponseQwen] = useState<ResponseData | null>(null);
    const [responseMixtral, setResponseMixtral] = useState<ResponseData | null>(null);

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      try {

        const [responseGroq, responseQwen, responseMixtral] = await Promise.all([
          fetch('/api/chat-stream', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: prompt })
          }),
          fetch('/api/model-hf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: prompt })
          }),
          fetch('/api/model-mixtral', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: prompt })
          })

        ])

        const dataGroq = await responseGroq.json()
        const dataQwen = await responseQwen.json()
        const dataMixtral = await responseMixtral.json()
        console.log("here is the data", dataGroq, dataQwen, dataMixtral)

        if (responseGroq.ok){
          setResponseGroq(dataGroq)
        } else {
          console.error('Failed to submit prompt to Groq')
        }

        if (responseQwen.ok){
          setResponseQwen(dataQwen)
        } else {
          console.error('Failed to submit prompt to Qwen')
        }

        if (responseMixtral.ok){
          setResponseMixtral(dataMixtral)
        }

      }catch(error){
        console.error("Error fetching chat: ", error)
      } finally {
        setLoading(false)
      }
    }






    return(
    <div className="flex flex-col">
    <div className="flex flex-col items-center justify-center mb-10 py-10">
        <div className="w-[80%] items-center gap-4">
            <Card>
                <CardHeader>
                <CardTitle>LLM Comparison Dashboard</CardTitle>
                <CardDescription>Compare the performance of different LLMs on various tasks</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Textarea 
                            className="h-28" // Adjust the height as needed
                            id="llm1" 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter your prompt..." />
                            
                        <Button 
                          className="bg-zinc-800 hover:bg-zinc-600 active:bg-zinc-950 text-white font-bold py-4 px-4 rounded"
                          disabled={loading}
                          type="submit"
                        >
                            <Send className="mr-2 h-4 w-4"/>
                            {loading ? 'Processing...' : 'Compare Models'}
                        </Button>
                    </div>
                    </div>
                </form>
                </CardContent>
            </Card>
        </div>
    </div>
    {/* This is where it will show table   */}

    {responseQwen && responseQwen.content.length > 0 && (
      <div className="items-center justify-center w-[90%] mx-auto">
      <Card className="mb-5">
          <CardHeader>
            <CardTitle>Model Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Model</th>
                    <th className="text-left p-2">Response Time</th>
                  </tr>
                </thead>
                <tbody>
                <tr className="border-b">
                  <td className="p-2">LLama3-8b-8192</td>
                  <td className="p-2">{responseGroq?.duration}ms</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Qwen2.5-72B-Instruct</td>
                  <td className="p-2">{responseQwen?.duration}ms</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Mixtral-8x7b-32768</td>
                  <td className="p-2">{responseMixtral?.duration}ms</td>
                </tr>
                </tbody>
            </table>
            </div>
          </CardContent>

      </Card></div>

    )
    }


    <div className="grid grid-cols-3 gap-4 mx-auto w-[90%] mb-10">
    {/* This is where it will card 1   */}
    <Card className="py-4">
      <CardContent>
        <Badge variant="outline">LLama3-8b-8192</Badge>
        <div className="min-h-32 p-4 bg-gray-50 rounded-lg">

          {responseGroq ? (
              <div>{responseGroq.content}</div>
          ) : (
              <div>...</div>
          )}
        </div>
      </CardContent>
    </Card>

    {/* This is where it will card 2   */}
    <Card className="py-4">
      <CardContent>
        <Badge variant="outline">Qwen2.5-72B-Instruct</Badge>
        <div className="min-h-32 p-4 bg-gray-50 rounded-lg">

            {responseQwen ? (
                <div>{responseQwen.content}</div>
            ) : (
                <div>...</div>
            )}
        </div>
      </CardContent>
    </Card>

    {/* This is where it will card 3   */}
    <Card className="py-4">
      <CardContent>
        <Badge variant="outline">Mixtral-8x7b-32768</Badge>
        <div className="min-h-32 p-4 bg-gray-50 rounded-lg">
            {responseMixtral ? (
                <div>{responseMixtral.content}</div>
            ) : (
                <div>...</div>
            )}
        </div>
      </CardContent>
    </Card>
    </div>  

    </div>
    )



}


export default LLMComparison;