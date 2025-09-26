"use client"

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Users, Building, ChevronDown, ChevronUp, Activity, BarChart3, PieChart } from 'lucide-react';

const FinancialResearchDashboard = ({ stockData }:any) => {
  const [expandedSections, setExpandedSections] = useState({
    dividends: false,
    meetings: false,
    peers: false,
    companyInfo: false,
    technicalData: false
  });

  // Default data structure if no props provided (for demo purposes)
  const defaultStockData = {
    stockDetailsReusableData: {
      close: "171.50",
      date: "22 Sep 2025",
      time: "10:26:15",
      price: "167.45",
      percentChange: "-2.81",
      marketCap: "209095.78",
      yhigh: "174.35",
      ylow: "122.60",
      high: "172.20",
      low: "170.40",
      pPerEBasicExcludingExtraordinaryItemsTTM: "43.86",
      currentDividendYieldCommonStockPrimaryIssueLTM: "2.10",
      priceYTDPricePercentChange: "24.22",
      price5DayPercentChange: "1.00",
      NetIncome: "3420.51",
      averageRating: "Buy",
      peerCompanyList: [
        {
          tickerId: "S0003097",
          companyName: "Jsw Steel",
          priceToBookValueRatio: 3.21,
          priceToEarningsValueRatio: 66.66,
          marketCap: 276506.29,
          price: 1130.4,
          percentChange: -1.62,
          netChange: -18.65,
          returnOnAverageEquity5YearAverage: 14.28,
          returnOnAverageEquityTrailing12Month: 4.46,
          ltDebtPerEquityMostRecentFiscalYear: 106.15,
          netProfitMargin5YearAverage: 6.17,
          netProfitMarginPercentTrailing12Month: 2.07,
          dividendYieldIndicatedAnnualDividend: 0.27,
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
          priceToBookValueRatio: 2.27,
          priceToEarningsValueRatio: 53.89,
          marketCap: 209095.78,
          price: 167.45,
          percentChange: -2.81,
          netChange: -4.85,
          returnOnAverageEquity5YearAverage: 11.84,
          returnOnAverageEquityTrailing12Month: 3.73,
          ltDebtPerEquityMostRecentFiscalYear: 80.49,
          netProfitMargin5YearAverage: 5.16,
          netProfitMarginPercentTrailing12Month: 1.45,
          dividendYieldIndicatedAnnualDividend: 2.17,
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
          priceToBookValueRatio: 2.05,
          priceToEarningsValueRatio: 26.71,
          marketCap: 104853.74,
          price: 1029.6,
          percentChange: -2.12,
          netChange: -22.3,
          returnOnAverageEquity5YearAverage: 13.84,
          returnOnAverageEquityTrailing12Month: 6.15,
          ltDebtPerEquityMostRecentFiscalYear: 30.85,
          netProfitMargin5YearAverage: 11.2,
          netProfitMarginPercentTrailing12Month: 5.74,
          dividendYieldIndicatedAnnualDividend: 0.21,
          totalSharesOutstanding: 101.84,
          languageSupport: "जिंदल स्टील और पावर",
          imageUrl: "https://logo.clearbit.com/jindalsteelpower.com/",
          overallRating: "Bullish",
          yhigh: 1070,
          ylow: 723.95
        },
        {
          tickerId: "S0000356",
          companyName: "Lloyds Metals And Energy",
          priceToBookValueRatio: 12.51,
          priceToEarningsValueRatio: 58.71,
          marketCap: 65784.88,
          price: 1257,
          percentChange: -1.5,
          netChange: -19.2,
          returnOnAverageEquity5YearAverage: 30.23,
          returnOnAverageEquityTrailing12Month: 31.47,
          ltDebtPerEquityMostRecentFiscalYear: 12.34,
          netProfitMargin5YearAverage: 14.23,
          netProfitMarginPercentTrailing12Month: 21.8,
          dividendYieldIndicatedAnnualDividend: 0.07,
          totalSharesOutstanding: 52.33,
          languageSupport: "लॉयड्स मेटल्स और एनर्जी",
          imageUrl: "https://images.mintgenie.com/prod/stock/L.png",
          overallRating: "Bearish",
          yhigh: 1613.4,
          ylow: 839.25
        },
        {
          tickerId: "S0003614",
          companyName: "Jindal Stainless",
          priceToBookValueRatio: 3.44,
          priceToEarningsValueRatio: 22.9,
          marketCap: 64883.99,
          price: 790,
          percentChange: 0.41,
          netChange: 3.25,
          returnOnAverageEquity5YearAverage: 22.1,
          returnOnAverageEquityTrailing12Month: 16.14,
          ltDebtPerEquityMostRecentFiscalYear: 26.44,
          netProfitMargin5YearAverage: 6.82,
          netProfitMarginPercentTrailing12Month: 6.36,
          dividendYieldIndicatedAnnualDividend: 0.29,
          totalSharesOutstanding: 82.13,
          languageSupport: "जिंदल स्टेनलेस",
          imageUrl: "https://logo.clearbit.com/jindalstainless.com/",
          overallRating: "Bullish",
          yhigh: 818.2,
          ylow: 497
        }
      ]
    },
    stockCorporateActionData: {
      dividend: [
        {
          companyName: "Tata Steel",
          value: 3.6,
          percentage: 360,
          recordDate: "2025-06-06",
          interimOrFinal: "Final"
        },
        {
          companyName: "Tata Steel",
          value: 3.6,
          percentage: 360,
          recordDate: "2024-06-21",
          interimOrFinal: "Final"
        }
      ],
      boardMeetings: [
        {
          companyName: "Tata Steel",
          boardMeetDate: "2025-07-30",
          purpose: "Quarterly Results & Others"
        },
        {
          companyName: "Tata Steel",
          boardMeetDate: "2025-05-12",
          purpose: "Audited Results & Final Dividend"
        }
      ],
      splits: [
        {
          companyName: "Tata Steel",
          oldFaceValue: 10,
          newFaceValue: 1,
          recordDate: "2022-07-29"
        }
      ]
    }
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


  //@ts-ignore
  const formatMarketCap = (value) => {
    const num = parseFloat(value);
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L Cr`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(2)}K Cr`;
    return `₹${num.toFixed(2)} Cr`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Financial Research Dashboard</h1>
          <p className="text-blue-200">Real-time stock analysis and corporate insights</p>
        </div>

        {/* Main Stock Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">{data.companyName || "Tata Steel"}</h2>
              <p className="text-blue-200">{data.companyProfile?.exchangeCodeNse || "TATASTEEL"} • {data.industry || "Steel Sector"}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{formatCurrency((data.currentPrice?.NSE ?? data.stockDetailsReusableData?.price ?? 0))}</div>
              <div className={`flex items-center gap-1 ${parseFloat((data.percentChange ?? data.stockDetailsReusableData?.percentChange ?? '0') as string) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat((data.percentChange ?? data.stockDetailsReusableData?.percentChange ?? '0') as string) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{(data.percentChange ?? data.stockDetailsReusableData?.percentChange ?? '0')}%</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="text-blue-400" size={20} />
                <span className="text-blue-200 text-sm">Market Cap</span>
              </div>
              <div className="text-xl font-semibold text-white">{formatMarketCap(data.stockDetailsReusableData?.marketCap ?? 0)}</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="text-green-400" size={20} />
                <span className="text-blue-200 text-sm">P/E Ratio</span>
              </div>
              <div className="text-xl font-semibold text-white">{data.stockDetailsReusableData?.pPerEBasicExcludingExtraordinaryItemsTTM ?? '—'}</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-yellow-400" size={20} />
                <span className="text-blue-200 text-sm">52W High</span>
              </div>
              <div className="text-xl font-semibold text-white">{formatCurrency((data.yearHigh ?? data.stockDetailsReusableData?.yhigh ?? 0))}</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-purple-400" size={20} />
                <span className="text-blue-200 text-sm">YTD Return</span>
              </div>
              <div className="text-xl font-semibold text-green-400">+{data.stockDetailsReusableData?.priceYTDPricePercentChange ?? '—'}%</div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Company Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <div 
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('companyInfo')}
            >
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Building className="text-indigo-400" />
                Company Information
              </h3>
              {expandedSections.companyInfo ? <ChevronUp className="text-blue-200" /> : <ChevronDown className="text-blue-200" />}
            </div>
            
            {expandedSections.companyInfo && data.companyProfile && (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-blue-200 text-sm mb-2">Industry & Exchange</div>
                  <div className="text-white font-semibold">{data.companyProfile?.mgIndustry ?? '—'}</div>
                  <div className="text-blue-200 text-sm mt-1">BSE: {data.companyProfile?.exchangeCodeBse ?? '—'} | NSE: {data.companyProfile?.exchangeCodeNse ?? '—'}</div>
                </div>
                
                {data.companyProfile?.officers && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-blue-200 text-sm mb-3">Key Management</div>
                    {data.companyProfile?.officers?.officer?.slice(0, 3).map((officer:any, index:any) => (
                      <div key={index} className="flex justify-between items-center mb-2">
                        <div>
                          <div className="text-white text-sm font-medium">{officer.firstName} {officer.lastName}</div>
                          <div className="text-blue-200 text-xs">{officer?.title?.Value}</div>
                        </div>
                        <div className="text-blue-200 text-xs">{officer.age && `Age: ${officer.age}`}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-blue-200 text-sm mb-2">Current Price (Multi-Exchange)</div>
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

          {/* Technical Data */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <div 
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('technicalData')}
            >
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <PieChart className="text-cyan-400" />
                Technical Analysis
              </h3>
              {expandedSections.technicalData ? <ChevronUp className="text-blue-200" /> : <ChevronDown className="text-blue-200" />}
            </div>
            
            {expandedSections.technicalData && data.stockTechnicalData && (
              <div className="space-y-3">
                {data.stockTechnicalData.map((tech:any, index:any) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-semibold">{tech.days} Days Average</div>
                        <div className="text-blue-200 text-sm">Historical Performance</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">BSE: {formatCurrency(tech.bsePrice)}</div>
                        <div className="text-blue-200 text-sm">NSE: {formatCurrency(tech.nsePrice)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Original Content Grid - Dividends and Board Meetings */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Dividends Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <div 
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('dividends')}
            >
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <DollarSign className="text-green-400" />
                Dividend History
              </h3>
              {expandedSections.dividends ? <ChevronUp className="text-blue-200" /> : <ChevronDown className="text-blue-200" />}
            </div>
            
            {expandedSections.dividends && data.stockCorporateActionData && (
              <div className="space-y-4">
                {data.stockCorporateActionData.dividend.map((dividend:any, index:any) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-semibold">{formatCurrency(dividend.value)} per share</div>
                        <div className="text-blue-200 text-sm">{dividend.interimOrFinal} Dividend • {dividend.percentage}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{dividend.recordDate}</div>
                        <div className="text-blue-200 text-sm">Record Date</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Board Meetings Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <div 
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection('meetings')}
            >
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="text-blue-400" />
                Board Meetings
              </h3>
              {expandedSections.meetings ? <ChevronUp className="text-blue-200" /> : <ChevronDown className="text-blue-200" />}
            </div>
            
            {expandedSections.meetings && data.stockCorporateActionData && (
              <div className="space-y-4">
                {data.stockCorporateActionData.boardMeetings.slice(0, 3).map((meeting:any, index:any) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-semibold">{meeting.boardMeetDate}</div>
                        <div className="text-blue-200 text-sm">{meeting.purpose}</div>
                      </div>
                      <div className="text-blue-400">
                        <Calendar size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Peer Comparison */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mt-8 border border-white/20 shadow-xl">
          <div 
            className="flex justify-between items-center cursor-pointer mb-6"
            onClick={() => toggleSection('peers')}
          >
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Building className="text-purple-400" />
              Peer Comparison
            </h3>
            {expandedSections.peers ? <ChevronUp className="text-blue-200" /> : <ChevronDown className="text-blue-200" />}
          </div>
          
          {expandedSections.peers && ((data.companyProfile?.peerCompanyList && data.companyProfile.peerCompanyList.length > 0) || (data.stockDetailsReusableData?.peerCompanyList && data.stockDetailsReusableData.peerCompanyList.length > 0)) && (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {(data.companyProfile?.peerCompanyList && data.companyProfile.peerCompanyList.length > 0 ? data.companyProfile.peerCompanyList : data.stockDetailsReusableData?.peerCompanyList || []).map((peer:any, index:any) => (
                <div key={index} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    {peer.imageUrl && (
                      <img 
                        src={peer.imageUrl} 
                        alt={peer.companyName}
                        className="w-10 h-10 rounded-full bg-white/10 p-1"
                        //@ts-ignore
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div>
                      <h4 className="text-white font-semibold text-lg">{peer.companyName}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-blue-200 text-sm">{peer.tickerId}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          peer.overallRating === 'Bullish' 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-red-400/20 text-red-400'
                        }`}>
                          {peer.overallRating}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-blue-200 text-xs mb-1">Current Price</div>
                        <div className="text-white font-semibold">{formatCurrency(peer.price)}</div>
                        <div className={`text-xs ${peer.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {peer.percentChange >= 0 ? '+' : ''}{peer.percentChange}%
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-blue-200 text-xs mb-1">Market Cap</div>
                        <div className="text-white font-semibold">{formatMarketCap(peer.marketCap)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-200">P/E Ratio</span>
                        <span className="text-white">{peer.priceToEarningsValueRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">P/B Ratio</span>
                        <span className="text-white">{peer.priceToBookValueRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">ROE (TTM)</span>
                        <span className="text-white">{peer.returnOnAverageEquityTrailing12Month}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Net Margin</span>
                        <span className="text-white">{peer.netProfitMarginPercentTrailing12Month}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Div Yield</span>
                        <span className="text-white">{peer.dividendYieldIndicatedAnnualDividend}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Debt/Equity</span>
                        <span className="text-white">{peer.ltDebtPerEquityMostRecentFiscalYear}</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-blue-200 text-xs mb-2">52-Week Range</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-300">{formatCurrency(peer.ylow)}</span>
                        <span className="text-blue-200">-</span>
                        <span className="text-green-300">{formatCurrency(peer.yhigh)}</span>
                      </div>
                      <div className="mt-2 bg-white/10 rounded-full h-2 relative">
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

        {/* Footer */}
        <div className="text-center mt-12 text-blue-200">
          <p>Last Updated: {data.stockDetailsReusableData?.date || "22 Sep 2025"} at {data.stockDetailsReusableData?.time || "10:26:15"}</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialResearchDashboard;