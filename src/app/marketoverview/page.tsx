"use client"
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Header } from '@/components/header';

// TypeScript interfaces for API response
interface StockData {
  ticker_id: string;
  company_name: string;
  price: string;
  percent_change: string;
  net_change: string;
  bid: string;
  ask: string;
  high: string;
  low: string;
  open: string;
  low_circuit_limit: string;
  up_circuit_limit: string;
  volume: string;
  date: string;
  time: string;
  close: string;
  bid_size: string;
  ask_size: string;
  exchange_type: string;
  lot_size: string;
  overall_rating: string;
  short_term_trends: string;
  long_term_trends: string;
  year_low: string;
  year_high: string;
  ric: string;
}

interface TrendingStocks {
  top_gainers: StockData[];
  top_losers: StockData[];
}

interface ApiResponse {
  trending_stocks: TrendingStocks;
}

export default function MarketOverview() {
  const [marketData, setMarketData] = useState<TrendingStocks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://stock.indianapi.in/trending`,{
        headers:{
          'X-API-KEY': "sk-live-lOeu1A68LnXNz3d0Tav3j3SWijdNn76933lH0o5l" 
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = response.data;
      setMarketData(data.trending_stocks);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Auto-refresh every 30 seconds
    // const interval = setInterval(fetchMarketData, 30000);
    
    // return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: string) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  const formatChange = (change: string) => {
    const value = parseFloat(change);
    return value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  };

  const formatPercentChange = (percent: string) => {
    const value = parseFloat(percent);
    return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  const getTickerSymbol = (ric: string) => {
    return ric.split('.')[0];
  };

  if (error) {
    return (
      <>
      <Header/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 p-6">
        <div className="dark-card p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={fetchMarketData}
                className="primary-button flex items-center mx-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <Header/>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 p-6">
      {/* Top Gainers */}
      <div className="dark-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Top Gainers</h3>
          <div className="flex items-center space-x-2">
            {loading && <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />}
            <button
              onClick={fetchMarketData}
              className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {lastUpdated && (
          <p className="text-xs text-gray-500 mb-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
            </div>
          ) : marketData?.top_gainers ? (
            marketData.top_gainers.slice(0, 5).map((stock) => (
              <div key={stock.ticker_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <div className="flex-1">
                  <p className="text-white font-medium">{getTickerSymbol(stock.ric)}</p>
                  <p className="text-gray-400 text-sm truncate">{stock.company_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{formatPrice(stock.price)}</p>
                  <div className="flex items-center text-sm text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {formatChange(stock.net_change)} ({formatPercentChange(stock.percent_change)})
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Top Losers */}
      <div className="dark-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Top Losers</h3>
          <div className="flex items-center space-x-2">
            {loading && <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />}
            <button
              onClick={fetchMarketData}
              className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {lastUpdated && (
          <p className="text-xs text-gray-500 mb-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
            </div>
          ) : marketData?.top_losers ? (
            marketData.top_losers.slice(0, 5).map((stock) => (
              <div key={stock.ticker_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <div className="flex-1">
                  <p className="text-white font-medium">{getTickerSymbol(stock.ric)}</p>
                  <p className="text-gray-400 text-sm truncate">{stock.company_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{formatPrice(stock.price)}</p>
                  <div className="flex items-center text-sm text-red-400">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {formatChange(stock.net_change)} ({formatPercentChange(stock.percent_change)})
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}