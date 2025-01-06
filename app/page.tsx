
import LLMComparison from "./components/LLMComparison";


export default function Home() {
  return (
    <div className="bg-gray-100 items-center justify-center min-h-screen">
      <header className="items-center justify-center mx-auto py-4">
          <h1 className="text-4xl font-bold text-center">Welcome to LLM-Eval</h1>
          <p className="text-lg text-center">A platform for evaluating LLMs</p>
      </header>

      <main>
        <LLMComparison />
      </main>
    </div>






 

  );
}
