"use client"

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Building, ChevronDown, ChevronUp } from 'lucide-react';

const FinancialResearchDashboard = ({ stockData }:any) => {
  const [expandedSections, setExpandedSections] = useState({
    peers: false,
    companyInfo: false
  });

  // Default data structure if no props provided (for demo purposes)
  const defaultStockData = {
    stockDetailsReusableData: {
      close: "171.50",
      date: "22 Sep 2025",
      time: "10:26:15",
      price: "167.45",
      percentChange: "-2.81",
      yhigh: "174.35",
      ylow: "122.60",
      high: "172.20",
      low: "170.40",
      NetIncome: "3420.51",
      averageRating: "Buy",
      peerCompanyList: [
        {
          tickerId: "S0003097",
          companyName: "Jsw Steel",
          price: 1130.4,
          percentChange: -1.62,
          netChange: -18.65,
          returnOnAverageEquityTrailing12Month: 4.46,
          netProfitMarginPercentTrailing12Month: 2.07,
          totalSharesOutstanding: 244.61,
          languageSupport: "JSW स्टील",
          imageUrl: "https://logo.clearbit.com/jsw.in/",
          overallRating: "Bullish",
          yhigh: 1161.05,
          ylow: 879.6
        },
        {
          tickerId: "S0003026",
          companyName: "Tata Steel",
          price: 167.45,
          percentChange: -2.81,
          netChange: -4.85,
          returnOnAverageEquityTrailing12Month: 3.73,
          netProfitMarginPercentTrailing12Month: 1.45,
          totalSharesOutstanding: 1248.71,
          languageSupport: "टाटा स्टील",
          imageUrl: "https://logo.clearbit.com/tatasteel.com/",
          overallRating: "Bullish",
          yhigh: 174.35,
          ylow: 122.6
        },
        {
          tickerId: "S0003069",
          companyName: "Jindal Steel And Power",
          price: 1029.6,
          percentChange: -2.12,
          netChange: -22.3,
          returnOnAverageEquityTrailing12Month: 6.15,
          netProfitMarginPercentTrailing12Month: 5.74,
          totalSharesOutstanding: 101.84,
          languageSupport: "जिंदल स्टील और पावर",
          imageUrl: "https://logo.clearbit.com/jindalsteelpower.com/",
          overallRating: "Bullish",
          yhigh: 1070,
          ylow: 723.95
        }
      ]
    },
  };

  // Use props data if provided, otherwise use default data
  const data = stockData || defaultStockData;

  const toggleSection = (section:any) => {
    setExpandedSections(prev => ({
      ...prev,
      //@ts-ignore
      [section]: !prev[section]
    }));
  };

  //@ts-ignore
  const formatCurrency = (value) => {
    return `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Financial Research Dashboard</h1>
          <p className="text-gray-300">Real-time stock analysis and corporate insights</p>
        </div>

        {/* Main Stock Card */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-700 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">{data.companyName || "Tata Steel"}</h2>
              <p className="text-gray-300">{data.companyProfile?.exchangeCodeNse || "TATASTEEL"} • {data.industry || "Steel Sector"}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{formatCurrency((data.currentPrice?.NSE ?? data.stockDetailsReusableData?.price ?? 0))}</div>
              <div className={`flex items-center gap-1 ${parseFloat((data.percentChange ?? data.stockDetailsReusableData?.percentChange ?? '0') as string) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat((data.percentChange ?? data.stockDetailsReusableData?.percentChange ?? '0') as string) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{(data.percentChange ?? data.stockDetailsReusableData?.percentChange ?? '0')}%</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid - Simplified */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-400" size={20} />
                <span className="text-gray-300 text-sm">52W High</span>
              </div>
              <div className="text-xl font-semibold text-white">{formatCurrency((data.yearHigh ?? data.stockDetailsReusableData?.yhigh ?? 0))}</div>
            </div>

            <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="text-red-400" size={20} />
                <span className="text-gray-300 text-sm">52W Low</span>
              </div>
              <div className="text-xl font-semibold text-white">{formatCurrency((data.yearLow ?? data.stockDetailsReusableData?.ylow ?? 0))}</div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl mb-8">
          <div 
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => toggleSection('companyInfo')}
          >
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Building className="text-blue-400" />
              Company Information
            </h3>
            {expandedSections.companyInfo ? <ChevronUp className="text-gray-300" /> : <ChevronDown className="text-gray-300" />}
          </div>
          
          {expandedSections.companyInfo && data.companyProfile && (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
                <div className="text-gray-300 text-sm mb-2">Industry & Exchange</div>
                <div className="text-white font-semibold">{data.companyProfile?.mgIndustry ?? '—'}</div>
                <div className="text-gray-300 text-sm mt-1">BSE: {data.companyProfile?.exchangeCodeBse ?? '—'} | NSE: {data.companyProfile?.exchangeCodeNse ?? '—'}</div>
              </div>
              
              {data.companyProfile?.officers && (
                <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
                  <div className="text-gray-300 text-sm mb-3">Key Management</div>
                  {data.companyProfile?.officers?.officer?.slice(0, 3).map((officer:any, index:any) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                      <div>
                        <div className="text-white text-sm font-medium">{officer.firstName} {officer.lastName}</div>
                        <div className="text-gray-300 text-xs">{officer?.title?.Value}</div>
                      </div>
                      <div className="text-gray-300 text-xs">{officer.age && `Age: ${officer.age}`}</div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
                <div className="text-gray-300 text-sm mb-2">Current Price (Multi-Exchange)</div>
                {data.currentPrice && (
                  <div className="flex justify-between">
                    <div className="text-white font-medium">BSE: {formatCurrency(data.currentPrice.BSE)}</div>
                    <div className="text-white font-medium">NSE: {formatCurrency(data.currentPrice.NSE)}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Peer Comparison */}
        <div className="bg-gray-800 rounded-2xl p-6 mt-8 border border-gray-700 shadow-xl">
          <div 
            className="flex justify-between items-center cursor-pointer mb-6"
            onClick={() => toggleSection('peers')}
          >
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Building className="text-purple-400" />
              Peer Comparison
            </h3>
            {expandedSections.peers ? <ChevronUp className="text-gray-300" /> : <ChevronDown className="text-gray-300" />}
          </div>
          
          {expandedSections.peers && ((data.companyProfile?.peerCompanyList && data.companyProfile.peerCompanyList.length > 0) || (data.stockDetailsReusableData?.peerCompanyList && data.stockDetailsReusableData.peerCompanyList.length > 0)) && (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {(data.companyProfile?.peerCompanyList && data.companyProfile.peerCompanyList.length > 0 ? data.companyProfile.peerCompanyList : data.stockDetailsReusableData?.peerCompanyList || []).map((peer:any, index:any) => (
                <div key={index} className="bg-gray-700 rounded-xl p-5 border border-gray-600 hover:bg-gray-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    {peer.imageUrl && (
                      <img 
                        src={peer.imageUrl} 
                        alt={peer.companyName}
                        className="w-10 h-10 rounded-full bg-gray-600 p-1"
                        //@ts-ignore
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div>
                      <h4 className="text-white font-semibold text-lg">{peer.companyName}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-300 text-sm">{peer.tickerId}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          peer.overallRating === 'Bullish' 
                            ? 'bg-green-900 text-green-400' 
                            : 'bg-red-900 text-red-400'
                        }`}>
                          {peer.overallRating}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-600 rounded-lg p-3">
                      <div className="text-gray-300 text-xs mb-1">Current Price</div>
                      <div className="text-white font-semibold">{formatCurrency(peer.price)}</div>
                      <div className={`text-xs ${peer.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {peer.percentChange >= 0 ? '+' : ''}{peer.percentChange}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">ROE (TTM)</span>
                        <span className="text-white">{peer.returnOnAverageEquityTrailing12Month}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Net Margin</span>
                        <span className="text-white">{peer.netProfitMarginPercentTrailing12Month}%</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-600 rounded-lg p-3">
                      <div className="text-gray-300 text-xs mb-2">52-Week Range</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-400">{formatCurrency(peer.ylow)}</span>
                        <span className="text-gray-300">-</span>
                        <span className="text-green-400">{formatCurrency(peer.yhigh)}</span>
                      </div>
                      <div className="mt-2 bg-gray-500 rounded-full h-2 relative">
                        <div 
                          className="bg-gradient-to-r from-red-400 to-green-400 h-2 rounded-full absolute"
                          style={{
                            width: `${((peer.price - peer.ylow) / (peer.yhigh - peer.ylow)) * 100}%`
                          }}
                        />
                        <div 
                          className="absolute w-3 h-3 bg-white rounded-full -top-0.5 border-2 border-blue-400"
                          style={{
                            left: `${((peer.price - peer.ylow) / (peer.yhigh - peer.ylow)) * 100}%`,
                            transform: 'translateX(-50%)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialResearchDashboard;