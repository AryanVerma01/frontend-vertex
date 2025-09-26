
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

        }
    }


    return(
        <>
            <Header/>
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
            <FinancialResearchDashboard stockData={financialdata}/>
            <div className="w-full h-150">
                <TradingViewWidget symbol={symbols[0] ?? "HDFCBANK"} />
            </div>
            <DynamicFinancialCharts data={financialArray} /> 
        </>
    )
}