import { useState, useEffect } from "react";

export default function RAABOTIntro({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // Automatically go to PhaseOne after 10s
    }, 10000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-blue-400 animate-fadeIn">
      <img src="/raabot-logo.png" alt="RAABOT" className="w-24 mb-4" />
      <h1 className="text-xl">Hello, human...</h1>
      <h2 className="text-4xl font-bold mt-2">RAABOT</h2>
      <p className="text-md mt-2">P.Raa’s brain and his Jarvis bot</p>
      <p className="text-sm mt-4 max-w-md text-center">
        Fully optimized for chaos and trained for solutions.
        <br />
        Ask, type, or tap. I won’t judge... unless it’s your spelling.
      </p>
      <button
        className="mt-8 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={onFinish}
      >
        Let’s Begin
      </button>
    </div>
  );
}
