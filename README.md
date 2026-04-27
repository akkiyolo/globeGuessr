# GlobeGuesser 3D

<img width="1244" height="790" alt="image" src="https://github.com/user-attachments/assets/16f5c8b2-115b-461e-af2f-b412952f6e23" />


Explore the world in 3D street view and pinpoint your location on the map to earn points! GlobeGuesser 3D is a geography guessing game built with React and the Google Maps API.

## Features

- **3D Street View:** Immerse yourself in random global locations using Google Maps Street View.
- **Interactive Mini-Map:** Place your pin on the interactive map to guess where you are.
- **Distance Scoring:** Earn points based on how close your guess is to the actual location.
- **5-Round Matches:** Play through 5 unique locations per game and try to achieve the maximum score of 25,000!
- **Smooth Animations:** Polished UI with Tailwind CSS and Lucide React icons.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (v4)
- **Maps Integration:** `@vis.gl/react-google-maps`, Google Maps JavaScript API
- **Icons:** `lucide-react`

## Setup & Run Locally

### 1. Prerequisites

You will need a **Google Maps API Key** with the following APIs enabled:
- Maps JavaScript API
- Street View API

### 2. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory (you can copy from `.env.example`) and add your Google Maps API Key:

```env
VITE_GOOGLE_MAPS_API_KEY="your_api_key_here"
```

### 4. Start Development Server

Run the Vite development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser to start playing!

## License

MIT
