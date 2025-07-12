import { useEffect, useRef } from "react";

export default function RAABOTIntro({ onFinish }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
      });
    }

    const timer = setTimeout(() => {
      onFinish();
    }, 10000); // shorter duration if no text

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <audio ref={audioRef} src="/raabot-intro.mp3" preload="auto" />
      <img
        src="/raabot-logo.png"
        alt="RAABOT"
        className="w-64 md:w-80 lg:w-96"
      />
    </div>
  );
}
