// Watchlist.tsx
"use client"
import React, { useState } from "react";
import TradingViewWidget from "@/components/TVAdvChart";
import { nifty50Symbols } from "@/Nifty50Symbols";
import { Header } from "@/components/header";

function Watchlist() {
  const [inputValue, setInputValue] = useState("");
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(["HDFCLIFE","ASIANPAINT","ADANIPORTS","KOTAKBANK"]);

  const handleAddSymbol = () => {
    const symbol = inputValue.trim().toUpperCase();
    
    // Validate symbol exists in Nifty50
    if (!nifty50Symbols.includes(symbol)) {
      alert(`Symbol "${symbol}" is not available in Nifty 50. Please enter a valid symbol.`);
      return;
    }

    // Check if symbol already exists in watchlist
    if (watchlistSymbols.includes(symbol)) {
      alert(`Symbol "${symbol}" is already in your watchlist.`);
      return;
    }

    // Add symbol to watchlist
    setWatchlistSymbols(prev => [...prev, symbol]);
    setInputValue(""); // Clear input
  };

  const handleRemoveSymbol = (symbolToRemove: string) => {
    setWatchlistSymbols(prev => prev.filter(symbol => symbol !== symbolToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSymbol();
    }
  };

  return (
    <>
        <Header/>             
    <div className="p-6">
      <div className="dark-card p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">Stock Watchlist</h1>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter Nifty 50 symbol (e.g., RELIANCE, TCS)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-field flex-1"
          />
          <button
            onClick={handleAddSymbol}
            className="primary-button"
          >
            Add Symbol
          </button>
        </div>
        <p className="text-gray-500 text-sm">
          Available symbols: {nifty50Symbols.slice(0, 10).join(", ")}... and more
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {watchlistSymbols.map((symbol) => (
          <div key={symbol} className="dark-card p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{symbol}</h3>
              <button
                onClick={() => handleRemoveSymbol(symbol)}
                className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                title="Remove from watchlist"
              >
                ×
              </button>
            </div>
            <div className="h-96 border border-gray-800 rounded-lg overflow-hidden">
              <TradingViewWidget symbol={symbol} />
            </div>
          </div>
        ))}
      </div>

      {watchlistSymbols.length === 0 && (
        <div className="text-center text-gray-400 mt-12 text-lg">
          No symbols in watchlist. Add some symbols to get started!
        </div>
      )}
    </div>
    </>
  );
}

export default Watchlist;
