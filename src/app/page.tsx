"use client"
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'
import cities from '../cities.json'
import { api } from "~/trpc/react";
import { Space_Grotesk } from "next/font/google";

interface GuessState {
  isReady: boolean;
  message: string;
}

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Home() {
  const user = useUser();
  const [isMinimized, setIsMinimized] = useState(false);
  const [riddle, setRiddle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guessState, setGuessState] = useState<GuessState>({ isReady: false, message: "" });
  const [isShaking, setIsShaking] = useState(false);
  const [isMessageBouncing, setIsMessageBouncing] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  const generateRiddle = api.generate.generateRiddle.useMutation({
    onSuccess: (data) => {
      if (data.success && data.result) {
        setRiddle(data.result);
        setGuessState({ isReady: true, message: "Click anywhere on the Earth to make your guess!" });
      }
      setIsLoading(false);
    },
  });

  const handlePlanetClick = async () => {
    if (!user.isSignedIn) {
      if (!guessState.isReady) {
        setGuessState({ 
          isReady: true, 
          message: "Please sign in to play!" 
        });
      } else {
        setIsMessageBouncing(true);
        setTimeout(() => setIsMessageBouncing(false), 1000);
      }
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      return;
    }

    setIsMinimized(!isMinimized);
    
    // Only generate riddle when minimizing and user is signed in
    if (!isMinimized) {
      setIsLoading(true);
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      if (randomCity) {
        try {
          generateRiddle.mutate({ city: randomCity });
        } catch (error) {
          console.error('Error:', error instanceof Error ? error.message : String(error));
        }
      }
    }
  };

  // Reset initial render when message disappears
  useEffect(() => {
    if (!guessState.isReady) {
      setInitialRender(true);
    }
  }, [guessState.isReady]);

  return (
    <main className="min-h-[100vh] w-[100vw] overflow-hidden bg-gradient-to-b from-[#0d0716] to-[#6468ab] flex items-center justify-center fixed inset-0">
      <div className="absolute top-4 right-4 z-30 cursor-pointer">
        <div className="text-white hover:text-white/80 transition-colors">
          {!user.isSignedIn && <SignInButton />}
          {!!user.isSignedIn && (
            <div onClick={() => {
              setTimeout(() => window.location.reload(), 300);
            }}>
              <SignOutButton />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center relative w-full h-screen">
        {guessState.isReady && !user.isSignedIn && (
          <div 
            onAnimationEnd={() => setInitialRender(false)}
            className={`absolute 
              md:top-[25vh] md:left-[8vw] md:-translate-x-0
              top-[75vh] inset-x-0 mx-auto md:mx-0
              bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg
              w-fit min-w-[200px] max-w-[90vw] md:max-w-xs
              ${initialRender ? 'animate-slideInLeft' : ''}
              ${isMessageBouncing ? 'animate-messageBounce' : ''}`}
          >
            <p className="text-white/90 text-xs sm:text-sm md:text-base text-center whitespace-nowrap">
              {guessState.message}
            </p>
          </div>
        )}

        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            flex justify-center items-center transition-all duration-1000 ease-in-out
            ${isMinimized ? 'scale-50' : 'scale-100'}
            ${isShaking ? 'animate-shake' : ''}`}
          onClick={handlePlanetClick}
        >
          <div className="opacity-100 scale-[0.4] sm:scale-[0.6] md:scale-[0.65]">
            <div className="relative w-[600px] h-[600px] rounded-full animate-[spin_25s_linear_infinite] shadow-[inset_-30px_-30px_80px_rgba(0,0,0,0.5),-2px_-2px_15px_rgba(255,255,255,0.1)]"
              style={{
                background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Cpath fill='%23157A3B' d='M20,60 Q60,20 120,40 T220,20 T320,45 Q350,70 320,100 Q290,120 250,105 T160,120 T80,100 Q30,90 20,60 Q40,80 80,70 T160,80 T220,60 T180,40 Q140,50 100,40 T20,60 Z' /%3E%3Cpath fill='%23157A3B' d='M420,30 Q470,0 540,20 T680,10 T760,35 Q780,60 760,90 Q720,110 680,95 T580,110 T480,90 Q440,70 420,30 Q450,50 500,40 T600,50 T680,30 T640,20 Q600,30 550,20 T420,30 Z' /%3E%3Cpath fill='%23157A3B' d='M140,180 Q180,150 240,165 T340,150 T420,170 Q460,190 420,220 Q390,240 340,225 T240,240 T160,220 Q130,200 140,180 Q160,195 200,185 T280,195 T340,175 T300,165 Q260,175 210,165 T140,180 Z' /%3E%3Cpath fill='%231E4D2B' d='M520,160 Q570,140 620,155 T720,140 Q760,160 720,190 Q690,210 640,195 T550,210 Q510,190 520,160 Q540,175 580,165 T660,175 T700,155 T660,145 Q620,155 580,145 T520,160 Z' /%3E%3Cpath fill='%23157A3B' d='M60,280 Q100,250 160,265 T260,250 T340,270 Q370,290 340,320 Q310,340 260,325 T160,340 T80,320 Q50,300 60,280 Q80,295 120,285 T200,295 T260,275 T220,265 Q180,275 130,265 T60,280 Z' /%3E%3Cpath fill='%23157A3B' d='M480,260 Q530,230 590,245 T690,230 T770,250 Q800,270 770,300 Q740,320 690,305 T590,320 T510,300 Q480,280 480,260 Q500,275 540,265 T620,275 T690,255 T650,245 Q610,255 560,245 T480,260 Z' /%3E%3C/svg%3E"), linear-gradient(30deg, #1B4B90 0%, #2B7CD3 100%)`
              }}>
              <div className="absolute -inset-2.5 rounded-full blur bg-gradient-to-br from-transparent via-sky-200/10 to-blue-700/40" />
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/40 via-white/10 to-transparent" 
                style={{
                  '--tw-gradient-from-position': '0%',
                  '--tw-gradient-via-position': '30%',
                  '--tw-gradient-to-position': '70%'
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Riddle display */}
      {isLoading && (
        <div className="fixed top-16 left-4 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg 
          w-[calc(100vw-2rem)] sm:w-[90vw] md:w-auto md:max-w-md animate-fadeIn transition-all duration-300 ease-in-out">
          <div className="animate-pulse text-xs sm:text-sm md:text-base">
            Generating riddle...
          </div>
        </div>
      )}
      {riddle && !isLoading && (
        <div className="fixed top-16 left-4 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg 
          w-[calc(100vw-2rem)] sm:w-[90vw] md:w-auto md:max-w-md animate-slideIn transition-all duration-500 ease-in-out">
          {riddle.split('\n').map((line, index) => (
            <p key={index} 
               className={`${spaceGrotesk.className} text-white/90 whitespace-pre-line animate-slideIn text-xs sm:text-sm md:text-base tracking-wider`}
               style={{ animationDelay: `${index * 200}ms` }}>
              {line}
            </p>
          ))}
        </div>
      )}
      {/* Guessing interface */}
      {guessState.isReady && user.isSignedIn && (
        <div className="fixed bottom-4 left-4 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg 
          w-[calc(100vw-2rem)] sm:w-[90vw] md:w-auto md:max-w-md animate-slideUp">
          <p className="text-white/90 mb-2 text-xs sm:text-sm md:text-base">{guessState.message}</p>
        </div>
      )}
    </main>
  );
}
        