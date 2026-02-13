import { describe, it, expect, vi } from 'vitest';
import { aemoFetch } from './client';

describe('aemoFetch', () => {
  it('constructs URL with /api prefix', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: 'ok' }), { status: 200 }),
    );

    await aemoFetch('/NEM/v1/PWS/NEMDashboard/elecSummary');

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/NEM/v1/PWS/NEMDashboard/elecSummary');
    fetchSpy.mockRestore();
  });

  it('appends query params to URL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: 'ok' }), { status: 200 }),
    );

    await aemoFetch('/NEM/v1/PWS/NEMDashboard/priceAndDemand', {
      region: 'NSW1',
      TimeScale: '5MIN',
    });

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain('region=NSW1');
    expect(calledUrl).toContain('TimeScale=5MIN');
    fetchSpy.mockRestore();
  });

  it('sends x-api-key header', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: 'ok' }), { status: 200 }),
    );

    await aemoFetch('/NEM/v1/PWS/NEMDashboard/elecSummary');

    const headers = fetchSpy.mock.calls[0][1]?.headers as Record<string, string>;
    expect(headers).toHaveProperty('x-api-key');
    fetchSpy.mockRestore();
  });

  it('throws on non-ok response', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Not Found', { status: 404, statusText: 'Not Found' }),
    );

    await expect(aemoFetch('/bad/path')).rejects.toThrow('AEMO API error: 404 Not Found');
    fetchSpy.mockRestore();
  });

  it('parses JSON response', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { items: [1, 2, 3] } }), { status: 200 }),
    );

    const result = await aemoFetch<{ data: { items: number[] } }>('/test');
    expect(result.data.items).toEqual([1, 2, 3]);
    fetchSpy.mockRestore();
  });
});
