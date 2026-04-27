/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="vite/client" />
import { APIProvider } from '@vis.gl/react-google-maps';
import Game from './components/Game';

export default function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6 text-center font-sans">
        <div className="max-w-lg w-full bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800 space-y-4">
          <div className="flex justify-center text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Missing API Key</h1>
          <p className="text-zinc-400">
            Please setup your <code className="text-rose-400 bg-zinc-950 px-1.5 py-0.5 rounded font-mono text-sm">VITE_GOOGLE_MAPS_API_KEY</code> in the Settings to play GlobeGuesser 3D.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Game />
    </APIProvider>
  );
}
