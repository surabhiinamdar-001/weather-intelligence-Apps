# Weather Intelligence

A high-performance, client-side meteorological web application built with React, Vite, TypeScript, Tailwind CSS, and Recharts. The application leverages public Open-Meteo APIs to provide real-time weather observations, 7-day forecasts, hydro-thermal trend charts, and deterministic rule-based weather intelligence recommendations without requiring any API keys, backend servers, or generative AI.

---

## Key Features

1. **Global City Search**
   - Dynamic real-time query resolution via the Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search`).
   - Debounced search queries with location disambiguation (city name, administrative region/state, and country code).
   - Graceful "City not found" state and error handling.
   - Quick-select location chips for rapid access to major world cities.

2. **Default Experience**
   - Automatically initializes with **Vancouver, British Columbia, Canada** (latitude 49.2827, longitude -123.1207) upon launch.

3. **Current Weather Conditions**
   - Real-time temperature, apparent ("feels like") temperature, and today's high/low.
   - WMO weather condition code interpretation with contextual daytime/nighttime icons.
   - Core atmospheric metrics: wind speed and gusts, relative humidity, precipitation, UV radiation index, and barometric pressure.

4. **7-Day High-Resolution Forecast**
   - Day-by-day forecast cards showing maximum/minimum temperatures with visual temperature range indicators.
   - Precipitation probability percentage and accumulated rainfall estimates (mm).
   - Daily peak wind speed and maximum UV index.

5. **Interactive Meteorological Charts**
   - Responsive charts powered by Recharts:
     - **7-Day Temperature Trend**: Smooth area/line curves tracking daily highs and lows.
     - **Precipitation & Probability**: Dual-axis composed chart illustrating rain probability (%) and rainfall accumulation (mm).
     - **24-Hour Hourly Timeline**: Detailed hourly thermal and precipitation forecasts.

6. **Deterministic Weather Intelligence Engine**
   - 100% deterministic, rule-based recommendation logic (no GenAI, no LLMs, zero hallucination).
   - Automated hazard warnings (thunderstorms, snow/ice, heavy downpours, extreme heat, freeze alerts).
   - Dynamic attire and gear guide tailored to thermal and precipitation conditions.
   - Activity Suitability Index: Calculated readiness scores (0–100) for running, road cycling, patio dining, hiking, and daily commuting.

7. **Unit Flexibility & Resilience**
   - Instant toggle between Metric (°C, km/h) and Imperial (°F, mph) measurement units.
   - Comprehensive loading skeleton animations and network retry error banners.

---

## Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS v4
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Hosting Target**: Cloudflare Pages / Static Hosting

---

## APIs Used

This application exclusively queries free, public Open-Meteo APIs:

1. **Geocoding Search API**:
   - `GET https://geocoding-api.open-meteo.com/v1/search?name={query}&count=10&language=en&format=json`
2. **Weather Forecast API**:
   - `GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current={params}&hourly={params}&daily={params}&timezone=auto`

*Note: No API keys, credentials, or private access tokens are required.*

---

## Local Development & Setup

### Prerequisites
- Node.js 18.0.0 or later
- npm 9.0.0 or later

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/weather-intelligence.git
   cd weather-intelligence
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. Verify code quality & types:
   ```bash
   npm run lint
   ```

5. Create production build:
   ```bash
   npm run build
   ```
   The compiled static files are output to the `dist/` directory.

---

## Deployment Instructions (Google AI Studio → GitHub → Cloudflare Pages)

Because Weather Intelligence is a pure client-side Single Page Application (SPA), it is 100% compatible with Cloudflare Pages free static hosting.

### Step 1: Push to GitHub
1. Create a new repository on GitHub (e.g., `weather-intelligence`).
2. Commit and push your local files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Complete Weather Intelligence Application"
   git branch -M main
   git remote add origin https://github.com/{your-username}/weather-intelligence.git
   git push -u origin main
   ```

### Step 2: Connect to Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the sidebar, navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your GitHub account and choose the `weather-intelligence` repository.

### Step 3: Configure Build Settings
Fill in the build configuration fields:
- **Project name**: `weather-intelligence`
- **Production branch**: `main`
- **Framework preset**: `Vite` (or `None`)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty or default)
- **Environment variables**: *None required.* Leave completely blank.

### Step 4: Deploy
Click **Save and Deploy**. Cloudflare Pages will execute `npm install` and `npm run build`, generating your live static site within seconds at `https://weather-intelligence.pages.dev`.

---

## Architecture & Compliance Verification

- [x] **Zero Gemini / GenAI APIs**: All recommendations are computed through rule-based logic in `src/utils/weatherIntelligence.ts`.
- [x] **Zero Google Cloud / Firebase dependencies**: No cloud backend or databases initialized.
- [x] **Zero Secrets / API Keys**: Public Open-Meteo endpoints only.
- [x] **Zero Private / Customer Data**: No tracking or storage of user information.
- [x] **100% Client-Side SPA**: Direct browser-to-API requests with standard static `dist/` build output.
