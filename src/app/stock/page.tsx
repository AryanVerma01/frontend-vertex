
'use client'

import DynamicFinancialCharts from "@/components/financialchart";
import FinancialResearchDashboard from "@/components/financialtitle";
import { Header } from "@/components/header";
import TradingViewWidget from "@/components/TVAdvChart"
import axios from "axios";
import React, { useState, KeyboardEvent, useEffect } from "react";

export default function StockAnalysis(){
    const [inputValue, setInputValue] = useState("");
    const [symbols, setSymbols] = useState<string[]>([]);
    const [financialdata,setFinancialData] = useState<{}>();
    const [financialArray,setFinancialArray] = useState<{ financials: any[] } | undefined>(undefined);

    const handleAddSymbol = () => {
        const trimmed = inputValue.trim().toUpperCase();
        if (!trimmed) return;
        setSymbols((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
        setInputValue("");
        getfinancialdata([trimmed])
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddSymbol();
        }
    };

    async function getfinancialdata(symbols : string[]) {
        const response = await axios.get(`https://stock.indianapi.in/stock?name=${symbols[0]}`,{
            headers: {
                'X-Api-Key': 'sk-live-lOeu1A68LnXNz3d0Tav3j3SWijdNn76933lH0o5l'
            }
        }) 

        console.log(response.data);

        if(response?.data){

        const companyName = response.data.companyName ;
        const industry = response.data.industry ;
        const companyProfile = response.data.companyProfile ;
        const exchangeCodeBse = response.data.exchangeCodeBse;
        const exchangeCodeNse = response.data.exchangeCodeNse;
        const peerCompanyList = response.data.peerCompanyList;
        const percentChange = response.data.percentChange;
        const yearHigh = response.data.yearHigh;
        const yearLow = response.data.yearLow;
        const currentPrice = response.data.currentPrice;
        const stockCorporateActionData = response.data.stockCorporateActionData;
        const stockDetailsReusableData = response.data.stockDetailsReusableData;


        const stockDetails = response.data.stockDetails;
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

        const Arr = apiFinancials.slice(0,3).filter(Boolean);
        setFinancialArray({ financials: Arr });

        console.log(financialdata);
        }
    }


    return(
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
            <Header/>
            
            <div className="container mx-auto px-6 py-8 space-y-8">
                {/* Search Section */}
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-white">Stock Analysis</h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Enter Nifty 50 symbol (e.g., RELIANCE, TCS)"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input-field flex-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        />
                        <button
                            onClick={handleAddSymbol}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            Add Symbol
                        </button>
                    </div>
                </div>

                {/* Financial Dashboard */}
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg overflow-hidden">
                    <FinancialResearchDashboard stockData={financialdata}/>
                </div>

                {/* Trading View Chart */}
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="text-xl font-semibold text-white">Price Chart</h3>
                    </div>
                    <div className="w-full h-140">
                        <TradingViewWidget symbol={symbols[0] ?? "HDFCBANK"} />
                    </div>
                </div>

                {/* Financial Charts */}
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="text-xl font-semibold text-white">Financial Analysis</h3>
                    </div>
                    <DynamicFinancialCharts data={financialArray} />
                </div>
            </div>
        </div>
    )
}