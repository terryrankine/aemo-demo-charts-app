import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';
import OverviewPage from './pages/OverviewPage';
import PriceDemandPage from './pages/PriceDemandPage';
import FuelMixPage from './pages/FuelMixPage';
import RenewablesPage from './pages/RenewablesPage';
import InterconnectorsPage from './pages/InterconnectorsPage';
import HistoricalPage from './pages/HistoricalPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="price-demand" element={<PriceDemandPage />} />
                <Route path="fuel-mix" element={<FuelMixPage />} />
                <Route path="renewables" element={<RenewablesPage />} />
                <Route path="interconnectors" element={<InterconnectorsPage />} />
                <Route path="historical" element={<HistoricalPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
