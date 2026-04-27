import { useState, useCallback, useMemo } from 'react';
import { StreetView } from './StreetView';
import { GuessMap } from './MapComponents';
import { LOCATIONS } from '../constants/locations';
import { getDistance, calculateScore } from '../lib/geo';
import { MapPin, Globe, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

const ROUNDS_PER_GAME = 5;

// Utility to shuffle locations
function getGameLocations() {
  const shuffled = [...LOCATIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, ROUNDS_PER_GAME);
}

export default function Game() {
  const [gameLocations, setGameLocations] = useState(() => getGameLocations());
  const [currentRound, setCurrentRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(null);
  
  // result phase state
  const [isResultPhase, setIsResultPhase] = useState(false);
  const [roundDistance, setRoundDistance] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  
  // game over phase
  const [isGameOver, setIsGameOver] = useState(false);

  const currentLocation = gameLocations[currentRound - 1];

  const handleGuess = useCallback(() => {
    if (!markerPos) return;

    const distance = getDistance(
      currentLocation.lat,
      currentLocation.lng,
      markerPos.lat,
      markerPos.lng
    );

    const score = calculateScore(distance);

    setRoundDistance(distance);
    setRoundScore(score);
    setTotalScore((prev) => prev + score);
    setIsResultPhase(true);

  }, [currentLocation, markerPos]);

  const handleNextRound = useCallback(() => {
    if (currentRound < ROUNDS_PER_GAME) {
      setCurrentRound((prev) => prev + 1);
      setMarkerPos(null);
      setIsResultPhase(false);
    } else {
      setIsGameOver(true);
    }
  }, [currentRound]);

  const handlePlayAgain = useCallback(() => {
    setGameLocations(getGameLocations());
    setCurrentRound(1);
    setTotalScore(0);
    setMarkerPos(null);
    setIsResultPhase(false);
    setIsGameOver(false);
  }, []);

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 font-sans text-white p-6 text-center">
        <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
          <Trophy className="w-20 h-20 mx-auto text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Game Over!</h1>
            <p className="text-zinc-400 text-lg">You explored {ROUNDS_PER_GAME} locations around the world.</p>
          </div>

          <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
            <p className="text-zinc-500 uppercase tracking-widest text-sm font-semibold mb-1">Final Score</p>
            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
              {totalScore.toLocaleString()}
            </p>
            <p className="text-zinc-500 mt-2">out of {(ROUNDS_PER_GAME * 5000).toLocaleString()}</p>
          </div>

          <button
            onClick={handlePlayAgain}
            className="flex items-center justify-center space-x-2 w-full py-4 bg-white hover:bg-zinc-200 text-zinc-950 rounded-xl font-bold transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-zinc-950 font-sans overflow-hidden">
      {/* 3D Street View Background */}
      <StreetView lat={currentLocation.lat} lng={currentLocation.lng} />

      {/* Top Bar HUD */}
      <div className="absolute top-0 inset-x-0 z-10 pointer-events-none p-4 flex justify-between items-start">
        {/* Logo / Round info */}
        <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/50 rounded-xl p-4 shadow-xl pointer-events-auto flex items-center space-x-4">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <Globe className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-white font-bold leading-none mb-1">GlobeGuesser 3D</h2>
            <p className="text-zinc-400 text-sm font-medium tracking-wide">
              ROUND {currentRound} / {ROUNDS_PER_GAME}
            </p>
          </div>
        </div>

        {/* Score indicator */}
        <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/50 rounded-xl p-4 shadow-xl pointer-events-auto min-w-[140px] text-right text-white">
           <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-1">Score</p>
           <p className="text-2xl font-black tabular-nums">{totalScore.toLocaleString()}</p>
        </div>
      </div>

      {/* Mini Map & Guess Interaction */}
      <GuessMap
        onGuess={handleGuess}
        markerPos={markerPos}
        setMarkerPos={setMarkerPos}
        actualLocation={isResultPhase ? currentLocation : undefined}
        isResultPhase={isResultPhase}
      />

      {/* Result Modal - Shifted to left so map is visible */}
      {isResultPhase && (
        <div className="absolute inset-y-0 left-0 z-20 flex items-center justify-start p-8 pointer-events-none">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full space-y-6 pointer-events-auto transform animate-in fade-in slide-in-from-left-8 duration-300">
            <div>
               <p className="text-zinc-400 text-sm font-semibold uppercase tracking-widest mb-2">Round Result</p>
               <h3 className="text-3xl font-black text-white">{roundScore.toLocaleString()} pts</h3>
            </div>
            
            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/50 text-left space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-zinc-500">Distance</span>
                 <span className="text-zinc-200 font-medium">{roundDistance < 1 ? '< 1 km' : `${Math.round(roundDistance).toLocaleString()} km`}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-zinc-500">Location</span>
                 <span className="text-zinc-200 font-medium truncate ml-4" title={currentLocation.name}>{currentLocation.name}</span>
               </div>
            </div>

            <button
              onClick={handleNextRound}
              className="flex items-center justify-center space-x-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
            >
              <span>{currentRound < ROUNDS_PER_GAME ? 'NEXT ROUND' : 'VIEW FINAL SCORE'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
