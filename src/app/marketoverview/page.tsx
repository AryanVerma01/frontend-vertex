"use client"
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, BarChart3, Activity } from 'lucide-react';
import axios from 'axios';
import { Header } from '@/components/header';
import 'dotenv/config'

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

interface HighLowStock {
  ticker: string;
  company: string;
  price: number;
  '52_week_high'?: number;
  '52_week_low'?: number;
}

interface WeekHighLowData {
  high52Week: HighLowStock[];
  low52Week: HighLowStock[];
}

interface HighLowResponse {
  BSE_52WeekHighLow: WeekHighLowData;
  NSE_52WeekHighLow: WeekHighLowData;
}

interface ApiResponse {
  trending_stocks: TrendingStocks;
}

export default function MarketOverview() {
  const [marketData, setMarketData] = useState<TrendingStocks | null>(null);
  const [highLowData, setHighLowData] = useState<HighLowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [highLowLoading, setHighLowLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highLowError, setHighLowError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeExchange, setActiveExchange] = useState<'BSE' | 'NSE'>('NSE');

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://stock.indianapi.in/trending`,{
        headers:{
          'X-API-KEY': process.env.NEXT_PUBLIC_X_API_KEY
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

  const fetchHighLowData = async () => {
    try {
      setHighLowLoading(true);
      setHighLowError(null);
      const response = await axios.get(`https://stock.indianapi.in/fetch_52_week_high_low_data`,{
        headers:{
          'X-API-KEY': process.env.NEXT_PUBLIC_X_API_KEY
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: HighLowResponse = response.data;
      setHighLowData(data);
    } catch (err) {
      setHighLowError(err instanceof Error ? err.message : 'Failed to fetch 52-week high/low data');
      console.error('Error fetching 52-week high/low data:', err);
    } finally {
      setHighLowLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    fetchHighLowData();
  }, []);

  const refreshAllData = () => {
    fetchMarketData();
    fetchHighLowData();
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `₹${numPrice.toFixed(2)}`;
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

  const calculatePercentDiff = (current: number, reference: number) => {
    const diff = ((current - reference) / reference) * 100;
    return diff.toFixed(2);
  };

  if (error && highLowError) {
    return (
      <>
      <Header/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 p-6">
        <div className="dark-card p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
              <p className="text-gray-400 mb-4">{error || highLowError}</p>
              <button
                onClick={refreshAllData}
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
    <div className="space-y-6 p-6">
      {/* Top Gainers and Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="dark-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Top Gainers</h3>
            <div className="flex items-center space-x-2">
              {loading && <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />}
              <button
                onClick={refreshAllData}
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-neutral-800"
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
                <div key={stock.ticker_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors">
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
                {error ? 'Error loading data' : 'No data available'}
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
                onClick={refreshAllData}
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-900"
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
                <div key={stock.ticker_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors">
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
                {error ? 'Error loading data' : 'No data available'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 52-Week High/Low Section */}
      <div className="dark-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">52-Week High/Low</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Exchange Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveExchange('NSE')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeExchange === 'NSE'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                NSE
              </button>
              <button
                onClick={() => setActiveExchange('BSE')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeExchange === 'BSE'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                BSE
              </button>
            </div>
            
            {highLowLoading && <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />}
            <button
              onClick={refreshAllData}
              className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 52-Week Highs */}
          <div>
            <div className="flex items-center mb-4">
              <Activity className="h-5 w-5 text-green-400 mr-2" />
              <h4 className="text-lg font-semibold text-white">52-Week Highs</h4>
            </div>
            
            <div className="space-y-3">
              {highLowLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                </div>
              ) : highLowData && highLowData[`${activeExchange}_52WeekHighLow`]?.high52Week ? (
                highLowData[`${activeExchange}_52WeekHighLow`].high52Week.slice(0, 6).map((stock, index) => (
                  <div key={`${stock.ticker}-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors">
                    <div className="flex-1">
                      <p className="text-white font-medium">{stock.ticker.split('.')[0]}</p>
                      <p className="text-gray-400 text-sm truncate">{stock.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatPrice(stock.price)}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="mr-2">High: {formatPrice(stock['52_week_high'] || 0)}</span>
                        {stock['52_week_high'] && (
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            parseFloat(calculatePercentDiff(stock.price, stock['52_week_high'])) >= -5
                              ? 'text-green-400 bg-green-400/10'
                              : 'text-yellow-400 bg-yellow-400/10'
                          }`}>
                            {calculatePercentDiff(stock.price, stock['52_week_high'])}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {highLowError ? 'Error loading data' : 'No data available'}
                </div>
              )}
            </div>
          </div>

          {/* 52-Week Lows */}
          <div>
            <div className="flex items-center mb-4">
              <Activity className="h-5 w-5 text-red-400 mr-2" />
              <h4 className="text-lg font-semibold text-white">52-Week Lows</h4>
            </div>
            
            <div className="space-y-3">
              {highLowLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                </div>
              ) : highLowData && highLowData[`${activeExchange}_52WeekHighLow`]?.low52Week ? (
                highLowData[`${activeExchange}_52WeekHighLow`].low52Week.slice(0, 6).map((stock, index) => (
                  <div key={`${stock.ticker}-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors">
                    <div className="flex-1">
                      <p className="text-white font-medium">{stock.ticker.split('.')[0]}</p>
                      <p className="text-gray-400 text-sm truncate">{stock.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatPrice(stock.price)}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="mr-2">Low: {formatPrice(stock['52_week_low'] || 0)}</span>
                        {stock['52_week_low'] && (
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            parseFloat(calculatePercentDiff(stock.price, stock['52_week_low'])) >= 20
                              ? 'text-green-400 bg-green-400/10'
                              : 'text-orange-400 bg-orange-400/10'
                          }`}>
                            +{calculatePercentDiff(stock.price, stock['52_week_low'])}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {highLowError ? 'Error loading data' : 'No data available'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}