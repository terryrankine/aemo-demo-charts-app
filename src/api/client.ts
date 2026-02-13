import { logger } from '../lib/logger';

const API_KEY = import.meta.env.VITE_AEMO_API_KEY ?? '';

export async function aemoFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, window.location.origin);
  url.pathname = `/api${path}`;
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const start = performance.now();
  const res = await fetch(url.toString(), {
    headers: { 'x-api-key': API_KEY },
  });
  const duration = Math.round(performance.now() - start);

  if (!res.ok) {
    logger.error('API request failed', { path, status: res.status, duration });
    throw new Error(`AEMO API error: ${res.status} ${res.statusText}`);
  }

  logger.debug('API request completed', { path, status: res.status, duration });
  return res.json();
}

// NEM endpoints
export const nem = {
  elecSummary: () =>
    aemoFetch<any>('/NEM/v1/PWS/NEMDashboard/elecSummary'),

  priceAndDemand: (region: string, timeScale: '5MIN' | '30MIN' = '5MIN') =>
    aemoFetch<any>('/NEM/v1/PWS/NEMDashboard/priceAndDemand', { region, TimeScale: timeScale }),

  fuelMix: (region: string, type: string = 'CURRENT') =>
    aemoFetch<any>('/NEM/v1/PWS/NEMDashboard/fuelMix', { region, Type: type }),

  renewablePenetration: (region: string) =>
    aemoFetch<any>('/NEM/v1/PWS/NEMDashboard/renewablePenetration', { region }),

  dailyAveragePrices: (year: string, month: string) =>
    aemoFetch<any>('/NEM/v1/PWS/NEMDashboard/dailyAveragePrices', { year, month }),

  monthlyAveragePrices: (year: string, month: string) =>
    aemoFetch<any>('/NEM/v1/PWS/NEMDashboard/monthlyAveragePrices', { year, month }),

  annualAveragePrices: () =>
    aemoFetch<any>('/NEM/v1/PWS/NEMDashboard/annualAveragePrices'),

};

// WEM endpoints
export const wem = {
  marketPulse: () =>
    aemoFetch<any>('/WEM/v1/PWS/WEMDashboard/marketPulse'),
};
