import { http, HttpResponse } from 'msw';

// Realistic fixture data matching AEMO API response shapes

const elecSummaryResponse = {
  data: {
    summary: [
      {
        regionId: 'NSW1',
        price: 85.42,
        totalDemand: 8500,
        scheduledGeneration: 7200,
        semischeduledGeneration: 1800,
        netInterchange: -500,
        interconnectorFlows: JSON.stringify([
          { name: 'NSW1-QLD1', value: 300, exportlimit: 1200, importlimit: -800 },
          { name: 'VIC1-NSW1', value: -200, exportlimit: 1600, importlimit: -1000 },
        ]),
      },
      {
        regionId: 'QLD1',
        price: 72.15,
        totalDemand: 6200,
        scheduledGeneration: 5800,
        semischeduledGeneration: 900,
        netInterchange: 300,
        interconnectorFlows: JSON.stringify([
          { name: 'NSW1-QLD1', value: -300, exportlimit: 800, importlimit: -1200 },
        ]),
      },
      {
        regionId: 'VIC1',
        price: 45.30,
        totalDemand: 5100,
        scheduledGeneration: 4200,
        semischeduledGeneration: 1200,
        netInterchange: 200,
        interconnectorFlows: JSON.stringify([
          { name: 'VIC1-NSW1', value: 200, exportlimit: 1000, importlimit: -1600 },
          { name: 'V-SA', value: -150, exportlimit: 600, importlimit: -500 },
          { name: 'T-V-MNSP1', value: 100, exportlimit: 600, importlimit: -500 },
        ]),
      },
      {
        regionId: 'SA1',
        price: -12.50,
        totalDemand: 1800,
        scheduledGeneration: 800,
        semischeduledGeneration: 1200,
        netInterchange: -200,
        interconnectorFlows: JSON.stringify([
          { name: 'V-SA', value: 150, exportlimit: 500, importlimit: -600 },
        ]),
      },
      {
        regionId: 'TAS1',
        price: 55.00,
        totalDemand: 1100,
        scheduledGeneration: 900,
        semischeduledGeneration: 300,
        netInterchange: -100,
        interconnectorFlows: JSON.stringify([
          { name: 'T-V-MNSP1', value: -100, exportlimit: 500, importlimit: -600 },
        ]),
      },
    ],
  },
};

const priceAndDemandResponse = {
  data: {
    items: [
      { settlementDate: '2025-01-15T10:00:00', rrp: 85.42, totalDemand: 8500, scheduledGeneration: 7200, semiScheduledGeneration: 1800, netInterchange: -500 },
      { settlementDate: '2025-01-15T10:05:00', rrp: 87.10, totalDemand: 8600, scheduledGeneration: 7300, semiScheduledGeneration: 1850, netInterchange: -550 },
      { settlementDate: '2025-01-15T10:10:00', rrp: 82.30, totalDemand: 8400, scheduledGeneration: 7100, semiScheduledGeneration: 1750, netInterchange: -450 },
    ],
  },
};

const fuelMixResponse = {
  data: {
    items: [
      { fuelType: 'Black Coal', state: 'NSW1', supply: 4200 },
      { fuelType: 'Solar', state: 'NSW1', supply: 1800 },
      { fuelType: 'Wind', state: 'NSW1', supply: 900 },
      { fuelType: 'Gas', state: 'NSW1', supply: 600 },
      { fuelType: 'Hydro', state: 'NSW1', supply: 400 },
      { fuelType: 'Black Coal', state: 'QLD1', supply: 3800 },
      { fuelType: 'Solar', state: 'QLD1', supply: 2200 },
      { fuelType: 'Gas', state: 'QLD1', supply: 500 },
    ],
  },
};

const renewablePenetrationResponse = {
  data: {
    items: [
      { type: 'Max', fuelType: 'Black Coal', supply: 2000, dateTime: '2025-01-15T13:00:00' },
      { type: 'Max', fuelType: 'Solar', supply: 4500, dateTime: '2025-01-15T13:00:00' },
      { type: 'Max', fuelType: 'Wind', supply: 2200, dateTime: '2025-01-15T13:00:00' },
      { type: 'Max', fuelType: 'Hydro', supply: 800, dateTime: '2025-01-15T13:00:00' },
      { type: 'Min', fuelType: 'Black Coal', supply: 5000, dateTime: '2025-01-15T03:00:00' },
      { type: 'Min', fuelType: 'Solar', supply: 0, dateTime: '2025-01-15T03:00:00' },
      { type: 'Min', fuelType: 'Wind', supply: 800, dateTime: '2025-01-15T03:00:00' },
      { type: 'Min', fuelType: 'Gas', supply: 1200, dateTime: '2025-01-15T03:00:00' },
    ],
  },
};

const dailyAveragePricesResponse = {
  data: {
    items: [
      { day: '2025-01-13', regionId: 'NSW1', avgRrp: '78.50', peakRrp: '120.30' },
      { day: '2025-01-14', regionId: 'NSW1', avgRrp: '82.10', peakRrp: '135.40' },
      { day: '2025-01-13', regionId: 'QLD1', avgRrp: '65.20', peakRrp: '98.70' },
    ],
  },
};

const monthlyAveragePricesResponse = {
  data: {
    items: [
      { month: '2025-01', regionId: 'NSW1', avgRrp: '75.80', peakRrp: '112.00' },
      { month: '2024-12', regionId: 'NSW1', avgRrp: '68.40', peakRrp: '105.50' },
    ],
  },
};

const annualAveragePricesResponse = {
  data: {
    items: [
      { year: '2025', regionId: 'NSW1', avgRrp: '80.00', peakRrp: '140.00' },
      { year: '2024', regionId: 'NSW1', avgRrp: '72.50', peakRrp: '130.00' },
    ],
  },
};

const marketPulseResponse = {
  data: {
    items: [
      {
        tradingDayInterval: '2025-01-15T10:00:00',
        price: 65.20,
        forecastMw: 3200,
        forecastEoiMw: 3150,
        actualTotalGeneration: 3100,
        actualNsgMw: 450,
        forecastNsgMw: 440,
        rtdTotalGeneration: 3080,
        totalOutageMw: 320,
        plannedOutageMw: 200,
        forcedOutageMw: 120,
      },
      {
        tradingDayInterval: '2025-01-15T10:30:00',
        price: 67.80,
        forecastMw: 3250,
        actualTotalGeneration: null,
        actualNsgMw: null,
        forecastNsgMw: 460,
        rtdTotalGeneration: 3120,
        totalOutageMw: 310,
        plannedOutageMw: 190,
        forcedOutageMw: 120,
      },
    ],
  },
};

export const handlers = [
  http.get('/api/NEM/v1/PWS/NEMDashboard/elecSummary', () => {
    return HttpResponse.json(elecSummaryResponse);
  }),

  http.get('/api/NEM/v1/PWS/NEMDashboard/priceAndDemand', () => {
    return HttpResponse.json(priceAndDemandResponse);
  }),

  http.get('/api/NEM/v1/PWS/NEMDashboard/fuelMix', () => {
    return HttpResponse.json(fuelMixResponse);
  }),

  http.get('/api/NEM/v1/PWS/NEMDashboard/renewablePenetration', () => {
    return HttpResponse.json(renewablePenetrationResponse);
  }),

  http.get('/api/NEM/v1/PWS/NEMDashboard/dailyAveragePrices', () => {
    return HttpResponse.json(dailyAveragePricesResponse);
  }),

  http.get('/api/NEM/v1/PWS/NEMDashboard/monthlyAveragePrices', () => {
    return HttpResponse.json(monthlyAveragePricesResponse);
  }),

  http.get('/api/NEM/v1/PWS/NEMDashboard/annualAveragePrices', () => {
    return HttpResponse.json(annualAveragePricesResponse);
  }),

  http.get('/api/WEM/v1/PWS/WEMDashboard/marketPulse', () => {
    return HttpResponse.json(marketPulseResponse);
  }),
];
