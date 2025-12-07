'use client'

import DynamicFinancialCharts from "@/components/financialchart";
import FinancialResearchDashboard from "@/components/financialtitle";
import { Header } from "@/components/header";
import TradingViewWidget from "@/components/TVAdvChart"
import axios from "axios";
import React, { useState, KeyboardEvent, useRef } from "react";
import { BACKEND_URL, token } from "../dashboard/page";
import { Search, TrendingUp, BarChart3, Loader2, Bot, ChartBar, ChartArea } from "lucide-react";
import { LoaderOne } from "@/components/ui/loader";

// Component to render structured report data
const StructuredReport = ({ data }: { data: any }) => {
    if (!data) return null;

    // Parse the response if it's a string containing JSON
    let reportData;
    try {
        if (typeof data === 'string') {
            reportData = JSON.parse(data);
        } else if (data.res && typeof data.res === 'string') {
            reportData = JSON.parse(data.res);
        } else {
            reportData = data;
        }
    } catch (error) {
        console.error('Error parsing data:', error);
        return (
            <pre className="whitespace-pre-wrap bg-gray-800/50 p-4 rounded-lg overflow-auto text-sm text-gray-100">
                {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
            </pre>
        );
    }

    const report = reportData.report;
    if (!report) {
        return (
            <pre className="whitespace-pre-wrap bg-gray-800/50 p-4 rounded-lg overflow-auto text-sm text-gray-100">
                {JSON.stringify(reportData, null, 2)}
            </pre>
        );
    }

    return (
        <div className="text-gray-100 space-y-6">
            {/* Company Header */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-lg border border-blue-500/20">
                <h2 className="text-3xl font-bold text-white mb-2">{report.companyName}</h2>
                <p className="text-blue-400 text-lg">Ticker: {report.ticker}</p>
            </div>

            {/* Company Overview */}
            {report.companyOverviewAndSector && (
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/50">
                    <h3 className="text-xl font-semibold text-blue-400 mb-4">Company Overview & Sector</h3>
                    <p className="text-gray-300 mb-4">{report.companyOverviewAndSector.industryClassification}</p>
                    
                    {report.companyOverviewAndSector.mainProductsServices && (
                        <div>
                            <h4 className="text-lg font-medium text-gray-200 mb-2">Main Products & Services:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                {report.companyOverviewAndSector.mainProductsServices.map((service: string, index: number) => (
                                    <li key={index}>{service}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Financial Performance */}
            {report.financialPerformanceAnalysis && (
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/50">
                    <h3 className="text-xl font-semibold text-green-400 mb-4">Financial Performance Analysis</h3>
                    
                    {/* Profitability Ratios */}
                    {report.financialPerformanceAnalysis.profitabilityAndLeverageRatios && (
                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-200 mb-3">Key Financial Metrics</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                                    <p className="text-green-300 text-sm">Profit Margin</p>
                                    <p className="text-2xl font-bold text-white">{report.financialPerformanceAnalysis.profitabilityAndLeverageRatios.profitMargin}</p>
                                    <p className="text-xs text-gray-400 mt-1">{report.financialPerformanceAnalysis.profitabilityAndLeverageRatios.profitMarginAssessment}</p>
                                </div>
                                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                                    <p className="text-blue-300 text-sm">Return on Equity</p>
                                    <p className="text-2xl font-bold text-white">{report.financialPerformanceAnalysis.profitabilityAndLeverageRatios.returnOnEquity}</p>
                                    <p className="text-xs text-gray-400 mt-1">{report.financialPerformanceAnalysis.profitabilityAndLeverageRatios.returnOnEquityAssessment}</p>
                                </div>
                                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                                    <p className="text-purple-300 text-sm">Debt/Equity Ratio</p>
                                    <p className="text-2xl font-bold text-white">{report.financialPerformanceAnalysis.profitabilityAndLeverageRatios.debtEquityRatio}</p>
                                    <p className="text-xs text-gray-400 mt-1">{report.financialPerformanceAnalysis.profitabilityAndLeverageRatios.debtEquityRatioAssessment}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Growth Momentum */}
                    {report.financialPerformanceAnalysis.turnoverAndEarningsTrend?.growthMomentum && (
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                            <h4 className="text-md font-medium text-gray-200 mb-2">Growth Analysis</h4>
                            <p className="text-gray-300">{report.financialPerformanceAnalysis.turnoverAndEarningsTrend.growthMomentum}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Valuation */}
            {report.fundamentalValuation && (
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/50">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-4">Fundamental Valuation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-300 mb-2"><span className="font-medium">Current Price:</span> {report.fundamentalValuation.yesterdaysClosingPrice}</p>
                            <p className="text-gray-300">{report.fundamentalValuation.valuationExplanation}</p>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                        <p className="text-yellow-200">{report.fundamentalValuation.summary}</p>
                    </div>
                </div>
            )}

            {/* Competitive Advantage */}
            {report.diversificationAndCompetitiveAdvantage && (
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/50">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-4">Competitive Advantage & Diversification</h3>
                    
                    <div className="mb-4">
                        <h4 className="text-lg font-medium text-gray-200 mb-2">Revenue Diversification</h4>
                        <p className="text-gray-300">{report.diversificationAndCompetitiveAdvantage.revenueDiversification}</p>
                    </div>

                    {report.diversificationAndCompetitiveAdvantage.competitiveAdvantageMoat && (
                        <div>
                            <div className="flex items-center mb-3">
                                <h4 className="text-lg font-medium text-gray-200">Competitive Advantage Rating:</h4>
                                <span className="ml-2 px-3 py-1 bg-cyan-600 text-white rounded-full font-bold">
                                    {report.diversificationAndCompetitiveAdvantage.competitiveAdvantageMoat.competitiveAdvantageRating}
                                </span>
                            </div>
                            
                            <p className="text-gray-300 mb-4">{report.diversificationAndCompetitiveAdvantage.competitiveAdvantageMoat.summary}</p>
                            
                            {report.diversificationAndCompetitiveAdvantage.competitiveAdvantageMoat.keyAdvantages && (
                                <div className="mb-4">
                                    <h5 className="font-medium text-gray-200 mb-2">Key Advantages:</h5>
                                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                                        {report.diversificationAndCompetitiveAdvantage.competitiveAdvantageMoat.keyAdvantages.map((advantage: string, index: number) => (
                                            <li key={index}>{advantage}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {report.diversificationAndCompetitiveAdvantage.competitiveAdvantageMoat.mainCompetitors && (
                                <div>
                                    <h5 className="font-medium text-gray-200 mb-2">Main Competitors:</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {report.diversificationAndCompetitiveAdvantage.competitiveAdvantageMoat.mainCompetitors.map((competitor: string, index: number) => (
                                            <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                                                {competitor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Shareholder Value */}
            {report.shareholderValueAndEfficiency && (
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/50">
                    <h3 className="text-xl font-semibold text-indigo-400 mb-4">Shareholder Value & Efficiency</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-200 mb-2">Efficiency Rating</h4>
                            <span className={`px-4 py-2 rounded-full font-bold ${
                                report.shareholderValueAndEfficiency.efficiencyRating === 'Strong' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-600 text-gray-300'
                            }`}>
                                {report.shareholderValueAndEfficiency.efficiencyRating}
                            </span>
                            <p className="text-gray-300 mt-2">{report.shareholderValueAndEfficiency.efficiencyRatingJustification}</p>
                        </div>
                        <div>
                            <p className="text-gray-300">{report.shareholderValueAndEfficiency.shareholderYieldExplanation}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Conclusion */}
            {report.conclusion && (
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/50">
                    <h3 className="text-xl font-semibold text-orange-400 mb-4">Investment Conclusion</h3>
                    
                    <div className="mb-4">
                        <div className="flex items-center mb-3">
                            <h4 className="text-lg font-medium text-gray-200">Overall Assessment:</h4>
                            <span className={`ml-3 px-4 py-2 rounded-full font-bold ${
                                report.conclusion.overallAssessment === 'Positive' 
                                    ? 'bg-green-600 text-white' 
                                    : report.conclusion.overallAssessment === 'Negative'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-yellow-600 text-white'
                            }`}>
                                {report.conclusion.overallAssessment}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{report.conclusion.overallAssessmentReason}</p>
                    </div>

                    <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/30">
                        <p className="text-orange-100">{report.conclusion.summary}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Loading Component
const LoadingSpinner = ({ message }: { message?: string }) => (
    <div className="flex flex-col items-center justify-center py-12">
        <LoaderOne/>
        <p className="mt-4 text-lg text-gray-300">{message || "Loading..."}</p>
    </div>
);

// Empty State Component
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20">
        <h3 className="text-4xl font-bold text-white mb-3">Ready to Analyze Stocks</h3>
        <p className="text-gray-400 text-sm mt-4 text-center max-w-md mb-6">
            Enter a Nifty 50 stock symbol above to get comprehensive financial analysis, charts, and AI-powered insights.
        </p>
        <div className="flex gap-4 text-sm text-gray-500 mt-2">
            <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Real-time data</span>
            </div>
            <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Financial charts</span>
            </div>
            <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>AI analysis</span>
            </div>
        </div>
    </div>
);

// Demo data for fallback/testing
const getDemoData = (symbol: string) => ({
    companyName: symbol === 'TCS' ? 'Tata Consultancy Services Limited' : 
                 symbol === 'RELIANCE' ? 'Reliance Industries Limited' : 
                 `${symbol} Limited`,
    industry: 'Information Technology',
    companyProfile: 'A leading technology services company providing IT services, consulting, and business solutions.',
    exchangeCodeBse: symbol === 'TCS' ? '532540' : '500325',
    exchangeCodeNse: symbol === 'TCS' ? 'TCS' : 'RELIANCE',
    peerCompanyList: ['Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra'],
    percentChange: 2.45,
    yearHigh: 4250.00,
    yearLow: 3200.00,
    currentPrice: 3850.50,
    financials: [
        {
            stockFinancialMap: {
                CAS: [
                    { displayName: "Issuance( Retirement)of Debt Net ", key: "Issuance(Retirement)ofDebtNet", value: "5324.95", qoQComp: null, yqoQComp: null },
                    { displayName: "Net Changein Cash ", key: "NetChangeinCash", value: "2524.12", qoQComp: null, yqoQComp: null },
                    { displayName: "Cashfrom Operating Activities ", key: "CashfromOperatingActivities", value: "23511.81", qoQComp: null, yqoQComp: null },
                    { displayName: "Cashfrom Financing Activities ", key: "CashfromFinancingActivities", value: "-7002.44", qoQComp: null, yqoQComp: null },
                    { displayName: "Capital Expenditures ", key: "CapitalExpenditures", value: "-15670.52", qoQComp: null, yqoQComp: null }
                ],
                BAL: [
                    { displayName: "Total Assets ", key: "TotalAssets", value: "279394.80", qoQComp: null, yqoQComp: null },
                    { displayName: "Cash ", key: "Cash", value: "9604.96", qoQComp: null, yqoQComp: null },
                    { displayName: "Total Equity ", key: "TotalEquity", value: "91169.63", qoQComp: null, yqoQComp: null },
                    { displayName: "Total Liabilities ", key: "TotalLiabilities", value: "188225.17", qoQComp: null, yqoQComp: null },
                    { displayName: "Total Debt ", key: "TotalDebt", value: "94801.05", qoQComp: null, yqoQComp: null }
                ],
                INC: [
                    { displayName: "Total Revenue ", key: "TotalRevenue", value: "218542.51", qoQComp: null, yqoQComp: null },
                    { displayName: "Net Income ", key: "NetIncome", value: "3420.51", qoQComp: null, yqoQComp: null },
                    { displayName: "Operating Income ", key: "OperatingIncome", value: "14363.36", qoQComp: null, yqoQComp: null },
                    { displayName: "Gross Profit ", key: "GrossProfit", value: "94098.07", qoQComp: null, yqoQComp: null },
                    { displayName: "Costof Revenue Total ", key: "CostofRevenueTotal", value: "124444.44", qoQComp: null, yqoQComp: null }
                ]
            },
            FiscalYear: "2025",
            EndDate: "2025-03-31",
            Type: "Annual"
        },
        {
            stockFinancialMap: {
                CAS: [
                    { displayName: "Issuance( Retirement)of Debt Net ", key: "Issuance(Retirement)ofDebtNet", value: "4521.30", qoQComp: null, yqoQComp: null },
                    { displayName: "Net Changein Cash ", key: "NetChangeinCash", value: "2100.50", qoQComp: null, yqoQComp: null },
                    { displayName: "Cashfrom Operating Activities ", key: "CashfromOperatingActivities", value: "22100.25", qoQComp: null, yqoQComp: null },
                    { displayName: "Cashfrom Financing Activities ", key: "CashfromFinancingActivities", value: "-6500.20", qoQComp: null, yqoQComp: null },
                    { displayName: "Capital Expenditures ", key: "CapitalExpenditures", value: "-14500.30", qoQComp: null, yqoQComp: null }
                ],
                BAL: [
                    { displayName: "Total Assets ", key: "TotalAssets", value: "265000.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Cash ", key: "Cash", value: "8900.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Total Equity ", key: "TotalEquity", value: "87500.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Total Liabilities ", key: "TotalLiabilities", value: "177500.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Total Debt ", key: "TotalDebt", value: "92000.00", qoQComp: null, yqoQComp: null }
                ],
                INC: [
                    { displayName: "Total Revenue ", key: "TotalRevenue", value: "205000.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Net Income ", key: "NetIncome", value: "3100.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Operating Income ", key: "OperatingIncome", value: "13500.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Gross Profit ", key: "GrossProfit", value: "88000.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Costof Revenue Total ", key: "CostofRevenueTotal", value: "117000.00", qoQComp: null, yqoQComp: null }
                ]
            },
            FiscalYear: "2024",
            EndDate: "2024-03-31",
            Type: "Annual"
        },
        {
            stockFinancialMap: {
                CAS: [
                    { displayName: "Issuance( Retirement)of Debt Net ", key: "Issuance(Retirement)ofDebtNet", value: "3800.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Net Changein Cash ", key: "NetChangeinCash", value: "1800.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Cashfrom Operating Activities ", key: "CashfromOperatingActivities", value: "20000.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Cashfrom Financing Activities ", key: "CashfromFinancingActivities", value: "-5800.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Capital Expenditures ", key: "CapitalExpenditures", value: "-13000.00", qoQComp: null, yqoQComp: null }
                ],
                BAL: [
                    { displayName: "Total Assets ", key: "TotalAssets", value: "250000.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Cash ", key: "Cash", value: "8200.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Total Equity ", key: "TotalEquity", value: "84000.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Total Liabilities ", key: "TotalLiabilities", value: "166000.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Total Debt ", key: "TotalDebt", value: "89000.00", qoQComp: null, yqoQComp: null }
                ],
                INC: [
                    { displayName: "Total Revenue ", key: "TotalRevenue", value: "192000.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Net Income ", key: "NetIncome", value: "2850.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Operating Income ", key: "OperatingIncome", value: "12500.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Gross Profit ", key: "GrossProfit", value: "82000.00", qoQComp: null, yqoQComp: null },
                    { displayName: "Costof Revenue Total ", key: "CostofRevenueTotal", value: "110000.00", qoQComp: null, yqoQComp: null }
                ]
            },
            FiscalYear: "2023",
            EndDate: "2023-03-31",
            Type: "Annual"
        }
    ]
});

export default function StockAnalysis() {
    const [inputValue, setInputValue] = useState("");
    const [symbols, setSymbols] = useState<string[]>([]);
    const [financialdata, setFinancialData] = useState<{}>();
    const [financialArray, setFinancialArray] = useState<{ financials: any[] } | undefined>(undefined);
    const [showAIOptions, setShowAIOptions] = useState(false);
    const [stockin, setstockin] = useState<string | undefined>();
    const [isLoadingStock, setIsLoadingStock] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    
    // Popup state
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState<any>(null);
    const [popupTitle, setPopupTitle] = useState("");
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    const aiButtonRef = useRef<HTMLDivElement>(null);

    const handleAddSymbol = async () => {
        const trimmed = inputValue.trim().toUpperCase();
        if (!trimmed) return;
        
        setSymbols((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
        setInputValue("");
        setHasSearched(true);
        await getfinancialdata([trimmed]);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddSymbol();
        }
    };

    // Function to handle API calls and show popup
    const handleAPICall = async (endpoint: string, title: string) => {
        if (!financialdata) {
            alert("Please search for a stock first!");
            return;
        }
        
        setIsLoadingAI(true);
        setPopupTitle(title);
        setShowPopup(true);
        
        try {
            const res = await axios.post(`${BACKEND_URL}/stock/${endpoint}`, {
                data: financialdata,
                stockinfo: stockin
            });
            setPopupData(res.data);
        } catch (error) {
            console.error(`Error fetching ${title}:`, error);
            setPopupData({ error: `Failed to fetch ${title}` });
        } finally {
            setIsLoadingAI(false);
        }
    };

    // Function to close popup
    const closePopup = () => {
        setShowPopup(false);
        setPopupData(null);
        setPopupTitle("");
        setShowAIOptions(false);
    };

    async function getfinancialdata(symbols: string[]) {
        setIsLoadingStock(true);
        try {
            const response = await axios.get(`https://stock.indianapi.in/stock?name=${symbols[0]}`, {
                headers: {
                    'X-API-KEY': process.env.NEXT_PUBLIC_X_API_KEY
                }
            });

            if (response?.data) {
                const {
                    companyName,
                    industry,
                    companyProfile,
                    exchangeCodeBse,
                    exchangeCodeNse,
                    peerCompanyList,
                    percentChange,
                    yearHigh,
                    yearLow,
                    currentPrice
                } = response.data;

                const apiFinancials = Array.isArray(response.data.financials) ? response.data.financials : [];

                setFinancialData({
                    companyName,
                    industry,
                    companyProfile,
                    exchangeCodeBse,
                    exchangeCodeNse,
                    peerCompanyList,
                    percentChange,
                    yearHigh,
                    yearLow,
                    currentPrice
                });

                setstockin(companyName);

                const Arr = apiFinancials.slice(0, 3).filter(Boolean);
                setFinancialArray({ financials: Arr });
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
            console.log('Using demo data as fallback');
            
            // Use demo data as fallback
            const demoData = getDemoData(symbols[0]);
            const {
                companyName,
                industry,
                companyProfile,
                exchangeCodeBse,
                exchangeCodeNse,
                peerCompanyList,
                percentChange,
                yearHigh,
                yearLow,
                currentPrice,
                financials
            } = demoData;

            setFinancialData({
                companyName,
                industry,
                companyProfile,
                exchangeCodeBse,
                exchangeCodeNse,
                peerCompanyList,
                percentChange,
                yearHigh,
                yearLow,
                currentPrice
            });

            setstockin(companyName);

            const Arr = financials.slice(0, 3).filter(Boolean);
            setFinancialArray({ financials: Arr });
        } finally {
            setIsLoadingStock(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 relative">
            <Header />

            <div className="container mx-auto px-6 py-8 space-y-8 relative">
                {/* Search Section */}
                <div className="bg-gray-900 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-6 flex flex-col relative">
                    <h2 className="text-2xl font-bold mb-4 text-white">Stock Analysis</h2>
                    <div className="flex gap-3 items-center">
                        <div className="relative flex-1 bg-black">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter Nifty 50 symbol (e.g. RELIANCE, TCS)"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="input-field w-full bg-gray-800/50 border border-white/40 text-white placeholder-gray-400  rounded-lg pl-10 pr-4 py-2 "
                                disabled={isLoadingStock}
                            />
                        </div>
                        <button
                            onClick={handleAddSymbol}
                            disabled={isLoadingStock || !inputValue.trim()}
                            className="px-6 py-2 bg-white hover:bg-white/90 text-black disabled:bg-gray-600 
                            disabled:text-white disabled:cursor-not-allowe rounded-lg font-medium transition-colors duration-200 shadow-lg flex items-center gap-2"
                        >
                            {isLoadingStock ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Analyze Stock"
                            )}
                        </button>

                        {/* AI Button */}
                        <div ref={aiButtonRef} className="relative">
                            <button
                                onClick={() => setShowAIOptions(!showAIOptions)}
                                disabled={!financialdata}
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-900 disabled:bg-gray-600 text-white font-bold shadow-lg hover:bg-indigo-700 disabled:hover:bg-gray-600 transition disabled:cursor-not-allowed"
                                title={!financialdata ? "Search for a stock first" : "AI Analysis Options"}
                            >
                                <ChartArea className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Show current symbol if exists */}
                    {symbols.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                            <span className="text-sm text-gray-400">Analyzing:</span>
                            <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
                                {symbols[0]}
                            </span>
                        </div>
                    )}
                </div>

                {/* AI Popup Buttons */}
                {showAIOptions && financialdata && (
                    <div className="absolute right-8 top-48 grid grid-cols-3 gap-4 bg-black/90 border border-white/20 rounded-xl p-4 shadow-2xl z-50">
                        <button 
                            onClick={() => handleAPICall('fullanalysis', 'Full Analysis')}
                            className="px-4 py-2 bg-white hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
                        >
                            Full Analysis
                        </button>
                        <button
                            onClick={() => handleAPICall('business-explained', 'Business Explanation')}
                            className="px-4 py-2 bg-white hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
                        >
                            Business Explanation
                        </button>
                        <button
                            onClick={() => handleAPICall('competitors', 'Competitors')}
                            className="px-4 py-2 bg-white hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
                        >
                            Competitors
                        </button>
                        <button
                            onClick={() => handleAPICall('financial-scorecard', 'Financial Scorecard')}
                            className="px-4 py-2  bg-white hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
                        >
                            Financial Scorecard
                        </button>
                        <button
                            onClick={() => handleAPICall('future-prospects', 'Future Prospects')}
                            className="px-4 py-2  bg-white hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
                        >
                            Future Prospects
                        </button>
                    </div>
                )}

                {/* Popup Modal */}
                {showPopup && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-[100] p-4">
                        <div className="bg-gray-900 border border-white/40 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <h3 className="text-2xl font-bold text-white">{popupTitle}</h3>
                                <button
                                    onClick={closePopup}
                                    className="text-gray-400 hover:text-white transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 overflow-auto p-6">
                                {isLoadingAI ? (
                                    <LoadingSpinner message={`Loading ${popupTitle}...`} />
                                ) : popupData?.error ? (
                                    <div className="text-red-400 text-center py-8">
                                        <p className="text-xl">{popupData.error}</p>
                                    </div>
                                ) : (
                                    <StructuredReport data={popupData} />
                                )}
                            </div>
                            
                            {/* Footer */}
                            <div className="p-6 border-t border-white/10 flex justify-end">
                                <button
                                    onClick={closePopup}
                                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content - Only show if user has searched or is loading */}
                {!hasSearched ? (
                    <EmptyState />
                ) : isLoadingStock ? (
                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg">
                        <LoadingSpinner message="Fetching stock data and financial information..." />
                    </div>
                ) : financialdata ? (
                    <>
                        {/* Financial Dashboard */}
                        <div className="bg-black/20 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg overflow-hidden">
                            <FinancialResearchDashboard stockData={financialdata} />
                        </div>

                        {/* Trading View Chart */}
                        <div className="bg-gray-900 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg overflow-hidden p-3">
                            <div className="p-4 border-b border-white/10">
                                <h3 className="text-xl font-semibold text-white">Price Chart</h3>
                            </div>
                            <div className="w-full h-140">
                                <TradingViewWidget symbol={symbols[0] ?? "HDFCBANK"} />
                            </div>
                        </div>

                        {/* Financial Charts */}
                        <div className="bg-gray-900 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-white/10">
                                <h3 className="text-xl font-semibold text-white">Financial Analysis</h3>
                            </div>
                            <DynamicFinancialCharts data={financialArray} />
                        </div>
                    </>
                ) : hasSearched ? (
                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg">
                        <div className="text-center py-12">
                            <div className="text-red-400 text-xl mb-4">Failed to load stock data</div>
                            <p className="text-gray-400">Please check the stock symbol and try again.</p>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}