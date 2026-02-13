# AEMOVis

[![CI](https://github.com/terryr/aemo-demo-charts-app/actions/workflows/ci.yml/badge.svg)](https://github.com/terryr/aemo-demo-charts-app/actions/workflows/ci.yml)

Real-time dashboard for Australia's National Electricity Market (NEM) and Wholesale Electricity Market (WEM). Built with React, TypeScript, and ECharts, it visualises live spot prices, demand, fuel mix, renewable penetration, interconnector flows, and historical trends — all sourced from AEMO's public API.

AEMOVis is designed for energy analysts, traders, and anyone curious about the Australian electricity grid. It auto-refreshes every 5 minutes and supports region comparison, multiple time scales, and dark/light themes.

## Features

- **Live NEM Overview** — spot prices, demand, and generation across all 5 NEM regions
- **Interconnector Flow Map** — SVG map showing real-time MW flows between regions
- **Price & Demand Charts** — dual-axis time series with 5-min and 30-min resolution
- **Fuel Mix Breakdown** — horizontal bar charts with current, 24h, 48h, 3-month, and 12-month views
- **Renewable Penetration Gauge** — real-time renewable percentage with min/max tracking
- **Region Comparison** — overlay or split-view comparison of any two NEM regions
- **Historical Prices** — daily, monthly, and annual average price trends
- **WEM Market Pulse** — Western Australia wholesale market data (price, generation, outages)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build | Vite 7.3 |
| Charts | ECharts 6 + echarts-for-react |
| Data Fetching | TanStack Query 5 |
| Routing | React Router 7 |
| Testing | Vitest + Testing Library + MSW |
| Component Catalog | Storybook 10 |
| Observability | OpenTelemetry (optional) |

## Data Sources

### NEM Endpoints

| Endpoint | Hook | Description |
|----------|------|-------------|
| `/NEM/v1/PWS/NEMDashboard/elecSummary` | `useElecSummary` | Region prices, demand, generation, interconnector flows |
| `/NEM/v1/PWS/NEMDashboard/priceAndDemand` | `usePriceAndDemand` | Time series price & demand by region |
| `/NEM/v1/PWS/NEMDashboard/fuelMix` | `useFuelMix` | Generation by fuel type |
| `/NEM/v1/PWS/NEMDashboard/renewablePenetration` | `useRenewablePenetration` | Renewable % with min/max |
| `/NEM/v1/PWS/NEMDashboard/dailyAveragePrices` | `useDailyAveragePrices` | Daily average RRP |
| `/NEM/v1/PWS/NEMDashboard/monthlyAveragePrices` | `useMonthlyAveragePrices` | Monthly average RRP |
| `/NEM/v1/PWS/NEMDashboard/annualAveragePrices` | `useAnnualAveragePrices` | Annual average RRP |

### WEM Endpoint

| Endpoint | Hook | Description |
|----------|------|-------------|
| `/WEM/v1/PWS/WEMDashboard/marketPulse` | `useMarketPulse` | WA price, generation, outages |

All requests are proxied through `/api` in development (via Vite proxy) to avoid CORS. An optional `VITE_AEMO_API_KEY` is sent as `x-api-key` header.

## Caching Strategy

| Hook | staleTime | refetchInterval | Rationale |
|------|-----------|-----------------|-----------|
| `useElecSummary` | 5 min | 5 min | Matches AEMO's dispatch interval |
| `usePriceAndDemand` | 5 min | — | On-demand per region/scale |
| `useFuelMix` | 5 min | — | On-demand per region/period |
| `useRenewablePenetration` | 5 min | — | On-demand per region |
| `useDailyAveragePrices` | 1 hour | — | Historical data, slow-moving |
| `useMonthlyAveragePrices` | 1 hour | — | Historical data, slow-moving |
| `useAnnualAveragePrices` | 1 hour | — | Historical data, slow-moving |
| `useMarketPulse` | 5 min | 5 min | Matches WEM dispatch interval |

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Setup

```bash
git clone https://github.com/terryr/aemo-demo-charts-app.git
cd aemo-demo-charts-app
npm install
```

### Environment

Create a `.env.local` file (optional):

```env
VITE_AEMO_API_KEY=your-api-key-here
```

The API key is optional — AEMO's public dashboard endpoints work without authentication for reasonable request volumes.

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`. The Vite dev server proxies `/api/*` requests to `https://dashboards.public.aemo.com.au`.

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. The built app needs a reverse proxy to forward `/api/*` to AEMO.

### Nginx proxy config

```nginx
location /api/ {
    proxy_pass https://dashboards.public.aemo.com.au/;
    proxy_set_header Host dashboards.public.aemo.com.au;
    proxy_ssl_server_name on;
}
```

### Caddy proxy config

```caddy
handle /api/* {
    uri strip_prefix /api
    reverse_proxy https://dashboards.public.aemo.com.au {
        header_up Host dashboards.public.aemo.com.au
    }
}
```

## Testing

```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage report
npm run test:ui       # Vitest UI
npm run typecheck     # TypeScript type checking
```

Coverage reports are generated in `coverage/` (HTML + LCOV).

## Storybook

```bash
npm run storybook        # Dev server on port 6006
npm run build-storybook  # Static build to storybook-static/
```

## Logging & Observability

### Structured Logger

AEMOVis includes a lightweight structured logger (`src/lib/logger.ts`) that:
- Outputs structured JSON in production, pretty console in development
- Logs API request durations and errors
- Configurable via `VITE_LOG_LEVEL` env var (default: `info` in prod, `debug` in dev)

### OpenTelemetry (optional)

Set `VITE_OTLP_ENDPOINT` to enable automatic trace collection:

```env
VITE_OTLP_ENDPOINT=http://localhost:4318
```

When set, the app will:
- Auto-instrument all `fetch` requests with trace context
- Export traces via OTLP/HTTP to the configured endpoint
- When unset, the OTel code tree-shakes out of the production bundle

## Project Structure

```
src/
├── api/
│   ├── client.ts          # aemoFetch() + endpoint helpers
│   └── types.ts           # TypeScript interfaces + region constants
├── components/
│   ├── charts/
│   │   ├── DualAxisChart   # Price & demand time series
│   │   ├── FlowMap         # SVG interconnector map
│   │   ├── HorizontalBar   # Fuel mix bar chart
│   │   ├── KpiCard         # Key metric display card
│   │   └── RenewableGauge  # ECharts gauge for renewables %
│   ├── controls/
│   │   ├── CompareToggle   # Region comparison on/off
│   │   ├── RegionSelector  # NEM region picker
│   │   ├── TimeRangePicker # Fuel mix period selector
│   │   ├── TimeScaleToggle # 5MIN/30MIN switch
│   │   └── ViewModeToggle  # Overlay/split view
│   ├── layout/
│   │   ├── AppLayout       # Main layout with sidebar
│   │   └── Sidebar         # Navigation sidebar
│   └── ErrorBoundary       # React error boundary
├── hooks/
│   ├── useElecSummary      # NEM summary + interconnectors
│   ├── usePriceAndDemand   # Price & demand time series
│   ├── useFuelMix          # Fuel mix by region/period
│   ├── useRenewablePenetration  # Renewable % gauge data
│   ├── useAveragePrices    # Daily/monthly/annual prices
│   └── useMarketPulse      # WEM market data
├── lib/
│   ├── logger.ts           # Structured logging
│   └── telemetry.ts        # Optional OpenTelemetry
├── pages/                  # Route-level page components
├── test/
│   ├── setup.ts            # Vitest setup (jest-dom + MSW)
│   ├── test-utils.tsx      # renderWithProviders helper
│   └── mocks/
│       ├── handlers.ts     # MSW request handlers
│       └── server.ts       # MSW server setup
└── theme/
    ├── ThemeContext         # Dark/light theme provider
    ├── fuel-colors          # Fuel type colors + helpers
    └── echarts-theme        # ECharts theme config
```

## License

MIT
